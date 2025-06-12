"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Added Button
import { Plus, Minus, ChevronRightIcon, ChevronLeftIcon } from "lucide-react"; // Added Icons
import { ShoppingBasket, Archive, BookOpen } from "lucide-react"; // Added BookOpen icon
import type { PantryItem } from "@/app/type/pantry-item";
import { unstable_ViewTransition as ViewTransition } from "react";

export default function IngredientWrapper({
  ingredient,
  currentQuantity,
  quantityUnit,
  recipeCount,
}: {
  ingredient: PantryItem;
  currentQuantity: number;
  quantityUnit: string;
  recipeCount: number;
}) {
  const [portions, setPortions] = useState(currentQuantity);

  const handleDecreaseQuantity = () => {
    setPortions((prev) => Math.max(0, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setPortions((prev) => prev + 1);
  };

  const isPantryItem = "expiryDate" in ingredient;

  return (
    <div className="container mx-auto max-w-lg p-4">
      <Button variant="secondary" size="icon" className="size-8">
        <ChevronLeftIcon />
      </Button>

      <h1 className="mb-4 text-center text-3xl font-bold text-gray-800">
        {ingredient.name}
      </h1>

      <div className="mx-auto mb-6 w-full max-w-sm">
        <ViewTransition name={`ingredient-image-${ingredient.id}`}>
          <Image
            id={`ingredient-image-${ingredient.id}`}
            src={ingredient.imageUrl}
            alt={ingredient.name}
            width={400}
            height={400}
            className="h-full w-full object-cover"
            priority
          />
        </ViewTransition>
      </div>

      {/* Quantity Adjustment UI */}
      <div className="mt-6 flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecreaseQuantity}
          aria-label="Decrease quantity"
        >
          <Minus className="h-5 w-5" />
        </Button>
        <span className="text-xl font-medium text-gray-800 tabular-nums">
          {currentQuantity} {quantityUnit}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncreaseQuantity}
          aria-label="Increase quantity"
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
      <div className="mt-4 border-t pt-2 text-center">
        <p className="text-xs text-gray-500">
          ID: {ingredient.id} <br />
          Type: {isPantryItem ? "Pantry Item" : "Cabinet Item"}
        </p>
      </div>

      {/* Recipe Usage Count */}
      <div className="mt-6 border-t pt-4 text-center">
        <div className="flex items-center justify-center text-gray-700">
          <BookOpen size={20} className="text-primary mr-2" />
          {recipeCount > 0 ? (
            <p>
              Used in: <span className="font-semibold">{recipeCount}</span>
              recipe(s)
            </p>
          ) : (
            <p>Not currently used in your recipes.</p>
          )}
        </div>
      </div>
    </div>
  );
}
