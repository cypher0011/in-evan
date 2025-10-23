"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  IconAlertTriangle,
  IconBrandWhatsapp,
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFilter,
  IconMail,
  IconMessage2,
  IconPhone,
  IconPlus,
  IconSearch,
  IconStar,
  IconStarFilled,
  IconTrendingDown,
  IconTrendingUp,
  IconUser,
  IconUsers,
} from "@tabler/icons-react"
import { format } from "date-fns"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import type { Feedback, FeedbackStatus, ContactAttempt } from "@/lib/feedback-types"

const SAMPLE_FEEDBACKS: Feedback[] = [
  {
    id: "1",
    guestName: "Sarah Johnson",
    guestEmail: "sarah.j@example.com",
    guestPhone: "+1 555 0123",
    roomNumber: "305",
    reservationNumber: "RSV-2024-001",
    checkOutDate: "2024-10-20",
    rating: 2,
    category: "Cleanliness",
    title: "Room was not properly cleaned",
    comment: "I was disappointed to find the bathroom not properly cleaned upon check-in. There were hair strands in the shower and the floor wasn't vacuumed. The minibar was also not restocked. For the price we paid, I expected much better.",
    wordCount: 42,
    sentiment: "Negative",
    aiSuggestions: [
      "Apologize immediately and offer room cleaning service",
      "Provide complimentary minibar items",
      "Offer discount on next stay (10-15%)",
      "Follow up with housekeeping team about quality control"
    ],
    status: "New",
    priority: "High",
    isContacted: false,
    contactAttempts: [],
    internalNotes: [],
    createdAt: "2024-10-20T14:30:00Z",
    updatedAt: "2024-10-20T14:30:00Z",
  },
  {
    id: "2",
    guestName: "Michael Chen",
    guestEmail: "m.chen@company.com",
    guestPhone: "+1 555 0456",
    roomNumber: "1208",
    reservationNumber: "RSV-2024-002",
    checkOutDate: "2024-10-21",
    rating: 5,
    category: "Service",
    title: "Outstanding service from the concierge",
    comment: "David at the concierge desk went above and beyond to help me arrange last-minute dinner reservations at a fully booked restaurant. His professionalism and dedication to guest satisfaction are exceptional. Thank you!",
    wordCount: 35,
    sentiment: "Positive",
    aiSuggestions: [
      "Thank the guest and share feedback with team",
      "Recognize David's excellent service internally",
      "Consider featuring this as a success story",
      "Offer loyalty program benefits"
    ],
    status: "Contacted",
    priority: "Medium",
    isContacted: true,
    contactAttempts: [
      {
        id: "ca1",
        method: "Email",
        status: "Success",
        notes: "Thanked guest for positive feedback. Offered 500 loyalty points.",
        attemptedBy: "Emma Rodriguez",
        attemptedAt: "2024-10-21T10:15:00Z",
      }
    ],
    internalNotes: [
      {
        id: "n1",
        text: "Shared feedback with David and management. Guest enrolled in VIP program.",
        createdBy: "Emma Rodriguez",
        createdAt: "2024-10-21T10:20:00Z",
      }
    ],
    assignedTo: "Emma Rodriguez",
    resolvedAt: "2024-10-21T11:00:00Z",
    createdAt: "2024-10-21T08:45:00Z",
    updatedAt: "2024-10-21T11:00:00Z",
  },
  {
    id: "3",
    guestName: "Emily Brown",
    guestEmail: "emily.brown@email.com",
    guestPhone: "+1 555 0789",
    roomNumber: "502",
    reservationNumber: "RSV-2024-003",
    checkOutDate: "2024-10-22",
    rating: 3,
    category: "Room",
    title: "Noisy air conditioning unit",
    comment: "The room was beautiful but the AC unit made a loud rattling noise throughout the night. It made it difficult to sleep. Otherwise, everything was fine.",
    wordCount: 28,
    sentiment: "Neutral",
    aiSuggestions: [
      "Schedule immediate AC maintenance check",
      "Offer room change if guest returns",
      "Apologize and offer room service credit",
      "Add to maintenance log for room 502"
    ],
    status: "In Progress",
    priority: "Medium",
    isContacted: true,
    contactAttempts: [
      {
        id: "ca2",
        method: "Phone",
        status: "No Answer",
        notes: "Left voicemail apologizing and offering credit.",
        attemptedBy: "John Smith",
        attemptedAt: "2024-10-22T09:30:00Z",
      }
    ],
    internalNotes: [
      {
        id: "n2",
        text: "Maintenance scheduled for room 502 AC unit. Guest to be called again tomorrow.",
        createdBy: "John Smith",
        createdAt: "2024-10-22T09:35:00Z",
      }
    ],
    assignedTo: "John Smith",
    createdAt: "2024-10-22T07:20:00Z",
    updatedAt: "2024-10-22T09:35:00Z",
  },
  {
    id: "4",
    guestName: "Robert Martinez",
    guestEmail: "r.martinez@outlook.com",
    guestPhone: "+1 555 0321",
    roomNumber: "810",
    reservationNumber: "RSV-2024-004",
    checkOutDate: "2024-10-23",
    rating: 1,
    category: "Staff",
    title: "Rude behavior at front desk",
    comment: "The staff member at check-in was extremely rude and unhelpful. When I asked about the breakfast timing, she rolled her eyes and spoke to me in a condescending tone. This is completely unacceptable for a hotel of this caliber. I expect better training for your staff. Will not recommend.",
    wordCount: 52,
    sentiment: "Negative",
    aiSuggestions: [
      "URGENT: Contact guest immediately with personal apology",
      "Investigate incident with front desk team",
      "Offer full refund or significant discount on next stay",
      "Provide staff retraining on customer service",
      "Consider compensation (free night stay)"
    ],
    status: "New",
    priority: "Urgent",
    isContacted: false,
    contactAttempts: [],
    internalNotes: [],
    createdAt: "2024-10-23T11:45:00Z",
    updatedAt: "2024-10-23T11:45:00Z",
  },
  {
    id: "5",
    guestName: "Lisa Anderson",
    guestEmail: "lisa.a@gmail.com",
    guestPhone: "+1 555 0654",
    roomNumber: "1105",
    reservationNumber: "RSV-2024-005",
    checkOutDate: "2024-10-23",
    rating: 4,
    category: "Food",
    title: "Great breakfast but limited options",
    comment: "Loved the quality of food at breakfast, especially the fresh pastries. However, would appreciate more vegetarian options. Overall great experience!",
    wordCount: 24,
    sentiment: "Positive",
    aiSuggestions: [
      "Thank guest for feedback",
      "Share with F&B team to expand vegetarian menu",
      "Follow up with proposed menu additions",
      "Invite guest to return for improved breakfast experience"
    ],
    status: "New",
    priority: "Low",
    isContacted: false,
    contactAttempts: [],
    internalNotes: [],
    createdAt: "2024-10-23T13:20:00Z",
    updatedAt: "2024-10-23T13:20:00Z",
  },
]

const getLocalFeedback = (): Feedback[] => {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("hotel-feedbacks")
    return stored ? JSON.parse(stored) : SAMPLE_FEEDBACKS
  } catch {
    return SAMPLE_FEEDBACKS
  }
}

const saveFeedback = (feedbacks: Feedback[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("hotel-feedbacks", JSON.stringify(feedbacks))
  }
}

const StatusBadge = ({ status }: { status: FeedbackStatus }) => {
  const variants = {
    "New": "destructive" as const,
    "In Progress": "outline" as const,
    "Contacted": "secondary" as const,
    "Resolved": "default" as const,
    "Closed": "secondary" as const,
  }
  return <Badge variant={variants[status]}>{status}</Badge>
}

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colors = {
    "Low": "bg-gray-100 text-gray-800",
    "Medium": "bg-blue-100 text-blue-800",
    "High": "bg-orange-100 text-orange-800",
    "Urgent": "bg-red-100 text-red-800",
  }
  return (
    <Badge variant="outline" className={colors[priority as keyof typeof colors]}>
      {priority}
    </Badge>
  )
}

const SentimentBadge = ({ sentiment }: { sentiment: string }) => {
  const icons = {
    "Positive": <IconTrendingUp className="size-3" />,
    "Neutral": <IconMessage2 className="size-3" />,
    "Negative": <IconTrendingDown className="size-3" />,
  }
  return (
    <Badge variant="outline" className="gap-1">
      {icons[sentiment as keyof typeof icons]}
      {sentiment}
    </Badge>
  )
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = React.useState<Feedback[]>(() => getLocalFeedback())
  const [selectedFeedback, setSelectedFeedback] = React.useState<Feedback | null>(null)
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [contactDialogOpen, setContactDialogOpen] = React.useState(false)
  const [noteDialogOpen, setNoteDialogOpen] = React.useState(false)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [contactMethod, setContactMethod] = React.useState<"Phone" | "Email" | "SMS" | "WhatsApp">("Phone")
  const [contactStatus, setContactStatus] = React.useState<"Success" | "No Answer" | "Failed">("Success")
  const [contactNotes, setContactNotes] = React.useState("")
  const [newNote, setNewNote] = React.useState("")

  React.useEffect(() => {
    saveFeedback(feedbacks)
  }, [feedbacks])

  const stats = React.useMemo(() => {
    const total = feedbacks.length
    const newFeedbacks = feedbacks.filter(f => f.status === "New").length
    const avgRating = feedbacks.reduce((acc, f) => acc + f.rating, 0) / total || 0
    const totalWords = feedbacks.reduce((acc, f) => acc + f.wordCount, 0)
    const contacted = feedbacks.filter(f => f.isContacted).length
    const urgent = feedbacks.filter(f => f.priority === "Urgent").length

    return { total, newFeedbacks, avgRating, totalWords, contacted, urgent }
  }, [feedbacks])

  const handleViewDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setDetailsOpen(true)
  }

  const handleAddContact = () => {
    if (!selectedFeedback) return

    const newAttempt: ContactAttempt = {
      id: crypto.randomUUID(),
      method: contactMethod,
      status: contactStatus,
      notes: contactNotes,
      attemptedBy: "Current User",
      attemptedAt: new Date().toISOString(),
    }

    const updated: Feedback = {
      ...selectedFeedback,
      isContacted: true,
      contactAttempts: [...selectedFeedback.contactAttempts, newAttempt],
      status: contactStatus === "Success" ? "Contacted" : "In Progress",
      updatedAt: new Date().toISOString(),
    }

    setFeedbacks(old => old.map(f => f.id === selectedFeedback.id ? updated : f))
    setSelectedFeedback(updated)
    setContactDialogOpen(false)
    setContactNotes("")
  }

  const handleAddNote = () => {
    if (!selectedFeedback || !newNote.trim()) return

    const note = {
      id: crypto.randomUUID(),
      text: newNote.trim(),
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
    }

    const updated: Feedback = {
      ...selectedFeedback,
      internalNotes: [...selectedFeedback.internalNotes, note],
      updatedAt: new Date().toISOString(),
    }

    setFeedbacks(old => old.map(f => f.id === selectedFeedback.id ? updated : f))
    setSelectedFeedback(updated)
    setNoteDialogOpen(false)
    setNewNote("")
  }

  const updateStatus = (id: string, status: FeedbackStatus) => {
    setFeedbacks(old => old.map(f =>
      f.id === id
        ? { ...f, status, updatedAt: new Date().toISOString() }
        : f
    ))
  }

  const columns: ColumnDef<Feedback>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "guestName",
      header: "Guest",
      cell: ({ row }) => {
        const feedback = row.original
        return (
          <div>
            <div className="font-medium">{feedback.guestName}</div>
            <div className="text-sm text-muted-foreground">Room {feedback.roomNumber}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.original.rating
        return (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              star <= rating
                ? <IconStarFilled key={star} className="size-4 text-yellow-500" />
                : <IconStar key={star} className="size-4 text-gray-300" />
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge>,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-md truncate">{row.original.title}</div>
      ),
    },
    {
      accessorKey: "sentiment",
      header: "Sentiment",
      cell: ({ row }) => <SentimentBadge sentiment={row.original.sentiment} />,
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "isContacted",
      header: "Contacted",
      cell: ({ row }) => (
        row.original.isContacted
          ? <Badge variant="secondary" className="gap-1"><IconPhone className="size-3" /> Yes</Badge>
          : <Badge variant="outline">No</Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Received",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const feedback = row.original
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(feedback)}
          >
            <IconEye className="size-4" />
          </Button>
        )
      },
    },
  ]

  const table = useReactTable({
    data: feedbacks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  return (
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Guest Feedback</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Manage and respond to guest reviews and comments
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                <IconUsers className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.newFeedbacks} new
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <IconStar className="size-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  Out of 5.0 stars
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Words</CardTitle>
                <IconMessage2 className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalWords}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.contacted} contacted
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Urgent Items</CardTitle>
                <IconAlertTriangle className="size-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
                <p className="text-xs text-muted-foreground">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Feedback ({table.getFilteredRowModel().rows.length})</CardTitle>
                <div className="relative w-64">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search feedback..."
                    value={(table.getColumn("guestName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("guestName")?.setFilterValue(event.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-lg border-t overflow-x-auto">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No feedback found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between gap-4 p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <IconChevronLeft className="size-4" />
                  </Button>
                  <span className="text-sm">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <IconChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedFeedback && (
            <>
              <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      Feedback Details
                      <StatusBadge status={selectedFeedback.status} />
                      <PriorityBadge priority={selectedFeedback.priority} />
                    </DialogTitle>
                    <DialogDescription>
                      From {selectedFeedback.guestName} • Room {selectedFeedback.roomNumber} • {format(new Date(selectedFeedback.createdAt), "MMM dd, yyyy")}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Guest Information</CardTitle>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => setContactDialogOpen(true)}>
                              <IconPhone className="size-4 mr-2" />
                              Add Contact
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setNoteDialogOpen(true)}>
                              <IconPlus className="size-4 mr-2" />
                              Add Note
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{selectedFeedback.guestEmail}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{selectedFeedback.guestPhone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Reservation</p>
                          <p className="font-medium">{selectedFeedback.reservationNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Check-out Date</p>
                          <p className="font-medium">{format(new Date(selectedFeedback.checkOutDate), "MMM dd, yyyy")}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Feedback Content
                          <div className="flex items-center gap-1 ml-auto">
                            {[1, 2, 3, 4, 5].map((star) => (
                              star <= selectedFeedback.rating
                                ? <IconStarFilled key={star} className="size-5 text-yellow-500" />
                                : <IconStar key={star} className="size-5 text-gray-300" />
                            ))}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Title</p>
                          <p className="font-semibold text-lg">{selectedFeedback.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Comment ({selectedFeedback.wordCount} words)</p>
                          <p className="text-muted-foreground leading-relaxed">{selectedFeedback.comment}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge>{selectedFeedback.category}</Badge>
                          <SentimentBadge sentiment={selectedFeedback.sentiment} />
                        </div>
                      </CardContent>
                    </Card>

                    {selectedFeedback.aiSuggestions.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">AI Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {selectedFeedback.aiSuggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary font-semibold">{idx + 1}.</span>
                                <span className="text-sm">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {selectedFeedback.contactAttempts.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Contact History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedFeedback.contactAttempts.map((attempt) => (
                              <div key={attempt.id} className="border-l-2 border-primary pl-4 py-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline">{attempt.method}</Badge>
                                  <Badge variant={attempt.status === "Success" ? "default" : "secondary"}>
                                    {attempt.status}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(attempt.attemptedAt), "MMM dd, yyyy hh:mm a")}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{attempt.notes}</p>
                                <p className="text-xs text-muted-foreground mt-1">By {attempt.attemptedBy}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {selectedFeedback.internalNotes.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Internal Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedFeedback.internalNotes.map((note) => (
                              <div key={note.id} className="border-l-2 pl-4 py-2">
                                <p className="text-sm">{note.text}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  By {note.createdBy} • {format(new Date(note.createdAt), "MMM dd, yyyy hh:mm a")}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div>
                      <Label>Update Status</Label>
                      <Select
                        value={selectedFeedback.status}
                        onValueChange={(v) => updateStatus(selectedFeedback.id, v as FeedbackStatus)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Contact Attempt</DialogTitle>
                    <DialogDescription>Record your contact with {selectedFeedback.guestName}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Contact Method</Label>
                      <Select value={contactMethod} onValueChange={(v: any) => setContactMethod(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Phone">Phone</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="SMS">SMS</SelectItem>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={contactStatus} onValueChange={(v: any) => setContactStatus(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Success">Success</SelectItem>
                          <SelectItem value="No Answer">No Answer</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={contactNotes}
                        onChange={(e) => setContactNotes(e.target.value)}
                        placeholder="What was discussed..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setContactDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddContact}>Save Contact</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Internal Note</DialogTitle>
                    <DialogDescription>Add a note about this feedback for your team</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label>Note</Label>
                    <Textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Enter your note..."
                      rows={6}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddNote}>Add Note</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
