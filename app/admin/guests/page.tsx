"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import {
  IconAdjustmentsHorizontal,
  IconDotsVertical,
  IconFileExport,
  IconPlus,
  IconSearch,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";
import { format } from "date-fns";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Removed Supabase import - now using API route

/* ────────────────────────────────────────────────────────────────────────── */
/* Types based on your Supabase `guests` table                               */
type GuestRow = {
  id: string;
  first_name: string;
  last_name: string;
  room_number: string;
  phone: string | null;
  email: string | null;
  status: "Confirmed" | "Checked In" | "Checked Out" | "Cancelled" | string;
  created_at: string | null;
  token: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
};

/* Badge variant helper to match your look */
const StatusBadge = ({ status }: { status: GuestRow["status"] }) => {
  const variant: "default" | "secondary" | "outline" | "destructive" =
    status === "Checked In"
      ? "default"
      : status === "Checked Out"
      ? "secondary"
      : status === "Cancelled"
      ? "destructive"
      : "outline"; // Confirmed/anything else
  return <Badge variant={variant}>{status}</Badge>;
};

/* ────────────────────────────────────────────────────────────────────────── */

export default function GuestsPage() {
  const [data, setData] = React.useState<GuestRow[]>([]);
  const [selectedGuest, setSelectedGuest] = React.useState<GuestRow | null>(
    null
  );
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch('/api/admin/guests');
        if (response.ok) {
          const data = await response.json();
          setData(data as GuestRow[]);
        } else {
          console.error('Failed to fetch guests');
        }
      } catch (error) {
        console.error('Error fetching guests:', error);
      }
    };
    fetchGuests();
  }, []);

  const handleViewDetails = (guest: GuestRow) => {
    setSelectedGuest(guest);
    setIsSheetOpen(true);
  };

  const copyToken = async (token: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  };

  const columns: ColumnDef<GuestRow>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "first_name",
      header: "Guest Name",
      cell: ({ row }) => {
        const g = row.original;
        const fallback =
          (g.first_name?.[0] ?? "").toUpperCase() +
          (g.last_name?.[0] ?? "").toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-8 border">
              <AvatarImage src="" alt={`${g.first_name} ${g.last_name}`} />
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-medium truncate">
                {g.first_name} {g.last_name}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {g.email ?? ""}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "reservationNumber",
      header: "Reservation",
      cell: ({ row }) => {
        // Derived from UUID just to match your existing look
        const short = row.original.id?.split("-")[0]?.toUpperCase() ?? "—";
        return <span className="font-medium">{short}</span>;
      },
    },
    {
      accessorKey: "room_number",
      header: "Room Number",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "token",
      header: "Token",
      cell: ({ row }) => {
        const token = row.original.token;
        if (!token) return <span className="text-muted-foreground text-sm">—</span>;

        return (
          <div className="flex items-center gap-2">
            <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
              {token}
            </code>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => copyToken(token, e)}
                >
                  {copiedToken === token ? (
                    <IconCheck className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copiedToken === token ? "Copied!" : "Copy token"}
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
    {
      id: "dates",
      header: "Check-in / Check-out",
      cell: ({ row }) => {
        const checkIn = row.original.check_in_date
          ? format(new Date(row.original.check_in_date), "LLL dd, yyyy")
          : "—";
        const checkOut = row.original.check_out_date
          ? format(new Date(row.original.check_out_date), "LLL dd, yyyy")
          : "—";
        return (
          <div>
            <div className="font-medium">{checkIn}</div>
            <div className="text-sm text-muted-foreground">{checkOut}</div>
          </div>
        );
      },
    },
    {
      id: "revenue",
      header: () => <div className="text-right">Revenue</div>,
      cell: () => <div className="text-right font-medium">0</div>, // wire later from orders
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
            <DropdownMenuItem onClick={() => handleViewDetails(row.original)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Edit Reservation</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" disabled>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

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
  });

  return (
    <TooltipProvider>
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
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold">
                  Guest Reservations
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  View and manage all guest reservations.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <IconFileExport className="size-4" /> Export
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => (window.location.href = "/admin/guests/new")}
                >
                  <IconPlus className="size-4" /> Add Reservation
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between gap-4 p-4">
                  <div className="relative">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email..."
                      value={
                        (table.getColumn("first_name")?.getFilterValue() as
                          | string
                          | undefined) ?? ""
                      }
                      onChange={(e) =>
                        table.getColumn("first_name")?.setFilterValue(e.target.value)
                      }
                      className="w-full pl-10 md:w-[250px] lg:w-[300px]"
                    />
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
                        {table
                          .getAllColumns()
                          .filter((c) => c.getCanHide())
                          .map((c) => (
                            <DropdownMenuCheckboxItem
                              key={c.id}
                              className="capitalize"
                              checked={c.getIsVisible()}
                              onCheckedChange={(v) =>
                                c.toggleVisibility(!!v)
                              }
                            >
                              {c.id.includes(".")
                                ? c.id.split(".")[1]
                                : c.id}
                            </DropdownMenuCheckboxItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="rounded-lg border-t overflow-x-auto">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((hg) => (
                        <TableRow key={hg.id}>
                          {hg.headers.map((h) => (
                            <TableHead key={h.id}>
                              {h.isPlaceholder
                                ? null
                                : flexRender(
                                    h.column.columnDef.header,
                                    h.getContext()
                                  )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="cursor-pointer"
                            onClick={() => handleViewDetails(row.original)}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between gap-4 p-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Prev
                    </Button>
                    <span className="text-sm">
                      Page {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount()}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>

        {/* Details sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="sm:max-w-3xl flex flex-col p-0">
            {selectedGuest && (
              <>
                <SheetHeader className="p-6">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-2xl font-semibold">
                      Reservation #{selectedGuest.id.split("-")[0].toUpperCase()}
                    </SheetTitle>
                    <StatusBadge status={selectedGuest.status} />
                  </div>
                  <SheetDescription>
                    Details for {selectedGuest.first_name}{" "}
                    {selectedGuest.last_name}.
                  </SheetDescription>
                </SheetHeader>

                <Separator />
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="grid gap-3">
                    {selectedGuest.token && (
                      <>
                        <div className="text-sm text-muted-foreground">
                          Check-in Token
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-sm bg-muted px-3 py-1.5 rounded flex-1">
                            {selectedGuest.token}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => copyToken(selectedGuest.token!, e)}
                          >
                            {copiedToken === selectedGuest.token ? (
                              <IconCheck className="h-4 w-4 mr-1" />
                            ) : (
                              <IconCopy className="h-4 w-4 mr-1" />
                            )}
                            {copiedToken === selectedGuest.token ? "Copied" : "Copy"}
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Guest check-in URL: https://movenpick.in-evan.site/c/{selectedGuest.token}/welcome
                        </div>
                      </>
                    )}
                    <div className="text-sm text-muted-foreground mt-4">
                      Email
                    </div>
                    <div className="font-medium">
                      {selectedGuest.email ?? "—"}
                    </div>
                    <div className="text-sm text-muted-foreground mt-4">
                      Phone
                    </div>
                    <div className="font-medium">
                      {selectedGuest.phone ?? "—"}
                    </div>
                    <div className="text-sm text-muted-foreground mt-4">
                      Room
                    </div>
                    <div className="font-medium">
                      {selectedGuest.room_number}
                    </div>
                    {selectedGuest.check_in_date && (
                      <>
                        <div className="text-sm text-muted-foreground mt-4">
                          Check-in Date
                        </div>
                        <div className="font-medium">
                          {format(new Date(selectedGuest.check_in_date), "E, LLL dd, yyyy")}
                        </div>
                      </>
                    )}
                    {selectedGuest.check_out_date && (
                      <>
                        <div className="text-sm text-muted-foreground mt-4">
                          Check-out Date
                        </div>
                        <div className="font-medium">
                          {format(new Date(selectedGuest.check_out_date), "E, LLL dd, yyyy")}
                        </div>
                      </>
                    )}
                    <div className="text-sm text-muted-foreground mt-4">
                      Created
                    </div>
                    <div className="font-medium">
                      {selectedGuest.created_at
                        ? format(
                            new Date(selectedGuest.created_at),
                            "E, LLL dd, yyyy"
                          )
                        : "—"}
                    </div>
                  </div>
                </div>

                <Separator />
                <SheetFooter className="p-6 flex-col sm:flex-row sm:justify-between gap-2">
                  <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
                    Close
                  </Button>
                </SheetFooter>
              </>
            )}
          </SheetContent>
        </Sheet>
      </SidebarProvider>
    </TooltipProvider>
  );
}
