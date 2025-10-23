export type FeedbackStatus = "New" | "In Progress" | "Contacted" | "Resolved" | "Closed"
export type FeedbackPriority = "Low" | "Medium" | "High" | "Urgent"
export type SentimentType = "Positive" | "Neutral" | "Negative"
export type FeedbackCategory = "Room" | "Service" | "Food" | "Cleanliness" | "Staff" | "Amenities" | "Other"

export interface FeedbackNote {
  id: string
  text: string
  createdBy: string
  createdAt: string
}

export interface ContactAttempt {
  id: string
  method: "Phone" | "Email" | "SMS" | "WhatsApp"
  status: "Success" | "No Answer" | "Failed"
  notes: string
  attemptedBy: string
  attemptedAt: string
}

export interface Feedback {
  id: string
  guestName: string
  guestEmail: string
  guestPhone: string
  roomNumber: string
  reservationNumber: string
  checkOutDate: string
  rating: 1 | 2 | 3 | 4 | 5
  category: FeedbackCategory
  title: string
  comment: string
  wordCount: number
  sentiment: SentimentType
  aiSuggestions: string[]
  status: FeedbackStatus
  priority: FeedbackPriority
  isContacted: boolean
  contactAttempts: ContactAttempt[]
  internalNotes: FeedbackNote[]
  assignedTo?: string
  resolvedAt?: string
  createdAt: string
  updatedAt: string
}
