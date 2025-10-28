"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase/supabase";
import { Card } from "@/components/ui/card";

type Category =
  | "Beverage"
  | "Snack"
  | "Dessert"
  | "Water"
  | "Alcohol"
  | "Main Course"
  | "Breakfast"
  | "Other";

type DbItem = {
  id: string;
  name: string;
  category: Category;
  custom_category: string | null;
  price: number;
  description: string | null;
  allergic_details: string | null;
  calories: number | null;
  stock_quantity: number;
  is_visible: boolean | null;
  // Optional in your schema – if you add it later, this component will use it:
  is_hot?: boolean | null;
  image_url: string | null; // public URL from Supabase Storage
  created_at: string;
};

export default function HotGrid() {
  const [items, setItems] = React.useState<DbItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  const fetchItems = React.useCallback(async () => {
    setLoading(true);
    setErr(null);

    // Pull everything and filter client-side so it works whether `is_hot` exists or not
    const { data, error } = await supabase
      .from("minibar_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErr(error.message);
      setItems([]);
    } else {
      const rows = (data || []) as DbItem[];
      // If is_hot exists, use it; otherwise show visible items
      const filtered = rows.filter((r) =>
        typeof r.is_hot === "boolean" ? !!r.is_hot : !!r.is_visible
      );
      setItems(filtered);
    }

    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <section className="rounded-lg border p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-3">Listed Items</h2>

      {err && (
        <div className="text-sm text-red-600 mb-3">
          Failed to load items: {err}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-500">No hot items yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((it) => (
            <Card
              key={it.id}
              className="flex items-center gap-3 rounded-md border bg-gray-50 hover:bg-gray-100 transition p-3 shadow-sm"
            >
              {/* Thumbnail */}
              <div className="h-16 w-16 rounded border overflow-hidden flex-shrink-0 bg-white">
                {it.image_url ? (
                  <img
                    src={it.image_url}
                    alt={it.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center text-[10px] text-gray-400">
                    no image
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{it.name}</p>
                <p className="text-xs text-gray-600 mt-1">
                  SAR {Number(it.price).toFixed(2)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
