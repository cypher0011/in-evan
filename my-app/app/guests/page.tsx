"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  IconCalendar,
  IconMail,
  IconPhone,
  IconUser,
  IconUsers,
  IconCurrencyDollar,
  IconNotes,
  IconBed
} from "@tabler/icons-react"

// Mock data for guest reservations
const guestData = [
  {
    id: 1,
    uniqueId: "JDXP4K",
    roomNum: "101",
    firstName: "John",
    lastName: "Doe",
    checkIn: "2024-01-15",
    checkOut: "2024-01-20",
    paid: true,
    amount: "$500",
    phone: "+1 234 567 8900",
    email: "john.doe@email.com",
    guests: 2,
    specialRequests: "Extra towels, late checkout"
  },
  {
    id: 2,
    uniqueId: "SSMT7R",
    roomNum: "205",
    firstName: "Sarah",
    lastName: "Smith",
    checkIn: "2024-01-16",
    checkOut: "2024-01-18",
    paid: true,
    amount: "$350",
    phone: "+1 234 567 8901",
    email: "sarah.smith@email.com",
    guests: 1,
    specialRequests: "None"
  },
  {
    id: 3,
    uniqueId: "MJHN9Q",
    roomNum: "310",
    firstName: "Michael",
    lastName: "Johnson",
    checkIn: "2024-01-14",
    checkOut: "2024-01-22",
    paid: false,
    amount: "$800",
    phone: "+1 234 567 8902",
    email: "michael.j@email.com",
    guests: 3,
    specialRequests: "High floor, away from elevator"
  },
  {
    id: 4,
    uniqueId: "EBRW3N",
    roomNum: "412",
    firstName: "Emily",
    lastName: "Brown",
    checkIn: "2024-01-17",
    checkOut: "2024-01-19",
    paid: true,
    amount: "$280",
    phone: "+1 234 567 8903",
    email: "emily.brown@email.com",
    guests: 2,
    specialRequests: "Hypoallergenic pillows"
  },
  {
    id: 5,
    uniqueId: "DWLS8M",
    roomNum: "508",
    firstName: "David",
    lastName: "Wilson",
    checkIn: "2024-01-15",
    checkOut: "2024-01-25",
    paid: false,
    amount: "$1200",
    phone: "+1 234 567 8904",
    email: "david.wilson@email.com",
    guests: 4,
    specialRequests: "Baby crib, connecting rooms"
  },
]

export default function GuestsPage() {
  const [selectedGuest, setSelectedGuest] = React.useState<typeof guestData[0] | null>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  const handleRowClick = (guest: typeof guestData[0]) => {
    setSelectedGuest(guest)
    setIsSheetOpen(true)
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-semibold mb-2">Guest Reservations</h1>
                  <p className="text-muted-foreground text-sm md:text-base">
                    View and manage all guest reservations
                  </p>
                </div>

                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[80px]">ID</TableHead>
                        <TableHead className="min-w-[60px]">Room</TableHead>
                        <TableHead className="min-w-[100px]">First Name</TableHead>
                        <TableHead className="min-w-[100px]">Last Name</TableHead>
                        <TableHead className="min-w-[100px] hidden sm:table-cell">Check In</TableHead>
                        <TableHead className="min-w-[100px] hidden sm:table-cell">Check Out</TableHead>
                        <TableHead className="min-w-[80px]">Amount</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guestData.map((guest) => (
                        <TableRow
                          key={guest.id}
                          onClick={() => handleRowClick(guest)}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-mono font-medium text-xs">{guest.uniqueId}</TableCell>
                          <TableCell className="font-medium">{guest.roomNum}</TableCell>
                          <TableCell>{guest.firstName}</TableCell>
                          <TableCell>{guest.lastName}</TableCell>
                          <TableCell className="hidden sm:table-cell">{guest.checkIn}</TableCell>
                          <TableCell className="hidden sm:table-cell">{guest.checkOut}</TableCell>
                          <TableCell className="font-semibold">{guest.amount}</TableCell>
                          <TableCell>
                            {guest.paid ? (
                              <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
                            ) : (
                              <Badge variant="destructive">Unpaid</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-2xl flex flex-col">
          <SheetHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <SheetTitle className="text-2xl">Reservation Details</SheetTitle>
                <SheetDescription>
                  View and manage guest reservation information
                </SheetDescription>
              </div>
              {selectedGuest && (
                <Badge
                  className={selectedGuest.paid
                    ? "bg-green-500 hover:bg-green-600 text-sm px-3 py-1"
                    : "bg-red-500 hover:bg-red-600 text-sm px-3 py-1"
                  }
                >
                  {selectedGuest.paid ? "Paid" : "Unpaid"}
                </Badge>
              )}
            </div>
          </SheetHeader>

          <Separator className="my-4" />

          {selectedGuest && (
            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {/* Reservation ID Section */}
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-0.5">Reservation ID</p>
                  <p className="text-xl font-mono font-bold tracking-wider">{selectedGuest.uniqueId}</p>
                </div>
              </div>

              {/* Guest Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <IconUser className="size-5" />
                  Guest Information
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/10">
                      <IconUser className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium truncate">{selectedGuest.firstName} {selectedGuest.lastName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/10">
                      <IconMail className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="font-medium truncate">{selectedGuest.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/10">
                      <IconPhone className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="font-medium">{selectedGuest.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Reservation Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <IconCalendar className="size-5" />
                  Booking Details
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <IconBed className="size-4 text-primary" />
                      <p className="text-sm font-medium text-muted-foreground">Room</p>
                    </div>
                    <p className="text-2xl font-bold">{selectedGuest.roomNum}</p>
                  </div>

                  <div className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <IconUsers className="size-4 text-primary" />
                      <p className="text-sm font-medium text-muted-foreground">Guests</p>
                    </div>
                    <p className="text-2xl font-bold">{selectedGuest.guests}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground mb-1">Check-in Date</p>
                    <p className="font-semibold text-base">{selectedGuest.checkIn}</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground mb-1">Check-out Date</p>
                    <p className="font-semibold text-base">{selectedGuest.checkOut}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <IconCurrencyDollar className="size-5 text-green-600 dark:text-green-400" />
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">Total Amount</p>
                      </div>
                      <p className="text-3xl font-bold text-green-900 dark:text-green-100">{selectedGuest.amount}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Special Requests */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <IconNotes className="size-5" />
                  Special Requests
                </h3>
                <div className="p-4 rounded-lg border bg-muted/30 min-h-[100px]">
                  <p className="text-sm leading-relaxed">{selectedGuest.specialRequests}</p>
                </div>
              </div>
            </div>
          )}

          <Separator className="my-4" />

          <SheetFooter className="flex-row gap-2 sm:gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsSheetOpen(false)}>
              Close
            </Button>
            <Button className="flex-1">Edit Reservation</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  )
}
