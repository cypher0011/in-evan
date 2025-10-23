"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  loadItems,
  saveItems,
  type MiniItem,
} from "./storage";


async function fileToSmallDataUrl(file: File, maxSide = 256): Promise<string> {
  const dataUrl = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });

  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.8);
}

export default function MiniBarManager() {

  const [items, setItems] = useState<MiniItem[]>(() =>
    typeof window === "undefined" ? [] : loadItems()
  );


  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);


  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();


  useEffect(() => {
    if (typeof window !== "undefined") {
      saveItems(items);
    }
  }, [items]);

  async function onPick(f: File | null) {
    setFile(f);
    if (f) setPreview(await fileToSmallDataUrl(f));
    else setPreview(undefined);
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    let imageDataUrl = preview;
    if (!imageDataUrl && file) imageDataUrl = await fileToSmallDataUrl(file);

    const newItem: MiniItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      priceSar: Number(price || 0),
      imageDataUrl,
      hot: false,
      createdAt: new Date().toISOString(),
    };

    setItems((old) => {
      const next = [newItem, ...old];
      // save immediately too (belt & suspenders)
      saveItems(next);
      return next;
    });

    setName("");
    setPrice("");
    setFile(null);
    setPreview(undefined);
  }

  function remove(id: string) {
    setItems((old) => {
      const next = old.filter((i) => i.id !== id);
      saveItems(next);
      return next;
    });
  }

  function toggleHot(id: string) {
    setItems((old) => {
      const next = old.map((i) => (i.id === id ? { ...i, hot: !i.hot } : i));
      saveItems(next);
      return next;
    });
  }

  const hotCount = useMemo(() => items.filter((i) => i.hot).length, [items]);

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-3">Add Mini-Bar Item</h2>

        <form onSubmit={addItem} className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm">Name</label>
            <input
              className="border rounded px-3 py-2"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Snickers"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Price (SAR)</label>
            <input
              className="border rounded px-3 py-2"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="8.00"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            />
          </div>

          {preview && (
            <div className="md:col-span-3">
              <img
                src={preview}
                alt="preview"
                className="h-20 w-20 rounded border object-cover"
              />
            </div>
          )}

          <div className="col-span-full flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              ➕ Submit Item
            </button>
            <button
              type="button"
              onClick={() => {
                setName("");
                setPrice("");
                setFile(null);
                setPreview(undefined);
              }}
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Items table */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Items</h3>
          <span className="text-sm text-gray-500">Hot: {hotCount}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2 pr-3">Image</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Price</th>
                <th className="py-2 pr-3">Hot</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>

            {/* 🔒 Hydration-safe tbody */}
            <tbody>
              {!hydrated ? (
                // Keep SSR/CSR markup identical until client mounts
                <tr>
                  <td className="py-6 text-gray-400" colSpan={5}>
                    Loading…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="py-6 text-gray-500" colSpan={5}>
                    No items yet.
                  </td>
                </tr>
              ) : (
                items.map((i) => (
                  <tr key={i.id} className="border-t">
                    <td className="py-2 pr-3">
                      {i.imageDataUrl ? (
                        <img
                          src={i.imageDataUrl}
                          alt={i.name}
                          className="h-10 w-10 rounded object-cover"
                          loading="lazy"
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2 pr-3">{i.name}</td>
                    <td className="py-2 pr-3">
                      SAR {Number(i.priceSar).toFixed(2)}
                    </td>
                    <td className="py-2 pr-3">
                      {i.hot ? (
                        <button
                          onClick={() => toggleHot(i.id)}
                          className="bg-red-600 text-black text-xs font-semibold px-4 py-1.5 rounded-md shadow-md border border-red-700 hover:bg-red-700 active:scale-95 transition"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleHot(i.id)}
                          className="bg-rose-500 text-red text-xs font-semibold px-4 py-1.5 rounded-md shadow-md border border-rose-600 hover:bg-rose-600 active:scale-95 transition"
                        >
                          HOT 🔥
                        </button>
                      )}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => remove(i.id)}
                        className="bg-rose-500 text-red text-xs font-semibold px-4 py-1.5 rounded-md shadow-md border border-rose-600 hover:bg-rose-600 active:scale-95 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
