"use client"; // If we plan for future interactions like editing/deleting items

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, ShoppingBasket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Dummy data for pantry items - replace with API data later
const today = new Date();
const getDummyDate = (daysOffset: number) => new Date(today.getTime() + daysOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const dummyPantryItems = [
  { id: "1", name: "Tomatoes", quantity: "5 units", expiryDate: getDummyDate(3), category: "Vegetables", imageUrl: "/placeholders/tomatoes.jpg" },
  { id: "2", name: "Chicken Breast", quantity: "900 g", expiryDate: getDummyDate(1), category: "Meat", imageUrl: "/placeholders/chicken.jpg" }, // lbs to g
  { id: "3", name: "Pasta", quantity: "500 g", expiryDate: getDummyDate(365), category: "Grains", imageUrl: "/placeholders/pasta.jpg" }, // box to g
  { id: "4", name: "Olive Oil", quantity: "500 ml", category: "Oils & Fats", imageUrl: "/placeholders/olive-oil.jpg" }, // removed "bottle"
  { id: "5", name: "Onions", quantity: "3 units", expiryDate: getDummyDate(10), category: "Vegetables", imageUrl: "/placeholders/onions.jpg" },
  { id: "6", name: "Garlic", quantity: "1 unit", expiryDate: getDummyDate(30), category: "Vegetables", imageUrl: "/placeholders/garlic.jpg" }, // head to unit
  { id: "7", name: "Milk", quantity: "3.8 L", expiryDate: getDummyDate(-2), category: "Dairy", imageUrl: "/placeholders/milk.jpg" }, // Gallon to L
];

const getDaysUntilExpiry = (expiryDate?: string): number | null => {
  if (!expiryDate) return null;
  const diffTime = new Date(expiryDate).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function PantryPage() {
  const sortedPantryItems = [...dummyPantryItems].sort((a, b) => {
    const aDays = getDaysUntilExpiry(a.expiryDate);
    const bDays = getDaysUntilExpiry(b.expiryDate);
    if (aDays === null && bDays === null) return 0; // Both no expiry
    if (aDays === null) return 1; // a has no expiry, b does, so b comes first
    if (bDays === null) return -1; // b has no expiry, a does, so a comes first
    return aDays - bDays; // Sort by days until expiry, ascending
  });

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">My Pantry</h1>
        <Button asChild>
          <Link href="/capture">
            <Camera size={18} className="mr-2" />
            Capture Ingredients
          </Link>
        </Button>
      </div>

      {sortedPantryItems.length === 0 ? (
        <Card>
          <div className="p-6 text-center text-muted-foreground">
            Your pantry is empty. Add some ingredients to get started!
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {sortedPantryItems.map((item) => {
            return (
              <Card key={item.id} className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
                <div className="relative w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700">
                  {item.imageUrl ? (
                    <Image 
                      src={item.imageUrl} 
                      alt={item.name} 
                      layout="fill" 
                      objectFit="cover" 
                      className="rounded-t-xl"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ShoppingBasket size={48} className="text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-0.5">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.quantity}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 