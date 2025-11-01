'use client';

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  IconCheck,
  IconShoppingCart,
  IconCircleX,
  IconAlertTriangle,
  IconSearch,
  IconMinus,
  IconPlus,
} from '@tabler/icons-react';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type Category =
  | 'Beverage'
  | 'Snack'
  | 'Dessert'
  | 'Water'
  | 'Alcohol'
  | 'Main Course'
  | 'Breakfast'
  | 'Other';

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
}

type Hotel = {
  id: string;
  name: string;
  logoUrl?: string;
  subdomain: string;
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

interface MinibarManagerProps {
  items: MiniItem[];
  hotel: Hotel;
}

export default function MinibarManager({ items, hotel }: MinibarManagerProps) {
  const [step, setStep] = useState<'order' | 'done'>('order');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const [selectedCat, setSelectedCat] = useState<'All' | Category>('All');
  const [search, setSearch] = useState('');

  const [cartOpen, setCartOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lastName, setLastName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [confirmErr, setConfirmErr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLastName(sessionStorage.getItem('minibar-last-name') ?? '');
      setRoomNumber(sessionStorage.getItem('minibar-room-number') ?? '');
    }
  }, []);

  /* ------------------------------------------------------------------ */
  /* Derived values                                                     */
  /* ------------------------------------------------------------------ */

  const total = useMemo(
    () => cart.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [cart]
  );

  const cartItemCount = useMemo(
    () => cart.reduce((sum, l) => sum + l.quantity, 0),
    [cart]
  );

  const categories = useMemo<('All' | Category)[]>(() => {
    const set = new Set<Category>();
    for (const m of items) set.add(m.category);
    return ['All', ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base =
      selectedCat === 'All' ? items : items.filter((m) => m.category === selectedCat);
    if (!q) return base;
    return base.filter((m) => m.name.toLowerCase().includes(q));
  }, [items, selectedCat, search]);

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
  /* Checkout confirmation                                              */
  /* ------------------------------------------------------------------ */

  const onCheckoutClick = () => {
    setError(null);
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setConfirmErr(null);
    setCartOpen(false);
    setConfirmOpen(true);
  };

  const confirmAndPlace = async () => {
    setConfirmErr(null);
    const ln = lastName.trim();
    const rn = roomNumber.trim();
    if (!ln || !rn) {
      setConfirmErr('Please enter your last name and room number.');
      return;
    }

    setConfirming(true);
    try {
      const response = await fetch('/api/minibar/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: hotel.id,
          lastName: ln,
          roomNumber: rn,
          items: cart.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
          })),
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      const order = await response.json();

      // Save to session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('minibar-room-number', rn);
        sessionStorage.setItem('minibar-last-name', ln);
      }

      setPlacedOrderId(order.id);
      setCart([]);
      setNotes('');
      setConfirmOpen(false);
      setStep('done');
    } catch (e: any) {
      console.error(e);
      setConfirmErr(e.message ?? 'Unable to place order.');
    } finally {
      setConfirming(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* UI: Confirmation Page                                              */
  /* ------------------------------------------------------------------ */

  if (step === 'done') {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/hotel_bg_test.jpeg"
            alt="Hotel Background"
            fill
            quality={60}
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 min-h-screen p-6 flex items-center justify-center">
          <Card className="max-w-xl w-full shadow-2xl border border-white/20 backdrop-blur-md bg-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-xl font-semibold">
                <IconCheck className="size-6 text-green-400" />
                Order Placed Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-white">
              <p className="text-lg">
                Thank you! Your minibar order has been submitted to our team.
              </p>
              <p className="text-sm text-white/70">
                Order ID:&nbsp;
                <span className="font-mono text-white tracking-wide">
                  {placedOrderId?.slice(0, 8).toUpperCase()}
                </span>
              </p>
              <p className="text-sm text-white/70">
                Room: {roomNumber} • {lastName}
              </p>
              <Separator className="bg-white/20" />
              <p className="text-sm text-white/80">
                Your order will be delivered to your room shortly. If you have any questions, please contact the front desk.
              </p>
              <Button
                className="w-full mt-4"
                onClick={() => {
                  setStep('order');
                  setPlacedOrderId(null);
                }}
              >
                Place Another Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* UI: Order Page                                                     */
  /* ------------------------------------------------------------------ */

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/hotel_bg_test.jpeg"
          alt="Hotel Background"
          fill
          quality={60}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              {hotel.logoUrl && (
                <div className="mb-2 flex justify-center md:justify-start">
                  <Image
                    src={hotel.logoUrl}
                    alt={hotel.name}
                    width={140}
                    height={50}
                    className="object-contain"
                  />
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Minibar Menu
              </h1>
              <p className="text-white/70 mt-1">
                Order from the comfort of your room
              </p>
            </div>

            {/* Cart Button */}
            <Button
              size="lg"
              onClick={() => setCartOpen(true)}
              className="relative bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white"
            >
              <IconShoppingCart className="size-5 mr-2" />
              Cart
              {cartItemCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Search & Categories */}
          <div className="mb-6 backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/60" />
                <Input
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search items..."
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCat === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCat(cat)}
                    className={
                      selectedCat === cat
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 backdrop-blur-md bg-white/10 rounded-2xl border border-white/20">
              <p className="text-white/70">No items match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const inCart = cart.find((c) => c.itemId === item.id);
                const remaining = item.stockQuantity - (inCart?.quantity ?? 0);
                return (
                  <Card
                    key={item.id}
                    className="backdrop-blur-md bg-white/10 border-white/20 overflow-hidden hover:bg-white/15 transition-all"
                  >
                    <div className="relative w-full h-40">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/40 text-sm">
                          No image
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-lg">
                            {item.name}
                          </h3>
                          <p className="text-xs text-white/60">
                            {item.category === 'Other' && item.customCategory
                              ? item.customCategory
                              : item.category}
                          </p>
                        </div>
                        <Badge className="bg-white/20 text-white border-white/30">
                          ${item.price}
                        </Badge>
                      </div>

                      {item.description && (
                        <p className="text-sm text-white/70 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mb-3 text-xs">
                        {item.calories != null && (
                          <Badge variant="outline" className="bg-white/5 text-white border-white/30">
                            {item.calories} cal
                          </Badge>
                        )}
                        {item.allergicDetails && (
                          <Badge variant="outline" className="bg-white/5 text-white border-white/30">
                            Allergen Info
                          </Badge>
                        )}
                      </div>

                      {inCart ? (
                        <div className="flex items-center justify-between">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => decFromCart(item.id)}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            <IconMinus className="size-4" />
                          </Button>
                          <span className="text-white font-semibold">
                            {inCart.quantity}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => addToCart(item)}
                            disabled={remaining <= 0}
                            className="bg-white text-black hover:bg-white/90"
                          >
                            <IconPlus className="size-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="w-full bg-white text-black hover:bg-white/90"
                          onClick={() => addToCart(item)}
                          disabled={remaining <= 0}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cart Sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="bg-[#1d1d1d] text-white border-white/20">
          <SheetHeader>
            <SheetTitle className="text-white flex items-center gap-2">
              <IconShoppingCart className="size-5" />
              Your Cart
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {cart.length === 0 ? (
              <p className="text-white/60 text-center py-8">
                Your cart is empty
              </p>
            ) : (
              <>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.itemId}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-white">{item.name}</div>
                        <div className="text-sm text-white/60">
                          ${item.price} × {item.quantity}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeFromCart(item.itemId)}
                          className="text-white/60 hover:text-white hover:bg-white/10"
                        >
                          <IconCircleX className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/20" />

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">
                    Special Instructions (optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests?"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="flex items-center justify-between text-lg font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>

                {error && (
                  <p className="text-sm text-red-400 flex items-center gap-2">
                    <IconAlertTriangle className="size-4" /> {error}
                  </p>
                )}
              </>
            )}
          </div>

          <SheetFooter className="mt-6">
            <Button
              className="w-full bg-white text-black hover:bg-white/90"
              onClick={onCheckoutClick}
              disabled={cart.length === 0 || placing}
            >
              {placing ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-[#1d1d1d] text-white border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Your Order</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-white/70">
              Please provide your information to complete the order.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="last" className="text-white">
                  Last Name
                </Label>
                <Input
                  id="last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g., Smith"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room" className="text-white">
                  Room Number
                </Label>
                <Input
                  id="room"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g., 205"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            {confirmErr && (
              <p className="text-sm text-red-400 flex items-center gap-2">
                <IconAlertTriangle className="size-4" /> {confirmErr}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAndPlace}
              disabled={confirming}
              className="bg-white text-black hover:bg-white/90"
            >
              {confirming ? 'Confirming...' : 'Confirm & Place Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
