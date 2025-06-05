import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { dummyPantryItems, type PantryItem } from "./dummy-data";
import FridgeWrapper from "./FridgeWrapper";

const getDaysUntilExpiry = (expiryDate?: string): number | null => {
  if (!expiryDate) return null;
  const diffTime = new Date(expiryDate).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function PantryPage() {
  const sortedPantryItems: PantryItem[] = dummyPantryItems.toSorted((a, b) => {
    const aDays = getDaysUntilExpiry(a.expiryDate);
    const bDays = getDaysUntilExpiry(b.expiryDate);
    if (aDays === null && bDays === null) return 0; // Both no expiry
    if (aDays === null) return 1; // a has no expiry, b does, so b comes first
    if (bDays === null) return -1; // b has no expiry, a does, so a comes first
    return aDays - bDays; // Sort by days until expiry, ascending
  });

  return (
    <FridgeWrapper data={sortedPantryItems} />
    // <div className="container mx-auto space-y-6 p-4 pb-24 md:p-6">
    //   <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
    //     <h1 className="text-2xl font-bold text-gray-800 md:text-3xl dark:text-white">
    //       My Pantry
    //     </h1>
    //     <Button asChild>
    //       <Link href="/capture">
    //         <Camera size={18} className="mr-2" />
    //         Capture Ingredients
    //       </Link>
    //     </Button>
    //   </div>

    //   {sortedPantryItems.length === 0 ? (
    //     <Card>
    //       <div className="text-muted-foreground p-6 text-center">
    //         Your pantry is empty. Add some ingredients to get started!
    //       </div>
    //     </Card>
    //   ) : (
    //     <div className="grid grid-cols-2 gap-4 md:gap-6">
    //       {sortedPantryItems.map((item) => {
    //         return (
    //           <Card
    //             key={item.id}
    //             className="overflow-hidden rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800"
    //           >
    //             <div className="relative aspect-[4/3] w-full bg-gray-200 dark:bg-gray-700">
    //               {item.imageUrl ? (
    //                 <Image
    //                   src={item.imageUrl}
    //                   alt={item.name}
    //                   layout="fill"
    //                   objectFit="cover"
    //                   className="rounded-t-xl outline-img"
    //                 />
    //               ) : (
    //                 <div className="flex h-full items-center justify-center">
    //                   <ShoppingBasket
    //                     size={48}
    //                     className="text-gray-400 dark:text-gray-500"
    //                   />
    //                 </div>
    //               )}
    //             </div>
    //             <div className="p-4">
    //               <h3 className="mb-0.5 text-lg font-semibold text-gray-900 dark:text-white">
    //                 {item.name}
    //               </h3>
    //               <p className="text-sm text-gray-600 dark:text-gray-300">
    //                 {item.quantity}
    //               </p>
    //             </div>
    //           </Card>
    //         );
    //       })}
    //     </div>
    //   )}
    // </div>
  );
}
