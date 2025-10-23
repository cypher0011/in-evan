export type MiniItem = {
  id: string;
  name: string;
  priceSar: number;
  imageDataUrl?: string;
  hot: boolean;
  createdAt: string;
};

const KEY = "minibar-items";
export const MINIBAR_UPDATE_EVENT = "minibar:items-updated";

export function loadItems(): MiniItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as MiniItem[];
  } catch {
    return [];
  }
}

export function saveItems(items: MiniItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));

  // 🔧 Dispatch AFTER the current render/commit cycle to avoid
  // "Cannot update a component while rendering another component"
  const fire = () => {
    try {
      window.dispatchEvent(new CustomEvent(MINIBAR_UPDATE_EVENT));
    } catch {}
  };
  // Prefer microtask when available; fallback to setTimeout
  if (typeof queueMicrotask === "function") {
    queueMicrotask(fire);
  } else {
    setTimeout(fire, 0);
  }
}
