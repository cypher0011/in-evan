"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ItemDetailsSheetProps {
  item: any;
  open: boolean;
  onClose: () => void;
}

export default function ItemDetailsSheet({
  item,
  open,
  onClose,
}: ItemDetailsSheetProps) {
  if (!item) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        // Wider drawer + no horizontal scroll, vertical only
        className="h-screen w-[100vw] sm:w-[90vw] sm:max-w-[720px] md:max-w-[840px] lg:max-w-[980px] xl:max-w-[1120px] bg-white overflow-y-auto overflow-x-hidden p-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold">
                {item.name}
              </SheetTitle>
              <SheetDescription>Mini-bar item details</SheetDescription>
            </SheetHeader>
          </div>

         {/* Image */}
<div className="bg-gray-50 px-6 pt-6 pb-2">
  <div className="mx-auto max-w-2xl flex justify-center">
    {item.imageDataUrl ? (
      <img
        src={item.imageDataUrl}
        alt={item.name}
        className="rounded-lg shadow-md max-h-[340px] w-auto object-contain transition-transform duration-300 hover:scale-[1.03]"
      />
    ) : (
      <div className="w-full h-64 flex items-center justify-center text-gray-400 text-sm">
        No image available
      </div>
    )}
  </div>
</div>

{/* Content */}
<div className="flex-1 overflow-y-auto px-6 pb-10">
  <div className="mx-auto max-w-2xl space-y-6">
    <div className="text-sm space-y-4">
      <p>
        <span className="font-semibold text-gray-800">Price:</span>{" "}
        <span className="text-gray-700">
          SAR {Number(item.priceSar).toFixed(2)}
        </span>
      </p>

      <p className="flex items-center gap-2">
        <span className="font-semibold text-gray-800">Status:</span>
        {item.hot ? (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
            🔥 Hot Item
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
            Normal
          </span>
        )}
      </p>

      {item.description && (
        <div>
          <span className="font-semibold text-gray-800 block mb-1">
            Description:
          </span>
          <p
            className="
              text-gray-700 leading-7
              whitespace-pre-wrap
              [overflow-wrap:anywhere] break-words
            "
          >
            {item.description}
          </p>
        </div>
      )}
    </div>

    <div className="pt-4 flex justify-end">
      <button
        onClick={onClose}
        className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
      >
        Close
      </button>
        </div>
    </div>
    </div>
    </div>
      </SheetContent>
    </Sheet>
  );
}
