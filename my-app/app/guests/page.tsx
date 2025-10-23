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
  IconAdjustmentsHorizontal,
  IconBed,
  IconBook,
  IconBriefcase,
  IconCalendar,
  IconCar,
  IconCash,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconCreditCard,
  IconCrown,
  IconDotsVertical,
  IconEdit,
  IconFileExport,
  IconFlag,
  IconFlower,
  IconId,
  IconNotes,
  IconPhone,
  IconPlus,
  IconSearch,
  IconShoppingCart,
  IconStar,
  IconStarFilled,
  IconTrash,
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type Order = {
  id: string
  category: "Minibar" | "Transportation" | "Flowers" | "Car Wash" | "Room Service" | "Spa" | "Laundry" | "Other"
  item: string
  quantity: number
  price: number
  dateOrdered: string
  status: "Pending" | "Completed" | "Cancelled"
  notes?: string
}

export type Feedback = {
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
  date: string
}

export type Guest = {
  id: number
  reservationNumber: string
  status: "Confirmed" | "Checked In" | "Checked Out" | "Cancelled"
  profile: {
    firstName: string
    lastName: string
    email: string
    phone: string
    avatarUrl: string
    nationality: string
    countryCode: string
    passportOrId: string
  }
  booking: {
    checkIn: string
    checkOut: string
    roomNumber: string
    roomType: string
    numberOfGuests: number
    source: string
  }
  revenue: {
    totalPaid: number
    roomCharges: number
    serviceCharges: number
    currency: string
  }
  orders: Order[]
  feedback: Feedback | null
  preferences: {
    specialRequests: string
    internalNotes: string
  }
}

const guestData: Guest[] = [
  {
    id: 1,
    reservationNumber: "JDXP4K",
    status: "Checked Out",
    profile: { firstName: "John", lastName: "Doe", email: "john.doe@example.com", phone: "+1 234 567 8900", avatarUrl: "", nationality: "American", countryCode: "US", passportOrId: "A12345678" },
    booking: { checkIn: "2024-07-15", checkOut: "2024-07-20", roomNumber: "101", roomType: "Deluxe King", numberOfGuests: 2, source: "Booking.com" },
    revenue: { totalPaid: 750, roomCharges: 500, serviceCharges: 250, currency: "USD" },
    orders: [
      { id: "ORD001", category: "Flowers", item: "Rose bouquet for anniversary", quantity: 1, price: 85, dateOrdered: "2024-07-15T14:30:00", status: "Completed", notes: "Delivered to room upon arrival" },
      { id: "ORD002", category: "Minibar", item: "2x Champagne, 1x Chocolates", quantity: 3, price: 120, dateOrdered: "2024-07-16T20:15:00", status: "Completed" },
      { id: "ORD003", category: "Room Service", item: "Breakfast in bed", quantity: 2, price: 45, dateOrdered: "2024-07-17T08:00:00", status: "Completed" }
    ],
    feedback: { rating: 5, comment: "Amazing stay! The flower arrangement was beautiful and the staff was incredibly attentive. Will definitely return for our next anniversary.", date: "2024-07-21" },
    preferences: { specialRequests: "Extra towels, late checkout.", internalNotes: "Anniversary trip. Left a positive review last time." }
  },
  {
    id: 2,
    reservationNumber: "SSMT7R",
    status: "Checked In",
    profile: { firstName: "Sarah", lastName: "Smith", email: "sarah.smith@example.com", phone: "+44 20 7946 0958", avatarUrl: "", nationality: "British", countryCode: "GB", passportOrId: "501234567" },
    booking: { checkIn: "2024-07-16", checkOut: "2024-07-18", roomNumber: "205", roomType: "Standard Queen", numberOfGuests: 1, source: "Direct" },
    revenue: { totalPaid: 380, roomCharges: 350, serviceCharges: 30, currency: "USD" },
    orders: [
      { id: "ORD004", category: "Minibar", item: "1x Water, 1x Nuts", quantity: 2, price: 12, dateOrdered: "2024-07-16T22:00:00", status: "Completed" },
      { id: "ORD005", category: "Laundry", item: "Express laundry service", quantity: 1, price: 18, dateOrdered: "2024-07-17T09:00:00", status: "Pending" }
    ],
    feedback: null,
    preferences: { specialRequests: "", internalNotes: "" }
  },
  {
    id: 3,
    reservationNumber: "MJHN9Q",
    status: "Confirmed",
    profile: { firstName: "Michael", lastName: "Johnson", email: "michael.j@example.com", phone: "+1 310 555 1212", avatarUrl: "", nationality: "Canadian", countryCode: "CA", passportOrId: "CA1234567" },
    booking: { checkIn: "2024-07-20", checkOut: "2024-07-28", roomNumber: "310", roomType: "Ocean View Suite", numberOfGuests: 3, source: "Expedia" },
    revenue: { totalPaid: 0, roomCharges: 800, serviceCharges: 0, currency: "USD" },
    orders: [],
    feedback: null,
    preferences: { specialRequests: "High floor, away from elevator.", internalNotes: "Frequent business traveler." }
  },
  {
    id: 4,
    reservationNumber: "EBRW3N",
    status: "Cancelled",
    profile: { firstName: "Emily", lastName: "Brown", email: "emily.brown@example.com", phone: "+61 2 1234 5678", avatarUrl: "", nationality: "Australian", countryCode: "AU", passportOrId: "E12345678" },
    booking: { checkIn: "2024-06-17", checkOut: "2024-06-19", roomNumber: "412", roomType: "Standard Twin", numberOfGuests: 2, source: "Direct" },
    revenue: { totalPaid: 0, roomCharges: 280, serviceCharges: 0, currency: "USD" },
    orders: [],
    feedback: null,
    preferences: { specialRequests: "Hypoallergenic pillows.", internalNotes: "" }
  },
  {
    id: 5,
    reservationNumber: "DWLS8M",
    status: "Confirmed",
    profile: { firstName: "David", lastName: "Wilson", email: "david.wilson@example.com", phone: "+49 30 1234567", avatarUrl: "", nationality: "German", countryCode: "DE", passportOrId: "D12345678" },
    booking: { checkIn: "2024-08-01", checkOut: "2024-08-10", roomNumber: "508", roomType: "Family Suite", numberOfGuests: 4, source: "Booking.com" },
    revenue: { totalPaid: 1350, roomCharges: 1200, serviceCharges: 150, currency: "USD" },
    orders: [
      { id: "ORD006", category: "Transportation", item: "Airport transfer - Round trip", quantity: 1, price: 80, dateOrdered: "2024-07-25T10:00:00", status: "Completed" },
      { id: "ORD007", category: "Car Wash", item: "Full service car wash", quantity: 1, price: 35, dateOrdered: "2024-08-02T15:00:00", status: "Completed" },
      { id: "ORD008", category: "Spa", item: "Family spa package", quantity: 1, price: 35, dateOrdered: "2024-08-03T11:00:00", status: "Completed", notes: "All family members" }
    ],
    feedback: { rating: 4, comment: "Great family experience. Kids loved the pool. Only issue was some noise from neighboring room.", date: "2024-08-11" },
    preferences: { specialRequests: "Baby crib, connecting rooms.", internalNotes: "Returning family." }
  },
]

const StatusBadge = ({ status }: { status: Guest["status"] }) => {
  const variant = {
    "Checked In": "default",
    "Checked Out": "secondary",
    "Confirmed": "outline",
    "Cancelled": "destructive",
  }[status] as "default" | "secondary" | "outline" | "destructive"

  return <Badge variant={variant}>{status}</Badge>
}

const DetailItem = ({ icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 text-muted-foreground">{React.createElement(icon, { className: "size-5" })}</div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
)

export default function GuestsPage() {
  const [data] = React.useState(() => [...guestData])
  const [selectedGuest, setSelectedGuest] = React.useState<Guest | null>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const handleViewDetails = (guest: Guest) => {
    setSelectedGuest(guest)
    setIsSheetOpen(true)
  }

  const columns: ColumnDef<Guest>[] = [
    { id: "select", header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />, cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />, enableSorting: false, enableHiding: false },
    {
      accessorKey: "profile",
      header: "Guest Name",
      cell: ({ row }) => {
        const { firstName, lastName, email, avatarUrl } = row.original.profile
        const fallback = `${firstName[0] ?? ""}${lastName[0] ?? ""}`
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-8 border">
              <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{firstName} {lastName}</div>
              <div className="text-sm text-muted-foreground truncate">{email}</div>
            </div>
          </div>
        )
      },
    },
    { accessorKey: "reservationNumber", header: "Reservation" },
    { accessorKey: "booking.roomNumber", header: "Room Number" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.getValue("status")} /> },
    {
      accessorKey: "booking.checkIn",
      header: "Check-in / Check-out",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{format(new Date(row.original.booking.checkIn), "LLL dd, yyyy")}</div>
          <div className="text-sm text-muted-foreground">{format(new Date(row.original.booking.checkOut), "LLL dd, yyyy")}</div>
        </div>
      ),
    },
    {
      accessorKey: "revenue.totalPaid",
      header: () => <div className="text-right">Revenue</div>,
      cell: ({ row }) => <div className="text-right font-medium">${row.original.revenue.totalPaid}</div>
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleViewDetails(row.original)}>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Reservation</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data,
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
    <TooltipProvider>
      <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold">Guest Reservations</h1>
                <p className="text-muted-foreground text-sm md:text-base">View and manage all guest reservations.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <IconFileExport className="size-4" /> Export
                </Button>
                <Button size="sm" className="gap-1.5">
                  <IconPlus className="size-4" /> Add Reservation
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between gap-4 p-4">
                  <div className="relative">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                    <Input placeholder="Search by name, email..." value={(table.getColumn("profile")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("profile")?.setFilterValue(event.target.value)} className="w-full pl-10 md:w-[250px] lg:w-[300px]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-1.5">
                          <IconAdjustmentsHorizontal className="size-4" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                          <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                            {column.id.includes('.') ? column.id.split('.')[1] : column.id}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="rounded-lg border-t overflow-x-auto">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="cursor-pointer" onClick={() => handleViewDetails(row.original)}>
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between gap-4 p-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><IconChevronLeft className="size-4" /></Button>
                      <span className="text-sm">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
                      <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><IconChevronRight className="size-4" /></Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="sm:max-w-3xl flex flex-col p-0">
            {selectedGuest && (
              <>
                <SheetHeader className="p-6">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-2xl font-semibold">Reservation #{selectedGuest.reservationNumber}</SheetTitle>
                    <StatusBadge status={selectedGuest.status} />
                  </div>
                  <SheetDescription>
                    Details for {selectedGuest.profile.firstName} {selectedGuest.profile.lastName}'s booking.
                  </SheetDescription>
                </SheetHeader>
                <Separator />
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="size-12 border">
                          <AvatarImage src={selectedGuest.profile.avatarUrl} />
                          <AvatarFallback>{selectedGuest.profile.firstName[0]}{selectedGuest.profile.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">
                            {selectedGuest.profile.firstName} {selectedGuest.profile.lastName}
                          </CardTitle>
                          <p className="text-muted-foreground">{selectedGuest.profile.email}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="icon"><IconEdit className="size-4" /></Button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
                      <DetailItem icon={IconPhone} label="Phone" value={selectedGuest.profile.phone} />
                      <DetailItem icon={IconFlag} label="Nationality" value={selectedGuest.profile.nationality} />
                      <DetailItem icon={IconId} label="Passport/ID" value={selectedGuest.profile.passportOrId} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><IconBook className="size-5 text-muted-foreground" /> Booking Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      <DetailItem icon={IconCalendar} label="Check-in" value={format(new Date(selectedGuest.booking.checkIn), "E, LLL dd, yyyy")} />
                      <DetailItem icon={IconCalendar} label="Check-out" value={format(new Date(selectedGuest.booking.checkOut), "E, LLL dd, yyyy")} />
                      <DetailItem icon={IconBed} label="Room" value={`${selectedGuest.booking.roomNumber} (${selectedGuest.booking.roomType})`} />
                      <DetailItem icon={IconUsers} label="Guests" value={selectedGuest.booking.numberOfGuests} />
                      <DetailItem icon={IconBriefcase} label="Source" value={selectedGuest.booking.source} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><IconCash className="size-5 text-muted-foreground" /> Revenue</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-muted-foreground"><IconCreditCard className="size-5" /></div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Paid</p>
                          <p className="font-bold text-lg">{new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedGuest.revenue.currency }).format(selectedGuest.revenue.totalPaid)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-muted-foreground"><IconBed className="size-5" /></div>
                        <div>
                          <p className="text-sm text-muted-foreground">Room Charges</p>
                          <p className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedGuest.revenue.currency }).format(selectedGuest.revenue.roomCharges)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-muted-foreground"><IconCash className="size-5" /></div>
                        <div>
                          <p className="text-sm text-muted-foreground">Service Charges</p>
                          <p className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedGuest.revenue.currency }).format(selectedGuest.revenue.serviceCharges)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedGuest.orders.length > 0 && (
                    <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2"><IconShoppingCart className="size-5 text-muted-foreground" /> Orders & Services</CardTitle></CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedGuest.orders.map((order) => (
                            <div key={order.id} className="flex items-start justify-between pb-4 border-b last:border-0 last:pb-0">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="flex-shrink-0 text-muted-foreground">
                                  {order.category === "Minibar" && <IconShoppingCart className="size-5" />}
                                  {order.category === "Transportation" && <IconCar className="size-5" />}
                                  {order.category === "Flowers" && <IconFlower className="size-5" />}
                                  {order.category === "Car Wash" && <IconCar className="size-5" />}
                                  {(order.category === "Room Service" || order.category === "Spa" || order.category === "Laundry" || order.category === "Other") && <IconNotes className="size-5" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium">{order.item}</p>
                                    <Badge variant={order.status === "Completed" ? "secondary" : order.status === "Pending" ? "outline" : "destructive"} className="text-xs">{order.status}</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{order.category} • Qty: {order.quantity}</p>
                                  {order.notes && <p className="text-sm text-muted-foreground mt-1">{order.notes}</p>}
                                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><IconClock className="size-3" /> {format(new Date(order.dateOrdered), "LLL dd, yyyy 'at' h:mm a")}</p>
                                </div>
                              </div>
                              <div className="font-semibold text-right ml-4">${order.price}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedGuest.feedback && (
                    <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2"><IconStar className="size-5 text-muted-foreground" /> Guest Feedback</CardTitle></CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                star <= selectedGuest.feedback!.rating ?
                                  <IconStarFilled key={star} className="size-5 text-yellow-500" /> :
                                  <IconStar key={star} className="size-5 text-gray-300" />
                              ))}
                            </div>
                            <span className="font-semibold text-lg">{selectedGuest.feedback.rating}/5</span>
                          </div>
                          <p className="text-muted-foreground">{selectedGuest.feedback.comment}</p>
                          <p className="text-xs text-muted-foreground">Submitted on {format(new Date(selectedGuest.feedback.date), "LLLL dd, yyyy")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {(selectedGuest.preferences.specialRequests && selectedGuest.preferences.specialRequests !== "None.") && (
                    <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2"><IconStar className="size-5 text-muted-foreground" /> Special Requests</CardTitle></CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{selectedGuest.preferences.specialRequests}</p>
                      </CardContent>
                    </Card>
                  )}

                  {selectedGuest.preferences.internalNotes && (
                     <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2"><IconNotes className="size-5 text-muted-foreground" /> Internal Notes</CardTitle></CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{selectedGuest.preferences.internalNotes}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <Separator />
                <SheetFooter className="p-6 flex-col sm:flex-row sm:justify-between gap-2">
                  <Button variant="destructive" className="sm:mr-auto gap-1.5"><IconTrash className="size-4" /> Cancel Reservation</Button>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => setIsSheetOpen(false)}>Close</Button>
                    {selectedGuest.status === "Confirmed" && <Button>Check In</Button>}
                    {selectedGuest.status === "Checked In" && <Button>Check Out</Button>}
                  </div>
                </SheetFooter>
              </>
            )}
          </SheetContent>
        </Sheet>
      </SidebarProvider>
    </TooltipProvider>
  )
}
