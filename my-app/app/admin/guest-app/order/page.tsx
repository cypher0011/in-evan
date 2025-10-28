"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  IconCheck,
  IconShoppingCart,
  IconCircleX,
  IconAlertTriangle,
  IconSearch,
} from "@tabler/icons-react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type Category =
  | "Beverage"
  | "Snack"
  | "Dessert"
  | "Water"
  | "Alcohol"
  | "Main Course"
  | "Breakfast"
  | "Other";

interface MiniItem {
  id: string;
  name: string;
  category: Category;
  customCategory?: string;
  price: number;
  imageUrl?: string;
  allergicDetails?: string;
  calories?: number;
  stockQuantity: number;
  description?: string;
  isVisible: boolean;
  createdAt: string;
}

type FoundGuest = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  room_number: string;
  status: string;
};

type CartLine = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function GuestOrderPage() {
  const [step, setStep] = useState<"order" | "done">("order");
  const [menu, setMenu] = useState<MiniItem[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const [selectedCat, setSelectedCat] = useState<"All" | Category>("All");
  const [search, setSearch] = useState("");

  const [guest, setGuest] = useState<FoundGuest | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lastName, setLastName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [rememberRoom, setRememberRoom] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [confirmErr, setConfirmErr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLastName(sessionStorage.getItem("guest-last") ?? "");
      setRoomNumber(sessionStorage.getItem("guest-room") ?? "");
    }
  }, []);

  /* ------------------------------------------------------------------ */
  /* Fetch minibar items from Supabase                                  */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("minibar_items")
        .select("*")
        .eq("is_visible", true)
        .gt("stock_quantity", 0)
        .order("name", { ascending: true });

      if (error) {
        console.error("Error loading minibar items:", error);
        return;
      }

      const items = (data ?? []).map((d) => ({
        id: d.id,
        name: d.name,
        category: d.category,
        customCategory: d.custom_category ?? undefined,
        price: Number(d.price),
        imageUrl: d.image_url ?? undefined,
        allergicDetails: d.allergic_details ?? undefined,
        calories: d.calories ?? undefined,
        stockQuantity: d.stock_quantity,
        description: d.description ?? undefined,
        isVisible: d.is_visible,
        createdAt: d.created_at,
      }));

      setMenu(items);
    })();
  }, []);

  /* ------------------------------------------------------------------ */
  /* Derived values                                                     */
  /* ------------------------------------------------------------------ */

  const total = useMemo(
    () => cart.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [cart]
  );

  const categories = useMemo<("All" | Category)[]>(() => {
    const set = new Set<Category>();
    for (const m of menu) set.add(m.category);
    return ["All", ...Array.from(set)];
  }, [menu]);

  const filteredMenu = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base =
      selectedCat === "All" ? menu : menu.filter((m) => m.category === selectedCat);
    if (!q) return base;
    return base.filter((m) => m.name.toLowerCase().includes(q));
  }, [menu, selectedCat, search]);

  /* ------------------------------------------------------------------ */
  /* Cart management                                                    */
  /* ------------------------------------------------------------------ */

  const addToCart = (item: MiniItem) => {
    setCart((c) => {
      const existing = c.find((x) => x.itemId === item.id);
      if (existing) {
        if (existing.quantity >= item.stockQuantity) return c;
        return c.map((x) =>
          x.itemId === item.id ? { ...x, quantity: x.quantity + 1 } : x
        );
      }
      return [
        ...c,
        { itemId: item.id, name: item.name, price: item.price, quantity: 1 },
      ];
    });
  };

  const decFromCart = (id: string) =>
    setCart((c) =>
      c
        .map((x) =>
          x.itemId === id ? { ...x, quantity: Math.max(0, x.quantity - 1) } : x
        )
        .filter((x) => x.quantity > 0)
    );

  const removeFromCart = (id: string) =>
    setCart((c) => c.filter((x) => x.itemId !== id));

  /* ------------------------------------------------------------------ */
  /* Checkout confirmation + guest validation                           */
  /* ------------------------------------------------------------------ */

  const onCheckoutClick = () => {
    setError(null);
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (guest) {
      void placeOrderWithGuest(guest);
      return;
    }
    setConfirmErr(null);
    setConfirmOpen(true);
  };

  const confirmAndPlace = async () => {
    setConfirmErr(null);
    const ln = lastName.trim();
    const rn = roomNumber.trim();
    if (!ln || !rn) {
      setConfirmErr("Please enter last name and room number.");
      return;
    }

    setConfirming(true);
    try {
      const { data, error } = await supabase
        .from("guests")
        .select("id, first_name, last_name, room_number, status")
        .ilike("last_name", ln)
        .eq("room_number", rn)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setConfirmErr("Guest not found. Please check your details.");
        return;
      }
      if (data.status !== "Checked In") {
        setConfirmErr("This room is not currently checked in.");
        return;
      }

      const g = data as FoundGuest;
      setGuest(g);
      if (rememberRoom && typeof window !== "undefined") {
        sessionStorage.setItem("guest-room", rn);
        sessionStorage.setItem("guest-last", ln);
      }

      setConfirmOpen(false);
      await placeOrderWithGuest(g);
    } catch (e: any) {
      setConfirmErr(e.message ?? "Unable to verify guest.");
    } finally {
      setConfirming(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Place order (with DB + stock decrement)                            */
  /* ------------------------------------------------------------------ */

  const placeOrderWithGuest = async (g: FoundGuest) => {
    setError(null);
    setPlacing(true);
    try {
      // 1) Insert into orders
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert([
          {
            guest_id: g.id,
            room_number: g.room_number,
            source: "minibar",
            status: "Pending",
            notes: notes || null,
            guest_last_name: g.last_name ?? null,
          },
        ])
        .select("id")
        .single();

      if (orderErr) throw orderErr;
      const orderId = order!.id as string;

      // 2) Insert into order_items
      const itemsPayload = cart.map((l) => ({
        order_id: orderId,
        minibar_item: l.itemId,
        name_snapshot: l.name,
        price_snapshot: l.price,
        quantity: l.quantity,
        line_total: l.price * l.quantity,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload);
      if (itemsErr) throw itemsErr;

      // 3) Decrement stock in DB
      for (const line of cart) {
        await supabase.rpc("decrement_minibar_stock", {
          p_item_id: line.itemId,
          p_qty: line.quantity,
        });
      }

      setPlacedOrderId(orderId);
      setCart([]);
      setStep("done");
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to place order.");
    } finally {
      setPlacing(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* UI: Confirmation Page                                              */
  /* ------------------------------------------------------------------ */

  if (step === "done") {
    return (
      <div className="relative min-h-screen bg-[#1d1d1d] p-6 flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-100/5 via-transparent to-indigo-200/10 pointer-events-none" />
        <Card className="relative max-w-xl w-full shadow-lg border border-white/5 bg-[#232323]/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-xl font-semibold">
              <IconCheck className="size-5 text-green-500" />
              Order placed!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-100">
            <p>
              Thank you{" "}
              <span className="font-semibold">{guest?.first_name ?? ""}</span>! Your minibar request was submitted.
            </p>
            <p className="text-sm text-gray-400">
              Order ID:&nbsp;
              <span className="font-mono text-gray-300 tracking-wide">
                {placedOrderId?.slice(0, 8).toUpperCase()}
              </span>
            </p>
            <Button className="mt-2" onClick={() => window.location.reload()}>
              Place another order
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* UI: Order Page                                                     */
  /* ------------------------------------------------------------------ */

  return (
    <div className="relative min-h-screen bg-[#1d1d1d] text-gray-100 p-4 md:p-6 overflow-hidden">
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Minibar Order</h1>
            <p className="text-muted-foreground">
              {guest
                ? `Room ${guest.room_number} • ${guest.first_name ?? ""} ${guest.last_name ?? ""}`
                : "Build your cart, then confirm your stay at checkout."}
            </p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <IconShoppingCart className="size-4" />
            {cart.reduce((sum, l) => sum + l.quantity, 0)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>Available items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCat === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCat(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                <div className="relative w-64">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search items…"
                  />
                </div>
              </div>

              {filteredMenu.length === 0 && (
                <p className="text-sm text-muted-foreground px-1">
                  No items match your filters.
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMenu.map((m) => {
                  const inCart = cart.find((c) => c.itemId === m.id);
                  const remaining = m.stockQuantity - (inCart?.quantity ?? 0);
                  return (
                    <div key={m.id} className="rounded-lg border bg-white p-4 flex gap-4 items-start shadow-sm">
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        {m.imageUrl ? (
                          <img
                            src={m.imageUrl}
                            alt={m.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-medium truncate">{m.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {m.category === "Other" && m.customCategory
                              ? m.customCategory
                              : m.category}
                          </div>
                        </div>

                        {m.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {m.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <Badge variant="outline">Price: {m.price}</Badge>
                          {m.calories != null && (
                            <Badge variant="outline">{m.calories} cal</Badge>
                          )}
                          {m.allergicDetails && <Badge variant="outline">Allergens</Badge>}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" onClick={() => addToCart(m)} disabled={remaining <= 0}>
                          Add
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => decFromCart(m.id)}
                          disabled={!inCart}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Cart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Cart</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground">Your cart is empty.</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((l) => (
                    <div key={l.itemId} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{l.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {l.quantity} × {l.price}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => decFromCart(l.itemId)}>
                          −
                        </Button>
                        <span className="w-6 text-center">{l.quantity}</span>
                        <Button
                          size="icon"
                          onClick={() => {
                            const m = menu.find((x) => x.id === l.itemId);
                            if (m) addToCart(m);
                          }}
                        >
                          +
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeFromCart(l.itemId)}
                        >
                          <IconCircleX className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Anything we should know?"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-lg font-semibold">{total}</div>
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <IconAlertTriangle className="size-4" /> {error}
                    </p>
                  )}
                  <Button className="w-full" onClick={onCheckoutClick} disabled={placing}>
                    {placing ? "Placing..." : "Place order"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm your order</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="last">Last name</Label>
                <Input
                  id="last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g., Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room number</Label>
                <Input
                  id="room"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g., 205"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberRoom}
                onCheckedChange={(v) => setRememberRoom(Boolean(v))}
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground">
                Remember me on this device
              </Label>
            </div>

            {confirmErr && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <IconAlertTriangle className="size-4" /> {confirmErr}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAndPlace} disabled={confirming}>
              {confirming ? "Confirming…" : "Confirm & Place order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
