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
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase/supabase";

type Category =
  | "Beverage"
  | "Snack"
  | "Dessert"
  | "Water"
  | "Alcohol"
  | "Main Course"
  | "Breakfast"
  | "Other";

export type MiniItem = {
  id: string;
  name: string;
  category: Category;
  custom_category?: string | null;
  price: number;
  description?: string | null;
  allergic_details?: string | null;
  calories?: number | null;
  stock_quantity: number;
  is_visible: boolean;
  image_url?: string | null;
  created_at: string;
};

const getCategoryIcon = (category: Category) => {
  switch (category) {
    case "Beverage":
      return <IconCoffee className="size-5" />;
    case "Water":
      return <IconBottle className="size-5" />;
    case "Snack":
    case "Dessert":
      return <IconCandy className="size-5" />;
    default:
      return <IconTool className="size-5" />;
  }
};

export default function MiniBarManager() {
  const [items, setItems] = React.useState<MiniItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [hotelId, setHotelId] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MiniItem | null>(null);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [formData, setFormData] = React.useState<Partial<MiniItem>>({
    name: "",
    category: "Beverage",
    custom_category: "",
    price: 0,
    description: "",
    allergic_details: "",
    calories: undefined,
    stock_quantity: 0,
    is_visible: true,
    image_url: "",
  });

  const [uploadingImage, setUploadingImage] = React.useState(false);

  // ---------- CRUD helpers ----------

  const fetchItems = React.useCallback(async () => {
    setErr(null);
    setLoading(true);

    // Get hotel ID if not already set
    if (!hotelId) {
      const { data: hotelData } = await supabase
        .from("hotels")
        .select("id")
        .limit(1)
        .single();

      if (hotelData) {
        setHotelId(hotelData.id);
      }
    }

    const { data, error } = await supabase
      .from("minibar_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setErr(error.message);
    else setItems(data as MiniItem[]);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Beverage",
      custom_category: "",
      price: 0,
      description: "",
      allergic_details: "",
      calories: undefined,
      stock_quantity: 0,
      is_visible: true,
      image_url: "",
    });
    setEditingItem(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (item: MiniItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
      custom_category: item.custom_category ?? "",
      description: item.description ?? "",
      allergic_details: item.allergic_details ?? "",
      image_url: item.image_url ?? "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const payload = {
      name: formData.name!.trim(),
      category: (formData.category || "Other") as Category,
      custom_category:
        formData.category === "Other"
          ? (formData.custom_category || "").trim() || null
          : null,
      price: formData.price || 0,
      description: (formData.description || "").trim() || null,
      allergic_details: (formData.allergic_details || "").trim() || null,
      calories:
        formData.calories === undefined || formData.calories === null
          ? null
          : Number(formData.calories),
      stock_quantity: formData.stock_quantity || 0,
      is_visible: formData.is_visible ?? true,
      image_url: formData.image_url || null,
      hotel_id: hotelId, // Add hotel_id to associate item with hotel
    };

    if (editingItem) {
      const { error } = await supabase
        .from("minibar_items")
        .update(payload)
        .eq("id", editingItem.id);
      if (error) return setErr(error.message);
    } else {
      const { error } = await supabase.from("minibar_items").insert([payload]);
      if (error) return setErr(error.message);
    }

    setDialogOpen(false);
    resetForm();
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("minibar_items").delete().eq("id", id);
    if (error) return setErr(error.message);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleVisibility = async (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    const next = !target.is_visible;
    // optimistic
    setItems((old) =>
      old.map((i) => (i.id === id ? { ...i, is_visible: next } : i))
    );
    const { error } = await supabase
      .from("minibar_items")
      .update({ is_visible: next })
      .eq("id", id);
    if (error) {
      setErr(error.message);
      fetchItems();
    }
  };

  const updateStock = async (id: string, newQuantity: number) => {
    // optimistic
    setItems((old) =>
      old.map((i) =>
        i.id === id ? { ...i, stock_quantity: Math.max(0, newQuantity) } : i
      )
    );
    const { error } = await supabase
      .from("minibar_items")
      .update({ stock_quantity: Math.max(0, newQuantity) })
      .eq("id", id);
    if (error) {
      setErr(error.message);
      fetchItems();
    }
  };

  // Upload image to S3
  const handleImageUpload = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErr(null);

    if (!file.type.startsWith("image/")) {
      setErr("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErr("Image too large (max 5MB).");
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/admin/api/upload", {
        method: "POST",
        body: formData,
      });

      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json")
        ? await res.json()
        : { error: await res.text() };

      console.log("Upload response:", { status: res.ok, data });

      if (!res.ok) {
        setErr(data.error || "Upload failed");
        return;
      }

      if (!data.url) {
        setErr("No URL returned from upload");
        return;
      }

      console.log("Setting image URL:", data.url);
      setFormData((p) => ({ ...p, image_url: data.url }));
    } catch (error: any) {
      setErr(error?.message || "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  }, []);


  // ---------- table columns ----------

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
      accessorKey: "image_url",
      header: "Image",
      cell: ({ row }) => {
        const item = row.original;
        return item.image_url ? (
          <Avatar className="size-10 rounded">
            <AvatarImage src={item.image_url} />
            <AvatarFallback>
              <IconPhoto className="size-5" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="size-10 rounded border flex items-center justify-center bg-muted">
            <IconPhoto className="size-5 text-muted-foreground" />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            <div className="font-medium">{item.name}</div>
            {item.description && (
              <div className="text-sm text-muted-foreground truncate max-w-xs">
                {item.description}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const item = row.original;
        const label =
          item.category === "Other" && item.custom_category
            ? item.custom_category
            : item.category;
        return (
          <Badge variant="outline" className="gap-1.5">
            {getCategoryIcon(item.category)}
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.price}</div>
      ),
    },
    {
      accessorKey: "stock_quantity",
      header: "Stock",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              value={item.stock_quantity}
              onChange={(e) => updateStock(item.id, Number(e.target.value))}
              className="w-20"
              onClick={(e) => e.stopPropagation()}
            />
            <span
              className={`text-sm ${
                item.stock_quantity === 0
                  ? "text-destructive"
                  : item.stock_quantity < 5
                  ? "text-yellow-600"
                  : "text-muted-foreground"
              }`}
            >
              {item.stock_quantity === 0
                ? "Out"
                : item.stock_quantity < 5
                ? "Low"
                : ""}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "is_visible",
      header: "Visibility",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Button
            variant={item.is_visible ? "default" : "outline"}
            size="sm"
            onClick={() => toggleVisibility(item.id)}
            className="gap-1.5"
          >
            {item.is_visible ? (
              <>
                <IconEye className="size-4" /> Visible
              </>
            ) : (
              <>
                <IconEyeOff className="size-4" /> Hidden
              </>
            )}
          </Button>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
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
        );
      },
    },
  ];

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
  });

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
            <CardTitle>
              {loading ? "Loading items…" : `Items (${table.getFilteredRowModel().rows.length})`}
            </CardTitle>
            <div className="relative w-64">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="pl-9"
              />
            </div>
          </div>
          {err && <p className="text-sm text-red-600 mt-2">{err}</p>}
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
                onClick={async () => {
                  const ids = table
                    .getFilteredSelectedRowModel()
                    .rows.map((r) => (r.original as MiniItem).id);
                  if (ids.length === 0) return;
                  const { error } = await supabase
                    .from("minibar_items")
                    .delete()
                    .in("id", ids);
                  if (error) setErr(error.message);
                  fetchItems();
                }}
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
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24">
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
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
                  value={formData.name || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Coca Cola"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={(formData.category as Category) || "Beverage"}
                  onValueChange={(v) => {
                    setFormData((p) => ({ ...p, category: v as Category }));
                    if (v !== "Other") setFormData((p) => ({ ...p, custom_category: "" }));
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
                    value={formData.custom_category || ""}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, custom_category: e.target.value }))
                    }
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
                  value={formData.price ?? 0}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, price: Number(e.target.value) }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Calories (optional)</Label>
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  value={formData.calories ?? ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      calories: e.target.value ? Number(e.target.value) : undefined,
                    }))
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
                  value={formData.stock_quantity ?? 0}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      stock_quantity: Number(e.target.value),
                    }))
                  }
                  placeholder="e.g., 24"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Brief description of the item..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergicDetails">Allergic Details</Label>
              <Input
                id="allergicDetails"
                value={formData.allergic_details || ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, allergic_details: e.target.value }))
                }
                placeholder="e.g., Contains nuts, dairy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              {uploadingImage && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                  Uploading image, please wait...
                </div>
              )}
              {formData.image_url && !uploadingImage && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-20 w-20 rounded object-cover border"
                    onError={(e) => {
                      console.error("Image failed to load:", formData.image_url);
                      setErr("Failed to load image. Check if URL is accessible.");
                    }}
                    onLoad={() => console.log("Image loaded successfully:", formData.image_url)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData((p) => ({ ...p, image_url: "" }))}
                    className="text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              )}
              {!uploadingImage && formData.image_url && (
                <p className="text-xs text-muted-foreground">Preview URL: {formData.image_url}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isVisible"
                checked={!!formData.is_visible}
                onCheckedChange={(checked) =>
                  setFormData((p) => ({ ...p, is_visible: checked }))
                }
              />
              <Label htmlFor="isVisible">Visible to Guests</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploadingImage}>
                {uploadingImage
                  ? "Uploading..."
                  : editingItem
                  ? "Save Changes"
                  : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
