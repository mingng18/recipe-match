"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Added Button
import { Plus, Minus, ChevronRightIcon, ChevronLeftIcon } from "lucide-react"; // Added Icons
import { ShoppingBasket, Archive, BookOpen } from "lucide-react"; // Added BookOpen icon
import type { PantryItem } from "@/type/PantryItem";
import { unstable_ViewTransition as ViewTransition } from "react";
import usePantryStore from "@/store/pantry-store";
import { notFound, useRouter } from "next/navigation";

export default function IngredientWrapper({ id }: { id: number }) {
  const { pantryItems, initializeSync } = usePantryStore();
  const router = useRouter();

  // Initialize database sync on mount
  useEffect(() => {
    initializeSync();
  }, [initializeSync]);

  const ingredient = pantryItems?.find((item: PantryItem) => item.id === id);
  const quantity = parseQuantity(ingredient?.quantity ?? "");

  const [portions, setPortions] = useState(quantity.number);

  const handleDecreaseQuantity = () => {
    setPortions((prev) => Math.max(0, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setPortions((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto max-w-lg p-4">
      <Button
        variant="secondary"
        size="icon"
        className="size-8"
        onClick={() => router.back()}
      >
        <ChevronLeftIcon />
      </Button>

      <h1 className="mb-4 text-center text-3xl font-bold text-gray-800">
        {ingredient?.name || "Loading..."}
      </h1>

      <div key={ingredient?.id || id} className="mx-auto mb-6 w-full max-w-sm">
        <ViewTransition name={`ingredient-image-${id}`}>
          {ingredient && (
            <Image
              id={`ingredient-image-${id}`}
              src={ingredient.imageUrl}
              alt={ingredient.name}
              width={400}
              height={400}
              className="h-full w-full object-cover"
              priority
            />
          )}
        </ViewTransition>
      </div>

      {/* Quantity Adjustment UI */}
      <div className="mt-6 flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecreaseQuantity}
          aria-label="Decrease quantity"
          disabled={!ingredient}
        >
          <Minus className="h-5 w-5" />
        </Button>
        <span className="text-xl font-medium text-gray-800 tabular-nums">
          {quantity.number} {quantity.unit}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncreaseQuantity}
          aria-label="Increase quantity"
          disabled={!ingredient}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Original quantity display - can be removed or kept for reference */}
      {/* <div className="mt-4 space-y-1 text-center border-t pt-4">
          <p className="text-sm text-gray-600">
            (Original: {ingredient.quantity})
          </p>
        </div> */}

      {/* Example of displaying type, can be expanded */}
      {ingredient && (
        <div className="mt-4 border-t pt-2 text-center">
          <p className="text-xs text-gray-500">
            ID: {ingredient.id} <br />
            Type: {ingredient.type}
          </p>
        </div>
      )}

      {/* Recipe Usage Count */}
      <div className="mt-6 border-t pt-4 text-center">
        <div className="flex items-center justify-center text-gray-700">
          <BookOpen size={20} className="text-primary mr-2" />
          {/* {recipeCount > 0 ? (
            <p>
              Used in: <span className="font-semibold">{recipeCount}</span>
              recipe(s)
            </p>
          ) : (
            <p>Not currently used in your recipes.</p>
          )} */}
        </div>
      </div>
    </div>
  );
}

const parseQuantity = (
  quantityStr: string,
): { number: number; unit: string } => {
  const match = quantityStr.match(/^(\d*\.?\d+)\s*(.*)$/);
  if (match) {
    return { number: parseFloat(match[1]!), unit: match[2]!.trim() };
  }
  // Fallback if no number found, or if it's just a description like "1 box"
  // For "1 box", parseInt would be 1. parseFloat also 1.
  // If quantityStr is "box", parseFloat will be NaN.
  const num = parseFloat(quantityStr);
  if (!isNaN(num)) {
    return { number: num, unit: quantityStr.replace(String(num), "").trim() };
  }
  return { number: 1, unit: quantityStr }; // Default to 1 if parsing fails badly
};
