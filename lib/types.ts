/**
 * Shared types for the data returned by the SalonBook REST API.
 */

export type ServiceStatus = "active" | "inactive"

export type Service = {
  id: string
  serviceName: string
  category: string
  description: string
  price: number
  duration: number
  image: string
  status: ServiceStatus
  createdAt?: string
}

export type AppointmentStatus = "pending" | "confirmed" | "cancelled"
export type PaymentStatus = "unpaid" | "paid"

export type AppointmentService = {
  id: string
  serviceName: string
  category: string
  image: string
  price: number
  duration: number
  status: ServiceStatus
}

export type AppointmentCustomer = {
  id: string
  name: string
  email: string
  phone?: string | null
  image?: string | null
  blocked?: boolean
}

export type Appointment = {
  id: string
  serviceId: string
  customerId: string
  appointmentDate: string
  timeSlot: string
  message: string
  servicePrice: number
  status: AppointmentStatus
  paymentStatus: PaymentStatus
  createdAt: string
  service?: AppointmentService | null
  customer?: AppointmentCustomer | null
}

export type Transaction = {
  id: string
  appointmentId: string
  customerId: string
  amount: number
  currency: string
  stripeSessionId: string
  status: "paid" | "failed"
  createdAt: string
  appointment?: Appointment | null
  customer?: AppointmentCustomer | null
}

export type AdminUser = {
  id: string
  name: string
  email: string
  image: string | null
  phone: string | null
  role: "admin" | "user"
  blocked: boolean
  emailVerified: boolean
  createdAt: string | null
}

export type ServiceCategory = {
  label: string
  value: string
  count: number
}

export type AdminStats = {
  totalCustomers: number
  totalUsers: number
  totalActiveServices: number
  totalServices: number
  totalAppointments: number
  pendingAppointments: number
  confirmedAppointments: number
  cancelledAppointments: number
  successfulPayments: number
  totalRevenue: number
}

export type CustomerStats = {
  totalAppointments: number
  pendingAppointments: number
  confirmedAppointments: number
  cancelledAppointments: number
  successfulPayments: number
  totalSpent: number
}
