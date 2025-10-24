export interface GuestAppItem {
  id: string
  title: string
  description: string
  imageUrl?: string
  link?: string
  phone?: string
  price?: number
  isVisible: boolean
  order: number
}

export interface GuestAppSection {
  id: string
  name: string
  icon: string
  description?: string
  items: GuestAppItem[]
  isVisible: boolean
  order: number
  type: "grid" | "list" | "contact" | "info"
}

export interface HotelInfo {
  name: string
  logo?: string
  description: string
  address: string
  phone: string
  email: string
  checkInTime: string
  checkOutTime: string
}

export interface WiFiCredentials {
  networkName: string
  password: string
  instructions?: string
}

export interface WelcomeMessage {
  title: string
  message: string
  imageUrl?: string
  isActive: boolean
}

export interface ContactInfo {
  frontDesk: string
  concierge: string
  emergency: string
  housekeeping: string
  roomService: string
  maintenance: string
}

export interface OperatingHours {
  name: string
  hours: string
  days?: string
  isOpen: boolean
}

export interface ExternalResource {
  id: string
  title: string
  description: string
  url: string
  imageUrl?: string
  category: "Tourism" | "Transportation" | "Emergency" | "Entertainment" | "Other"
  order: number
}

export interface GuestAppConfig {
  hotelInfo: HotelInfo
  wifiCredentials: WiFiCredentials
  welcomeMessage: WelcomeMessage
  contactInfo: ContactInfo
  operatingHours: OperatingHours[]
  sections: GuestAppSection[]
  externalResources: ExternalResource[]
  updatedAt: string
}
