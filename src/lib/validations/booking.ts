import { z, ZodError } from 'zod'

const dateNotPast = (val: string) => {
  const d = new Date(val)
  if (isNaN(d.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return d >= today
}

export const bookingSchema = z.object({
  customerName: z.string().min(1, 'Name is required').max(100),
  customerPhone: z.string().min(1, 'Phone is required').max(30),
  customerEmail: z.string().email('Invalid email').optional(),
  vehicle: z.string().min(1, 'Vehicle is required').max(200),
  postcode: z.string().min(1, 'Postcode is required').max(20),
  requestedService: z.string().min(1, 'Service is required'),
  requestedDate: z.string().refine(dateNotPast, { message: 'Requested date must be today or later' }),
  requestedTime: z.string().min(1, 'Time is required'),
  notes: z.string().max(1000).optional(),
  selectedExtras: z.array(z.string()).optional(),
})

export type PublicBookingRequestInput = z.infer<typeof bookingSchema>
export { ZodError }
