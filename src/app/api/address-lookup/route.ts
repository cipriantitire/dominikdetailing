import 'server-only'

import { NextResponse } from 'next/server'

import { isValidUkPostcode, normalizeUkPostcode } from '@/lib/location/ukPostcode'
import { isLimited } from '@/lib/rateLimiter'

type PostcodesIoResult = {
  postcode?: string
  country?: string
  region?: string
  admin_district?: string
  admin_ward?: string
  parish?: string
  latitude?: number
  longitude?: number
}

type PostcodesIoResponse = {
  status?: number
  result?: PostcodesIoResult | null
}

type PostcodeContext = {
  postcode: string
  country?: string
  region?: string
  district?: string
  ward?: string
  parish?: string
  latitude?: number
  longitude?: number
}

const LOOKUP_RATE_LIMIT_MAX = Number(process.env.ADDRESS_LOOKUP_RATE_LIMIT_MAX ?? 20)
const LOOKUP_RATE_LIMIT_WINDOW_SEC = Number(process.env.ADDRESS_LOOKUP_RATE_LIMIT_WINDOW_SEC ?? 60)
const LOOKUP_TIMEOUT_MS = Number(process.env.ADDRESS_LOOKUP_TIMEOUT_MS ?? 7000)

function getClientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS)

  try {
    return await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
    })
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

async function lookupPostcodesIo(postcode: string) {
  const compactPostcode = postcode.replace(/\s+/g, '')
  const endpoints = [
    `https://postcodes.io/postcodes/${encodeURIComponent(compactPostcode)}`,
    `https://api.postcodes.io/postcodes/${encodeURIComponent(compactPostcode)}`,
  ]

  let sawNotFound = false

  for (const endpoint of [...new Set(endpoints)]) {
    const response = await fetchWithTimeout(endpoint)
    if (!response) continue

    if (response.status === 404) {
      sawNotFound = true
      continue
    }

    if (!response.ok) continue

    const raw = await response.text()
    if (!raw) continue

    let payload: PostcodesIoResponse | null = null
    try {
      payload = JSON.parse(raw) as PostcodesIoResponse
    } catch {
      payload = null
    }

    const result = payload?.result
    if (!result) continue

    const normalizedPostcode = result.postcode && isValidUkPostcode(result.postcode)
      ? normalizeUkPostcode(result.postcode)
      : postcode

    const context: PostcodeContext = {
      postcode: normalizedPostcode,
      country: result.country || undefined,
      region: result.region || undefined,
      district: result.admin_district || undefined,
      ward: result.admin_ward || undefined,
      parish: result.parish || undefined,
      latitude: typeof result.latitude === 'number' ? result.latitude : undefined,
      longitude: typeof result.longitude === 'number' ? result.longitude : undefined,
    }

    return {
      kind: 'ok' as const,
      context,
    }
  }

  if (sawNotFound) {
    return { kind: 'not-found' as const }
  }

  return { kind: 'unavailable' as const }
}

export async function GET(req: Request) {
  const ip = getClientIp(req)
  if (isLimited(`address-lookup:${ip}`, LOOKUP_RATE_LIMIT_MAX, LOOKUP_RATE_LIMIT_WINDOW_SEC)) {
    return NextResponse.json({ ok: false, error: 'Too many lookup requests. Please try again.' }, { status: 429 })
  }

  const url = new URL(req.url)
  const postcode = normalizeUkPostcode(url.searchParams.get('postcode') || '')

  if (!postcode) {
    return NextResponse.json({ ok: false, error: 'Postcode is required.' }, { status: 400 })
  }

  if (!isValidUkPostcode(postcode)) {
    return NextResponse.json({ ok: false, error: 'Enter a valid UK postcode.' }, { status: 400 })
  }

  const lookup = await lookupPostcodesIo(postcode)

  if (lookup.kind === 'not-found') {
    return NextResponse.json(
      { ok: false, error: 'This postcode does not appear to be valid in the UK postcode directory.' },
      { status: 400 },
    )
  }

  if (lookup.kind === 'unavailable') {
    return NextResponse.json(
      { ok: false, error: 'Postcode lookup is temporarily unavailable. Please try again.' },
      { status: 503 },
    )
  }

  const { context } = lookup

  return NextResponse.json({
    ok: true,
    provider: 'postcodes-io',
    postcode: context.postcode,
    addresses: [],
    postcodeContext: context,
    location:
      typeof context.latitude === 'number' && typeof context.longitude === 'number'
        ? { latitude: context.latitude, longitude: context.longitude }
        : null,
    message: 'Postcode confirmed. Enter your house number and street manually below.',
  })
}
