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
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCircleX,
  IconCurrencyDollar,
  IconDotsVertical,
  IconEdit,
  IconFileExport,
  IconMail,
  IconNotes,
  IconPhone,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUser,
  IconUsers,
} from "@tabler/icons-react"

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

// --- TYPES AND MOCK DATA ---

export type Guest = {
  id: number
  uniqueId: string
  roomNum: string
  firstName: string
  lastName: string
  email: string
  avatarUrl: string
  checkIn: string
  checkOut: string
  status: "Confirmed" | "Checked In" | "Checked Out" | "Cancelled"
  paid: boolean
  amount: number
  phone: string
  guests: number
  specialRequests: string
}

const guestData: Guest[] = [
  { id: 1, uniqueId: "JDXP4K", roomNum: "101", firstName: "John", lastName: "Doe", email: "john.doe@example.com", avatarUrl: "/avatars/movenpick.png", checkIn: "2024-07-15", checkOut: "2024-07-20", status: "Checked Out", paid: true, amount: 500, phone: "+1 234 567 8900", guests: 2, specialRequests: "Extra towels, late checkout." },
  { id: 2, uniqueId: "SSMT7R", roomNum: "205", firstName: "Sarah", lastName: "Smith", email: "sarah.smith@example.com", avatarUrl: "", checkIn: "2024-07-16", checkOut: "2024-07-18", status: "Checked In", paid: true, amount: 350, phone: "+1 234 567 8901", guests: 1, specialRequests: "None." },
  { id: 3, uniqueId: "MJHN9Q", roomNum: "310", firstName: "Michael", lastName: "Johnson", email: "michael.j@example.com", avatarUrl: "/avatars/movenpick.png", checkIn: "2024-07-20", checkOut: "2024-07-28", status: "Confirmed", paid: false, amount: 800, phone: "+1 234 567 8902", guests: 3, specialRequests: "High floor, away from elevator." },
  { id: 4, uniqueId: "EBRW3N", roomNum: "412", firstName: "Emily", lastName: "Brown", email: "emily.brown@example.com", avatarUrl: "", checkIn: "2024-06-17", checkOut: "2024-06-19", status: "Cancelled", paid: false, amount: 280, phone: "+1 234 567 8903", guests: 2, specialRequests: "Hypoallergenic pillows." },
  { id: 5, uniqueId: "DWLS8M", roomNum: "508", firstName: "David", lastName: "Wilson", email: "david.wilson@example.com", avatarUrl: "/avatars/movenpick.png", checkIn: "2024-08-01", checkOut: "2024-08-10", status: "Confirmed", paid: true, amount: 1200, phone: "+1 234 567 8904", guests: 4, specialRequests: "Baby crib, connecting rooms." },
  { id: 6, uniqueId: "LMRG2P", roomNum: "102", firstName: "Linda", lastName: "Miller", email: "linda.miller@example.com", avatarUrl: "", checkIn: "2024-07-18", checkOut: "2024-07-22", status: "Checked In", paid: false, amount: 420, phone: "+1 234 567 8905", guests: 2, specialRequests: "Room with a view." },
  { id: 7, uniqueId: "KDPQ1Z", roomNum: "303", firstName: "Kevin", lastName: "Davis", email: "kevin.davis@example.com", avatarUrl: "/avatars/movenpick.png", checkIn: "2024-07-25", checkOut: "2024-07-30", status: "Confirmed", paid: false, amount: 650, phone: "+1 234 567 8906", guests: 1, specialRequests: "Early check-in if possible." },
]

// --- HELPER COMPONENTS ---

const StatusBadge = ({ status }: { status: Guest["status"] }) => {
  const variant = {
    "Checked In": "default",
    "Checked Out": "secondary",
    "Confirmed": "outline",
    "Cancelled": "destructive",
  }[status] as "default" | "secondary" | "outline" | "destructive"

  return <Badge variant={variant}>{status}</Badge>
}

// --- MAIN PAGE COMPONENT ---

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
      accessorKey: "firstName",
      header: "Guest",
      cell: ({ row }) => {
        const guest = row.original
        const fallback = `${guest.firstName[0] ?? ""}${guest.lastName[0] ?? ""}`
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border">
              <AvatarImage src={guest.avatarUrl} alt={`${guest.firstName} ${guest.lastName}`} />
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{guest.firstName} {guest.lastName}</div>
              <div className="text-sm text-muted-foreground truncate">{guest.email}</div>
            </div>
          </div>
        )
      },
    },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.getValue("status")} /> },
    { accessorKey: "roomNum", header: "Room" },
    {
      accessorKey: "checkIn",
      header: "Stay Dates",
      cell: ({ row }) => (
        <div>
          <div>{row.original.checkIn}</div>
          <div className="text-muted-foreground">{row.original.checkOut}</div>
        </div>
      ),
    },
    { accessorKey: "amount", header: () => <div className="text-right">Amount</div>, cell: ({ row }) => <div className="text-right font-medium">${row.getValue("amount")}</div> },
    {
      accessorKey: "paid",
      header: "Payment",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.getValue("paid") ? <IconCircleCheck className="size-5 text-green-500" /> : <IconCircleX className="size-5 text-destructive" />}
          {row.getValue("paid") ? "Paid" : "Unpaid"}
        </div>
      ),
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
                    <Input placeholder="Search by name, email..." value={(table.getColumn("firstName")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("firstName")?.setFilterValue(event.target.value)} className="w-full pl-10 md:w-[250px] lg:w-[300px]" />
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
                            {column.id}
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
          <SheetContent className="sm:max-w-2xl flex flex-col p-0">
            {selectedGuest && (
              <>
                <SheetHeader className="p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-2xl">Reservation #{selectedGuest.uniqueId}</SheetTitle>
                    <StatusBadge status={selectedGuest.status} />
                  </div>
                  <SheetDescription>
                    Details for the reservation of {selectedGuest.firstName} {selectedGuest.lastName}.
                  </SheetDescription>
                </SheetHeader>
                <Separator />
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="size-14 border">
                          <AvatarImage src={selectedGuest.avatarUrl} />
                          <AvatarFallback>{selectedGuest.firstName[0]}{selectedGuest.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{selectedGuest.firstName} {selectedGuest.lastName}</CardTitle>
                          <p className="text-muted-foreground">{selectedGuest.email}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="icon"><IconEdit className="size-4" /></Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4"><IconPhone className="size-5 text-muted-foreground" /><p>{selectedGuest.phone}</p></div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Booking Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><p className="text-sm text-muted-foreground">Check-in</p><p className="font-medium">{selectedGuest.checkIn}</p></div>
                        <div className="space-y-1"><p className="text-sm text-muted-foreground">Check-out</p><p className="font-medium">{selectedGuest.checkOut}</p></div>
                        <div className="space-y-1"><p className="text-sm text-muted-foreground">Room No.</p><p className="font-medium">{selectedGuest.roomNum}</p></div>
                        <div className="space-y-1"><p className="text-sm text-muted-foreground">Guests</p><p className="font-medium">{selectedGuest.guests}</p></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Billing</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="text-2xl font-bold">${selectedGuest.amount.toFixed(2)}</p>
                        </div>
                        <Badge variant={selectedGuest.paid ? "default" : "destructive"} className="gap-1.5">
                          {selectedGuest.paid ? <IconCircleCheck className="size-4" /> : <IconCircleX className="size-4" />}
                          {selectedGuest.paid ? "Paid" : "Unpaid"}
                        </Badge>
                      </div>
                      {!selectedGuest.paid && <Button className="w-full">Mark as Paid</Button>}
                    </CardContent>
                  </Card>

                  {selectedGuest.specialRequests && selectedGuest.specialRequests !== "None." && (
                    <Card>
                      <CardHeader><CardTitle>Special Requests</CardTitle></CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{selectedGuest.specialRequests}</p>
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
