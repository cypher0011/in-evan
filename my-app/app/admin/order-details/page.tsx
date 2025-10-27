"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/supabase";
import { format } from "date-fns";

/* ---------- Types ---------- */
type OrderItemRow = {
  id: string;
  name_snapshot: string;
  price_snapshot: number;
  quantity: number;
  line_total: number;
  created_at?: string;
};

type OrderRow = {
  id: string;
  guest_id: string;
  room_number: string;
  source: "minibar" | "restaurant" | string;
  status: "Pending" | "preparing" | "delivered" | "cancelled" | string;
  notes: string | null;
  created_at: string;
  order_items: OrderItemRow[];
  guests: { first_name: string | null; last_name: string | null } | null;
};

/* ---------- Small UI helpers ---------- */
const StatusBadge = ({ status }: { status: OrderRow["status"] }) => {
  const variant =
    status === "delivered"
      ? "secondary"
      : status === "cancelled"
      ? "destructive"
      : status === "preparing"
      ? "default"
      : "outline"; // Pending
  return <Badge variant={variant}>{status}</Badge>;
};

export default function OrderDetailsPage() {
  const vars = {
    "--sidebar-width": "calc(var(--spacing) * 72)",
    "--header-height": "calc(var(--spacing) * 12)",
  } as React.CSSProperties;

  /* ---------- State (INSIDE component) ---------- */
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  /* ---------- Fetch orders ---------- */
  useEffect(() => {
    (async () => {
      setErr(null);
      setLoading(true);

      const { data, error } = (await supabase
        .from("orders")
        .select(`
          id,
          guest_id,
          room_number,
          source,
          status,
          notes,
          created_at,
          order_items (
            id,
            name_snapshot,
            price_snapshot,
            quantity,
            line_total,
            created_at
          ),
          guests (
            first_name,
            last_name
          )
        `)
        .order("created_at", { ascending: false })) as unknown as {
        data: OrderRow[] | null;
        error: any;
      };

      if (error) {
        setErr(error.message);
      } else {
        setOrders(data ?? []);
      }
      setLoading(false);
    })();
  }, []);

  /* ---------- Status update ---------- */
  async function updateStatus(
  id: string,
  next: "Pending" | "preparing" | "delivered" | "cancelled"
) {
  try {
    setSavingId(id);
    const { error } = await supabase.from("orders").update({ status: next }).eq("id", id);
    if (error) throw error;

    if (next === "delivered") {
      // Trigger will archive+delete; remove from UI now
      setOrders(prev => prev.filter(o => o.id !== id));
    } else {
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: next } : o)));
    }
  } catch (e) {
    setErr(e instanceof Error ? e.message : "Failed to update status");
  } finally {
    setSavingId(null);
  }
}


  /* ---------- Derived lists ---------- */
  const minibarOrders = useMemo(
    () => orders.filter((o) => o.source === "minibar"),
    [orders]
  );
  const restaurantOrders = useMemo(
    () => orders.filter((o) => o.source === "restaurant"),
    [orders]
  );

  /* ---------- Reusable section ---------- */
  const Section = ({
    title,
    subtitle,
    items,
  }: {
    title: string;
    subtitle: string;
    items: OrderRow[];
  }) => (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Loading orders…
          </CardContent>
        </Card>
      ) : err ? (
        <Card>
          <CardContent className="p-6 text-sm text-red-600">{err}</CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2 text-gray-800">
              No {title.toLowerCase()} available
            </h3>
            <p className="text-gray-600">Orders will appear here once available.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((o) => {
            const guestName =
              (o.guests?.first_name ?? "") +
              (o.guests?.last_name ? ` ${o.guests.last_name}` : "");
            const total = o.order_items?.reduce(
              (sum, li) => sum + (li.line_total ?? li.price_snapshot * li.quantity),
              0
            );

            return (
              <Card key={o.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        Order #{o.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Room {o.room_number}
                        {guestName.trim() && <> • {guestName}</>}
                      </p>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(o.created_at), "LLL dd, yyyy 'at' h:mm a")}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3">
                  {o.order_items?.length ? (
                    <div className="divide-y">
                      {o.order_items.map((li) => (
                        <div
                          key={li.id}
                          className="py-2 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="font-medium truncate">{li.name_snapshot}</div>
                            <div className="text-sm text-muted-foreground">
                              {li.quantity} × {li.price_snapshot}
                            </div>
                          </div>
                          <div className="font-semibold">
                            {li.line_total ?? li.price_snapshot * li.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No items attached.</p>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-lg font-semibold">{total}</div>
                  </div>

                  {o.notes && (
                    <div className="pt-1">
                      <div className="text-xs text-muted-foreground mb-1">Notes</div>
                      <div className="text-sm">{o.notes}</div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(o.id, "preparing")}
                      disabled={
                        savingId === o.id || o.status === "delivered" || o.status === "cancelled"
                      }
                    >
                      {savingId === o.id && o.status !== "preparing"
                        ? "Saving..."
                        : "Mark preparing"}
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => updateStatus(o.id, "delivered")}
                      disabled={
                        savingId === o.id || o.status === "delivered" || o.status === "cancelled"
                      }
                    >
                      {savingId === o.id && o.status !== "delivered"
                        ? "Saving..."
                        : "Mark delivered"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );

  return (
    <SidebarProvider style={vars}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <main className="flex-1 p-4 md:p-6 space-y-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
            <p className="text-gray-500 text-sm">
              View and manage your hotel guest orders including minibar and restaurant requests.
            </p>
          </div>

          <Separator />

          <Section
            title="Minibar Orders"
            subtitle="Track and manage orders placed from the guest room minibar."
            items={minibarOrders}
          />

          <Separator />

          <Section
            title="Restaurant Orders"
            subtitle="Monitor and process food orders placed by hotel guests from the restaurant."
            items={restaurantOrders}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
