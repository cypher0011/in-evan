// "use client";
// import { useEffect, useState } from "react";
// import { loadItems, MiniItem, MINIBAR_CHANGED } from "./storage";
// import {
//   Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
// } from "@/components/ui/carousel";

// export default function HotCarousel() {
//   const [items, setItems] = useState<MiniItem[]>([]);

//   useEffect(() => {
//     const refresh = () => setItems(loadItems().filter(i => i.hot));
//     refresh(); // initial
//     window.addEventListener(MINIBAR_CHANGED, refresh);
//     return () => window.removeEventListener(MINIBAR_CHANGED, refresh);
//   }, []);

//   if (items.length === 0) return null;

//   return (
//     <div className="rounded-lg border p-4">
//       <h2 className="text-lg font-semibold mb-3">Hot Items</h2>
//       <Carousel>
//         <CarouselContent>
//           {items.map(it => (
//             <CarouselItem key={it.id} className="basis-auto">
//               <div className="flex items-center gap-4 border rounded p-3">
//                 {it.imageDataUrl
//                   ? <img src={it.imageDataUrl} className="h-16 w-16 rounded object-cover" />
//                   : <div className="h-16 w-16 rounded bg-gray-200" />}
//                 <div>
//                   <div className="font-medium">{it.name}</div>
//                   <div className="text-sm text-gray-500">SAR {it.priceSar.toFixed(2)}</div>
//                 </div>
//               </div>
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//         <CarouselPrevious />
//         <CarouselNext />
//       </Carousel>
//     </div>
//   );
// }
