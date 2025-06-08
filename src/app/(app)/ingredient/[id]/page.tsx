"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // Added Button
import { Plus, Minus } from 'lucide-react'; // Added Icons
import { dummyPantryItems, type PantryItem } from '@/app/(app)/(top-level)/pantry/dummy-data';
import { dummyCabinetItems, type CabinetItem } from '@/app/(app)/(top-level)/cabinet/dummy-data';
import { dummyRecipesData, type Recipe } from '@/lib/dummy-recipes'; // Added Recipe Data import
import { ShoppingBasket, Archive, BookOpen } from 'lucide-react'; // Added BookOpen icon

type DisplayableIngredient = PantryItem | CabinetItem;

// Helper to parse quantity string
const parseQuantity = (quantityStr: string): { number: number; unit: string } => {
  const match = quantityStr.match(/^(\d*\.?\d+)\s*(.*)$/);
  if (match) {
    return { number: parseFloat(match[1]), unit: match[2].trim() };
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


const IngredientDetailPage = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : undefined;

  const [ingredient, setIngredient] = useState<DisplayableIngredient | null | undefined>(undefined);
  const [currentQuantity, setCurrentQuantity] = useState<number>(0);
  const [quantityUnit, setQuantityUnit] = useState<string>("");
  const [recipeCount, setRecipeCount] = useState<number>(0); // State for recipe count

  useEffect(() => {
    if (id) {
      let foundItem: DisplayableIngredient | undefined;

      foundItem = dummyPantryItems.find(item => item.id === id);
      if (foundItem) {
        setIngredient(foundItem);
        const pq = parseQuantity(foundItem.quantity);
        setCurrentQuantity(pq.number);
        setQuantityUnit(pq.unit);
        return;
      }

      foundItem = dummyCabinetItems.find(item => item.id === id);
      if (foundItem) {
        setIngredient(foundItem);
        const pq = parseQuantity(foundItem.quantity);
        setCurrentQuantity(pq.number);
        setQuantityUnit(pq.unit);
        return;
      }

      setIngredient(null); // Not found in either list
    }
  }, [id]);

  // useEffect to calculate recipe usage count
  useEffect(() => {
    if (ingredient && ingredient.name) {
      const ingredientNameLower = ingredient.name.toLowerCase();
      const count = dummyRecipesData.reduce((acc, recipe) => {
        const foundInRecipe = recipe.ingredients.some(
          (recipeIng) => recipeIng.name.toLowerCase().includes(ingredientNameLower)
        );
        return foundInRecipe ? acc + 1 : acc;
      }, 0);
      setRecipeCount(count);
    } else {
      setRecipeCount(0);
    }
  }, [ingredient]); // Dependency: ingredient object

  const handleDecreaseQuantity = () => {
    setCurrentQuantity(prev => Math.max(0, prev - 1)); // Prevent going below 0
  };

  const handleIncreaseQuantity = () => {
    setCurrentQuantity(prev => prev + 1);
  };

  if (ingredient === undefined) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading ingredient details...</p>
      </div>
    );
  }

  if (ingredient === null) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Ingredient Not Found</h1>
        <p>Sorry, we couldn't find an ingredient with ID: {id}</p>
      </div>
    );
  }

  const isPantryItem = 'expiryDate' in ingredient;

  return (
    <div className="container mx-auto max-w-lg p-4">
      <div className="rounded-lg bg-white p-6 shadow-xl">
        <h1 className="mb-4 text-center text-3xl font-bold text-gray-800">
          {ingredient.name}
        </h1>

        <div className="mb-6 aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-lg shadow-md">
          {ingredient.imageUrl ? (
            <Image
              id={`ingredient-image-${ingredient.id}`}
              src={ingredient.imageUrl}
              alt={ingredient.name}
              width={400}
              height={400}
              className="object-cover w-full h-full"
              priority
              style={{ viewTransitionName: `ingredient-image-${id}` }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              {isPantryItem ? <ShoppingBasket size={80} className="text-gray-400" /> : <Archive size={80} className="text-gray-400" />}
            </div>
          )}
        </div>

        {/* Quantity Adjustment UI */}
        <div className="mt-6 flex items-center justify-center space-x-4">
          <Button variant="outline" size="icon" onClick={handleDecreaseQuantity} aria-label="Decrease quantity">
            <Minus className="h-5 w-5" />
          </Button>
          <span className="text-xl font-medium text-gray-800 tabular-nums">
            {currentQuantity} {quantityUnit}
          </span>
          <Button variant="outline" size="icon" onClick={handleIncreaseQuantity} aria-label="Increase quantity">
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
                ID: {id} <br />
                Type: {isPantryItem ? 'Pantry Item' : 'Cabinet Item'}
            </p>
         </div>

        {/* Recipe Usage Count */}
        <div className="mt-6 border-t pt-4 text-center">
          <div className="flex items-center justify-center text-gray-700">
            <BookOpen size={20} className="mr-2 text-primary" />
            {recipeCount > 0 ? (
              <p>Used in: <span className="font-semibold">{recipeCount}</span> recipe(s)</p>
            ) : (
              <p>Not currently used in your recipes.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default IngredientDetailPage;
