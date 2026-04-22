const UK_POSTCODE_REGEX =
  /^(GIR 0AA|(?:[A-PR-UWYZ][0-9][0-9]?|[A-PR-UWYZ][A-HK-Y][0-9][0-9]?|[A-PR-UWYZ][0-9][A-HJKPSTUW]|[A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]) [0-9][ABD-HJLNP-UW-Z]{2})$/i

export function normalizeUkPostcode(value: string) {
  const compact = value.toUpperCase().replace(/[^A-Z0-9]/g, "")
  if (compact.length <= 3) return compact
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`
}

export function isValidUkPostcode(value: string) {
  const normalized = normalizeUkPostcode(value)
  return UK_POSTCODE_REGEX.test(normalized)
}
