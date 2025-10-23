"use client";

import * as React from "react";
import { loadItems, MINIBAR_UPDATE_EVENT } from "./storage";

export default function HotGrid() {
  const [items, setItems] = React.useState(() => [] as ReturnType<typeof loadItems>);
  const [hydrated, setHydrated] = React.useState(false);

  const refresh = React.useCallback(() => {
    setItems(loadItems().filter((i) => i.hot));
  }, []);

  React.useEffect(() => {
    // First client paint: load and mark hydrated
    refresh();
    setHydrated(true);

    // Listen for same-tab & cross-tab changes
    window.addEventListener(MINIBAR_UPDATE_EVENT, refresh as EventListener);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(MINIBAR_UPDATE_EVENT, refresh as EventListener);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return (
    <section className="rounded-lg border p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-3">Hot Items</h2>

      {}
      <div>
        {!hydrated ? (
          
          <div className="text-sm text-gray-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-gray-500">No hot items yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center gap-3 rounded-md border bg-gray-50 hover:bg-gray-100 transition p-3 shadow-sm"
              >
                {/* Uniform thumbnail */}
                <div className="h-16 w-16 rounded border overflow-hidden flex-shrink-0 bg-white">
                  {it.imageDataUrl ? (
                    <img
                      src={it.imageDataUrl}
                      alt={it.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{it.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    SAR {Number(it.priceSar).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
