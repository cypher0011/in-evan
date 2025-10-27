"use client"

import * as React from "react"
import { loadItems, saveItems, type MiniItem, type Category } from "./storage"
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
  IconBottle,
  IconCandy,
  IconChevronLeft,
  IconChevronRight,
  IconCoffee,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconTrash,
  IconTool,
} from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
// Safe UUID generator that works even when crypto.randomUUID isn't available
function safeUUID(): string {
  // Modern browsers / secure contexts
  // @ts-ignore - narrow typing
  if (typeof crypto !== "undefined" && crypto && typeof crypto.randomUUID === "function") {
    // @ts-ignore
    return crypto.randomUUID();
  }
  // Good fallback using getRandomValues if available
  const g = (typeof crypto !== "undefined" && crypto && typeof crypto.getRandomValues === "function")
    ? crypto.getRandomValues.bind(crypto)
    : null;

  const bytes = new Uint8Array(16);
  if (g) g(bytes);
  else {
    // Last-resort fallback (less random, but avoids crashes)
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  // RFC 4122 version 4 adjustments
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return (
    [...bytes.slice(0, 4)].map(toHex).join("") + "-" +
    [...bytes.slice(4, 6)].map(toHex).join("") + "-" +
    [...bytes.slice(6, 8)].map(toHex).join("") + "-" +
    [...bytes.slice(8,10)].map(toHex).join("") + "-" +
    [...bytes.slice(10)].map(toHex).join("")
  );
}

const SAMPLE_DATA: MiniItem[] = [
  {
    id: "1",
    name: "Coca Cola",
    category: "Beverage",
    price: 15,
    imageUrl: "",
    allergicDetails: "",
    calories: 140,
    stockQuantity: 24,
    description: "Classic Coca-Cola 330ml can",
    isVisible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Pringles Original",
    category: "Snack",
    price: 25,
    imageUrl: "",
    allergicDetails: "Contains wheat, milk",
    calories: 150,
    stockQuantity: 15,
    description: "Crispy potato chips, 165g",
    isVisible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Snickers Bar",
    category: "Dessert",
    price: 12,
    imageUrl: "",
    allergicDetails: "Contains peanuts, milk, soy",
    calories: 250,
    stockQuantity: 30,
    description: "Chocolate bar with peanuts and caramel",
    isVisible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Evian Water",
    category: "Water",
    price: 10,
    imageUrl: "",
    allergicDetails: "",
    calories: 0,
    stockQuantity: 48,
    description: "Natural mineral water 500ml",
    isVisible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Red Bull",
    category: "Beverage",
    price: 20,
    imageUrl: "",
    allergicDetails: "Contains caffeine",
    calories: 110,
    stockQuantity: 0,
    description: "Energy drink 250ml",
    isVisible: false,
    createdAt: new Date().toISOString(),
  },
]

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const getCategoryIcon = (category: Category) => {
  switch (category) {
    case "Beverage":
      return <IconCoffee className="size-5" />
    case "Water":
      return <IconBottle className="size-5" />
    case "Snack":
    case "Dessert":
      return <IconCandy className="size-5" />
    default:
      return <IconTool className="size-5" />
  }
}

export default function MiniBarManager() {
  const [items, setItems] = React.useState<MiniItem[]>(() => {
    if (typeof window === "undefined") return []
    const loaded = loadItems()
    if (loaded.length === 0) {
      saveItems(SAMPLE_DATA)
      return SAMPLE_DATA
    }
    return loaded
  })

  const [hydrated, setHydrated] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<MiniItem | null>(null)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [formData, setFormData] = React.useState<Partial<MiniItem>>({
    name: "",
    category: "Beverage",
    customCategory: "",
    price: 0,
    description: "",
    allergicDetails: "",
    calories: undefined,
    stockQuantity: 0,
    isVisible: true,
    imageUrl: "",
  })

  React.useEffect(() => setHydrated(true), [])
  React.useEffect(() => {
    if (typeof window !== "undefined") saveItems(items)
  }, [items])

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Beverage",
      customCategory: "",
      price: 0,
      description: "",
      allergicDetails: "",
      calories: undefined,
      stockQuantity: 0,
      isVisible: true,
      imageUrl: "",
    })
    setEditingItem(null)
  }

  const openAddDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEditDialog = (item: MiniItem) => {
    setEditingItem(item)
    setFormData(item)
    setDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name?.trim()) return

    if (editingItem) {
      const updated: MiniItem = {
        ...editingItem,
        ...formData,
        name: formData.name!.trim(),
      }
      setItems((old) => old.map((it) => (it.id === editingItem.id ? updated : it)))
    } else {
      const newItem: MiniItem = {
        id: safeUUID(),

        name: formData.name!.trim(),
        category: formData.category || "Other",
        customCategory: formData.category === "Other" ? formData.customCategory?.trim() : undefined,
        price: formData.price || 0,
        description: formData.description?.trim() || "",
        allergicDetails: formData.allergicDetails?.trim() || "",
        calories: formData.calories,
        stockQuantity: formData.stockQuantity || 0,
        isVisible: formData.isVisible ?? true,
        imageUrl: formData.imageUrl || "",
        createdAt: new Date().toISOString(),
      }
      setItems((old) => [newItem, ...old])
    }

    setDialogOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setItems((old) => old.filter((i) => i.id !== id))
  }

  const toggleVisibility = (id: string) => {
    setItems((old) =>
      old.map((i) => (i.id === id ? { ...i, isVisible: !i.isVisible } : i))
    )
  }

  const updateStock = (id: string, newQuantity: number) => {
    setItems((old) =>
      old.map((i) => (i.id === id ? { ...i, stockQuantity: Math.max(0, newQuantity) } : i))
    )
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const dataUrl = await fileToDataUrl(file)
      setFormData((prev) => ({ ...prev, imageUrl: dataUrl }))
    }
  }

  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection)
    setItems((old) => old.filter((item) => !selectedIds.includes(item.id)))
    setRowSelection({})
  }

  const columns: ColumnDef<MiniItem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => {
        const item = row.original
        return item.imageUrl ? (
          <Avatar className="size-10 rounded">
            <AvatarImage src={item.imageUrl} />
            <AvatarFallback><IconPhoto className="size-5" /></AvatarFallback>
          </Avatar>
        ) : (
          <div className="size-10 rounded border flex items-center justify-center bg-muted">
            <IconPhoto className="size-5 text-muted-foreground" />
          </div>
        )
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div>
            <div className="font-medium">{item.name}</div>
            {item.description && (
              <div className="text-sm text-muted-foreground truncate max-w-xs">
                {item.description}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const item = row.original
        return (
          <Badge variant="outline" className="gap-1.5">
            {getCategoryIcon(item.category)}
            {item.category === "Other" && item.customCategory ? item.customCategory : item.category}
          </Badge>
        )
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <div className="font-medium"><span className="icon-saudi_riyal"></span>{row.original.price}</div>,
    },
    {
      accessorKey: "stockQuantity",
      header: "Stock",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              value={item.stockQuantity}
              onChange={(e) => updateStock(item.id, Number(e.target.value))}
              className="w-20"
              onClick={(e) => e.stopPropagation()}
            />
            <span className={`text-sm ${item.stockQuantity === 0 ? "text-destructive" : item.stockQuantity < 5 ? "text-yellow-600" : "text-muted-foreground"}`}>
              {item.stockQuantity === 0 ? "Out" : item.stockQuantity < 5 ? "Low" : ""}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "isVisible",
      header: "Visibility",
      cell: ({ row }) => {
        const item = row.original
        return (
          <Button
            variant={item.isVisible ? "default" : "outline"}
            size="sm"
            onClick={() => toggleVisibility(item.id)}
            className="gap-1.5"
          >
            {item.isVisible ? <><IconEye className="size-4" /> Visible</> : <><IconEyeOff className="size-4" /> Hidden</>}
          </Button>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => openEditDialog(item)}>
                <IconEdit className="size-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(item.id)}
                className="text-destructive"
              >
                <IconTrash className="size-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: items,
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

  if (!hydrated) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Minibar Management</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your hotel minibar items and inventory
          </p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <IconPlus className="size-4" /> Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Items ({table.getFilteredRowModel().rows.length})</CardTitle>
            <div className="relative w-64">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <div className="flex items-center justify-between gap-2 p-4 bg-muted/50">
              <div className="text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="gap-2"
              >
                <IconTrash className="size-4" />
                Delete Selected
              </Button>
            </div>
          )}
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
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
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
                      No items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between gap-4 p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} item(s)
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the minibar item details" : "Add a new item to your minibar"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Coca Cola"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => {
                    setFormData((p) => ({ ...p, category: v as Category }))
                    if (v !== "Other") {
                      setFormData((p) => ({ ...p, customCategory: "" }))
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beverage">Beverage</SelectItem>
                    <SelectItem value="Snack">Snack</SelectItem>
                    <SelectItem value="Dessert">Dessert</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                    <SelectItem value="Alcohol">Alcohol</SelectItem>
                    <SelectItem value="Main Course">Main Course</SelectItem>
                    <SelectItem value="Breakfast">Breakfast</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.category === "Other" && (
                <div className="space-y-2">
                  <Label htmlFor="customCategory">Custom Category *</Label>
                  <Input
                    id="customCategory"
                    required
                    value={formData.customCategory}
                    onChange={(e) => setFormData((p) => ({ ...p, customCategory: e.target.value }))}
                    placeholder="e.g., Hot Meals, Fresh Juice"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="price">Price (Riyal) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Calories (optional)</Label>
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  value={formData.calories || ""}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, calories: e.target.value ? Number(e.target.value) : undefined }))
                  }
                  placeholder="e.g., 140"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  min="0"
                  required
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData((p) => ({ ...p, stockQuantity: Number(e.target.value) }))}
                  placeholder="e.g., 24"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Brief description of the item..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergicDetails">Allergic Details</Label>
              <Input
                id="allergicDetails"
                value={formData.allergicDetails}
                onChange={(e) => setFormData((p) => ({ ...p, allergicDetails: e.target.value }))}
                placeholder="e.g., Contains nuts, dairy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img src={formData.imageUrl} alt="Preview" className="h-20 w-20 rounded object-cover border" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isVisible"
                checked={formData.isVisible}
                onCheckedChange={(checked) => setFormData((p) => ({ ...p, isVisible: checked }))}
              />
              <Label htmlFor="isVisible">Visible to Guests</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingItem ? "Save Changes" : "Add Item"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
