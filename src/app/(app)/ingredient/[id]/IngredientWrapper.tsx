"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Minus,
  ChevronRightIcon,
  ChevronLeftIcon,
  Refrigerator,
  Beef,
  BookOpen,
  Clock,
  Users,
  Star,
  Leaf,
  Thermometer,
  ShieldCheck,
  ChefHat,
} from "lucide-react";
import type { PantryItem } from "@/type/PantryItem";
import type { Recipe } from "@/lib/dummy-recipes";
import { dummyRecipesData } from "@/lib/dummy-recipes";
import { unstable_ViewTransition as ViewTransition } from "react";
import usePantryStore from "@/store/pantry-store";
import { notFound, useRouter } from "next/navigation";
import Counter from "@/components/react-bits/Counter";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

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

  // Get related recipes based on ingredient name
  const getRelatedRecipes = () => {
    if (!ingredient) return [];
    const ingredientNameLower = ingredient.name.toLowerCase();
    return dummyRecipesData
      .filter((recipe) =>
        recipe.ingredients.some((recipeIng) =>
          recipeIng.name.toLowerCase().includes(ingredientNameLower),
        ),
      )
      .slice(0, 3); // Limit to 3 related recipes
  };

  const relatedRecipes = getRelatedRecipes();

  const handleCookClick = () => {
    if (relatedRecipes.length > 0) {
      router.push(`/recipe/${relatedRecipes[0]!.id}`);
    } else {
      router.push("/recipes");
    }
  };

  const totalTime = (recipe: Recipe) => {
    let prep = 0;
    let cook = 0;
    if (recipe.prepTime) {
      const prepMatch = recipe.prepTime.match(/(\d+)/);
      if (prepMatch && prepMatch[1]) prep = parseInt(prepMatch[1], 10);
    }
    if (recipe.cookTime) {
      const cookMatch = recipe.cookTime.match(/(\d+)/);
      if (cookMatch && cookMatch[1]) cook = parseInt(cookMatch[1], 10);
    }
    if (prep + cook > 0) {
      return `${prep + cook} min`;
    }
    return null;
  };

  return (
    <>
      <div className="container mx-auto max-w-lg p-4 pb-32">
        <div className="relative mb-4 flex h-8 items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 size-6"
            onClick={() => router.back()}
          >
            <ChevronLeftIcon />
          </Button>
          <h4 className="text-md text-center text-gray-500">Ingredients</h4>
        </div>

        <div
          key={ingredient?.id || id}
          className="mx-auto aspect-[4/3] w-full max-w-sm p-8"
        >
          <ViewTransition name={`ingredient-image-${id}`}>
            {ingredient && (
              <Image
                id={`ingredient-image-${id}`}
                src={ingredient.image_url}
                alt={ingredient.name}
                width={400}
                height={400}
                className="h-full w-full object-contain"
                priority
              />
            )}
          </ViewTransition>
        </div>

        <h1 className="mb-3 text-center text-3xl font-bold text-gray-800">
          {ingredient?.name || "Loading..."}
        </h1>

        <p className="text-md mb-6 text-center text-gray-500">
          The food will be best before{" "}
          {ingredient?.expiry_date?.toLocaleDateString() || "N/A"}
        </p>

        <p className="mb-6 text-center text-sm text-gray-800">
          <Refrigerator className="inline-block size-4 text-gray-500" />{" "}
          {ingredient?.type} |{"  "}
          <Beef className="inline-block size-4 text-gray-500" />{" "}
          {ingredient?.category}
        </p>
        <Separator className="my-6" />

        <p className="text-md font-900 text-center text-gray-800">Quantity</p>
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecreaseQuantity}
            aria-label="Decrease quantity"
            disabled={!ingredient}
          >
            <Minus className="h-5 w-5" />
          </Button>
          <Counter value={portions} places={[10, 1]} padding={24} />
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
        <Separator className="my-6" />

                {/* Related Recipes Section */}
        <section className="mt-8 mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Related Recipes
            </h2>
            {relatedRecipes.length > 3 && (
              <Link
                href="/recipes"
                className="text-primary text-sm font-medium hover:underline"
              >
                View all
              </Link>
            )}
          </div>
          
          {relatedRecipes.length > 0 ? (
            <div className="space-y-3">
              {relatedRecipes.map((recipe) => (
                <Link key={recipe.id} href={`/recipe/${recipe.id}`}>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        {totalTime(recipe) && <span>{totalTime(recipe)}</span>}
                        {recipe.servings && <span>{recipe.servings} servings</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-gray-500">
                No recipes found for this ingredient
              </p>
              <Link href="/recipes">
                <Button variant="outline" size="sm" className="mt-3">
                  Browse all recipes
                </Button>
              </Link>
            </div>
          )}
        </section>

        <Separator className="my-6" />

                <section className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            How to keep fresh
          </h2>
          
          {ingredient?.steps_to_store &&
          ingredient.steps_to_store.length > 0 ? (
            <div className="space-y-3">
              {ingredient.steps_to_store.map((step, index) => (
                <div key={step.id} className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">Store Cool</h4>
                  <p className="text-sm text-gray-600">Keep at proper temperature</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">Stay Fresh</h4>
                  <p className="text-sm text-gray-600">
                    Store in {ingredient?.type === "fridge" ? "refrigerator" : "cabinet"} for best freshness
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        <Separator className="my-6" />

                <section className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Popular with this ingredient
          </h2>
          
          {relatedRecipes.length > 0 ? (
            <div className="space-y-3">
              <Link href={`/recipe/${relatedRecipes[0]!.id}`}>
                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {relatedRecipes[0]!.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {relatedRecipes[0]!.description}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      {totalTime(relatedRecipes[0]!) && <span>{totalTime(relatedRecipes[0]!)}</span>}
                      <span>★ 4.8</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="mb-3 text-sm text-gray-500">
                Discover popular recipes with {ingredient?.name?.toLowerCase()}
              </p>
              <Link href="/recipes">
                <Button variant="outline">Explore recipes</Button>
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* Bottom CTA Bar - Airbnb Style */}
      <div className="fixed right-0 bottom-0 left-0 z-50 p-4">
        <div className="container flex items-center justify-between gap-4 rounded-full border border-gray-200 bg-white p-2 shadow-xl">
          <p className="text-md flex-1 pl-4 font-semibold text-gray-900">
            {relatedRecipes.length > 0
              ? `${relatedRecipes.length} recipe${relatedRecipes.length > 1 ? "s" : ""} available`
              : "Explore recipes"}
          </p>
          <Button
            onClick={handleCookClick}
            className="text-md flex min-w-30 cursor-pointer items-center gap-2 rounded-4xl p-6"
          >
            <ChefHat size={20} />
            Cook
          </Button>
        </div>
      </div>
    </>
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
