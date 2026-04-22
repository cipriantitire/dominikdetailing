import 'server-only'

// Very small, in-memory fixed-window rate limiter.
// Note: suitable for single-instance or low-traffic dev/staging. For production
// use a centralized store (Redis, Vercel KV, Upstash) to share limits across instances.

const DEFAULT_WINDOW_SEC = Number(process.env.RATE_LIMIT_WINDOW_SEC ?? 60)
const DEFAULT_MAX = Number(process.env.RATE_LIMIT_MAX_PER_WINDOW ?? 10)

type Entry = { windowStart: number; count: number }

const store: Map<string, Entry> = new Map()

function nowSec() {
  return Math.floor(Date.now() / 1000)
}

export function isLimited(key: string, max = DEFAULT_MAX, windowSec = DEFAULT_WINDOW_SEC) {
  const current = nowSec()
  const entry = store.get(key)
  if (!entry) {
    store.set(key, { windowStart: current, count: 1 })
    return false
  }

  if (current - entry.windowStart >= windowSec) {
    // window expired
    store.set(key, { windowStart: current, count: 1 })
    return false
  }

  if (entry.count >= max) {
    return true
  }

  entry.count += 1
  store.set(key, entry)
  return false
}

export function resetLimit(key: string) {
  store.delete(key)
}

export function getLimitStatus(key: string) {
  const entry = store.get(key)
  if (!entry) return { remaining: DEFAULT_MAX, windowStart: 0 }
  return { remaining: Math.max(0, DEFAULT_MAX - entry.count), windowStart: entry.windowStart }
}
