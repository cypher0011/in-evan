"use client";

import React, { useEffect, useMemo, useState } from "react";
import { loadItems, saveItems, type MiniItem } from "./storage";
import ItemDetailsSheet from "@/components/minibar/ItemDetailsSheet";

/** Downscale an image to keep localStorage usage small */
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
  // Data
  const [items, setItems] = useState<MiniItem[]>(
    () => (typeof window === "undefined" ? [] : loadItems())
  );

  // Hydration guard (so table doesn’t render mismatched HTML on first paint)
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();

  // View/Details sheet
  const [selectedItem, setSelectedItem] = useState<MiniItem | null>(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<MiniItem | null>(null);

  // Persist on any change
  useEffect(() => {
    if (typeof window !== "undefined") saveItems(items);
  }, [items]);

  // ---- helpers --------------------------------------------------------------
  function resetForm() {
    setName("");
    setPrice("");
    setDescription("");
    setFile(null);
    setPreview(undefined);
    setIsEditing(false);
    setEditingItem(null);
  }

  async function onPick(f: File | null) {
    setFile(f);
    if (f) setPreview(await fileToSmallDataUrl(f));
    else setPreview(undefined);
  }

  // ---- add / edit -----------------------------------------------------------
  async function submitItem(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    let imageDataUrl = preview;
    if (!imageDataUrl && file) imageDataUrl = await fileToSmallDataUrl(file);

    if (isEditing && editingItem) {
      // SAVE CHANGES
      const updated: MiniItem = {
        ...editingItem,
        name: name.trim(),
        priceSar: Number(price || 0),
        description: description.trim(),
        imageDataUrl,
      };
      setItems((old) => old.map((it) => (it.id === editingItem.id ? updated : it)));
      resetForm();
      return;
    }

    // ADD NEW
    const newItem: MiniItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      priceSar: Number(price || 0),
      imageDataUrl,
      description: description.trim(),
      hot: false,
      createdAt: new Date().toISOString(),
    };

    setItems((old) => [newItem, ...old]);
    resetForm();
  }

  function handleEdit(item: MiniItem) {
    setEditingItem(item);
    setIsEditing(true);
    setName(item.name);
    setPrice(String(item.priceSar ?? ""));
    setDescription(item.description ?? "");
    setPreview(item.imageDataUrl);
    setFile(null);
  }

  // ---- remove / hot ---------------------------------------------------------
  function remove(id: string) {
    setItems((old) => old.filter((i) => i.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
  }

  function toggleHot(id: string) {
    setItems((old) =>
      old.map((i) => (i.id === id ? { ...i, hot: !i.hot } : i))
    );
  }

  const hotCount = useMemo(() => items.filter((i) => i.hot).length, [items]);

  // ---- UI -------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* ===================== Add / Edit form ===================== */}
      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-3">Add Mini-Bar Item</h2>

        <form onSubmit={submitItem} className="grid gap-4 md:grid-cols-3">
          {/* Name */}
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

          {/* Price */}
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

          {/* Description */}
          <div className="flex flex-col gap-1 md:col-span-3">
            <label className="text-sm">Description</label>
            <textarea
              className="border rounded px-3 py-2 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the item..."
            />
          </div>

          {/* Image picker (button look) */}
          <div className="flex items-center gap-3 md:col-span-1">
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => onPick(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"

            >
              ➕ Choose Image
            </label>
            {file && (
              <span className="text-xs text-gray-600 truncate max-w-[160px]">
                {file.name}
              </span>
            )}
          </div>

          {/* Preview (if chosen) */}
          {preview && (
            <div className="md:col-span-2 flex items-center">
              <img
                src={preview}
                alt="preview"
                className="h-20 w-20 rounded border object-cover"
              />
            </div>
          )}

          {/* Actions */}
          <div className="col-span-full flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
            >
              {isEditing ? "💾 Save Changes" : "➕ Submit Item"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={resetForm}
              className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* ===================== Items table ===================== */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
  <h3 className="font-semibold">Items</h3>

  {/* 👇 Either: hide until hydrated */}
  {/* {hydrated && (
    <span className="text-sm text-gray-500">Hot: {hotCount}</span>
  )} */}

  {}
  <span
    className="text-sm text-gray-500"
    suppressHydrationWarning
  >
    Hot: {hydrated ? hotCount : "—"}
  </span>
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

            <tbody>
              {!hydrated ? (
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
                  <tr
                    key={i.id}
                    className="border-t cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => setSelectedItem(i)}
                  >
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
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleHot(i.id);
                          }}
                          className="bg-red-600 text-black text-xs font-semibold px-4 py-1.5 rounded-md shadow-md hover:bg-red-700 transition"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleHot(i.id);
                          }}
                          className="bg-rose-500 text-black text-xs font-semibold px-4 py-1.5 rounded-md shadow-md hover:bg-rose-600 transition"
                        >
                          HOT 🔥
                        </button>
                      )}
                    </td>

                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(i);
                          }}
                          className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-md shadow-md hover:bg-blue-700 transition"

                        >
                          Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(i.id);
                          }}
                          className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-md shadow-md hover:bg-blue-700 transition"

                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== Slide-over details ===================== */}
      <ItemDetailsSheet
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
