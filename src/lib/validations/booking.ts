import { z, ZodError } from 'zod'
import { serviceTiers, serviceExtras, timeWindows } from '../../config/services'
import { isValidUkPostcode, normalizeUkPostcode } from '../location/ukPostcode'

// Build runtime allowed value lists from config
// Widen the literal types to plain string[] so Zod predicates accept string inputs
const SERVICE_IDS = serviceTiers.map((s) => s.id as string) as string[]
const EXTRA_IDS = serviceExtras.map((e) => e.id as string) as string[]
// timeWindows is a readonly tuple; cast via unknown first to satisfy TS when converting
const TIME_WINDOWS = (timeWindows as unknown) as string[]

const dateNotPast = (val: string) => {
  const d = new Date(val)
  if (isNaN(d.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return d >= today
}

const optionalTrimmedString = (max: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : undefined
    },
    z.string().max(max).optional(),
  )

// Booking schema for public submissions. All strings are trimmed and length-capped.
export const bookingSchema = z.object({
  customerName: z.string().trim().min(1, 'Name is required').max(100),
  customerPhone: z.string().trim().min(1, 'Phone is required').max(30),
  customerEmail: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : undefined
    },
    z.string().email('Invalid email').max(254).optional(),
  ),

  // Structured address fields (keep postcode separate)
  address: z.string().trim().min(1, 'Address is required').max(300),
  postcode: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value
      return normalizeUkPostcode(value.trim())
    },
    z
      .string()
      .min(1, 'Postcode is required')
      .max(10)
      .refine((value) => isValidUkPostcode(value), { message: 'Enter a valid UK postcode' }),
  ),

  // Structured vehicle fields
  vehicleMake: optionalTrimmedString(100),
  vehicleModel: optionalTrimmedString(100),
  registration: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value
      const trimmed = value.trim().toUpperCase()
      return trimmed.length > 0 ? trimmed : undefined
    },
    z.string().max(20).optional(),
  ),
  colour: optionalTrimmedString(50),
  vehicleSize: optionalTrimmedString(50),
  keyCollectionAddress: optionalTrimmedString(300),

  // Service & extras must match code config
  requestedService: z
    .string()
    .trim()
    .min(1, 'Service is required')
    .refine((v) => SERVICE_IDS.includes(v), { message: 'Invalid service selected' }),

  selectedExtras: z
    .array(z.string().trim().refine((v) => EXTRA_IDS.includes(v), { message: 'Invalid extra selected' }))
    .optional()
    .refine((arr) => (arr ? new Set(arr).size === arr.length : true), { message: 'Duplicate extras provided' })
    .refine((arr) => (arr ? arr.length <= EXTRA_IDS.length : true), { message: 'Too many extras' }),

  requestedDate: z.string().trim().refine(dateNotPast, { message: 'Requested date must be today or later' }),

  // Validate time window against known values to avoid arbitrary strings
  requestedTime: z
    .string()
    .trim()
    .min(1, 'Time is required')
    .refine((v) => TIME_WINDOWS.includes(v), { message: 'Invalid time window' }),

  notes: optionalTrimmedString(1000),
})

export type PublicBookingRequestInput = z.infer<typeof bookingSchema>
export { ZodError }
