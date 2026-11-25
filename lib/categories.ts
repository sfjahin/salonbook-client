/** Service categories offered by SalonBook. */
export const SERVICE_CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
] as const

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]
