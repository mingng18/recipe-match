"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Clock } from "lucide-react";
import type { Recipe } from "@/lib/dummy-recipes";
import { useFavorites } from "@/hooks/useFavorites";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isCurrentlyFavorite = isFavorite(recipe.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  const totalTime = () => {
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
    <Card className="group relative w-full overflow-hidden rounded-xl border-0 shadow-md transition-all duration-300 ease-in-out hover:shadow-xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="transform object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="bg-muted flex h-full items-center justify-center">
            <Clock size={48} className="text-muted-foreground" />
          </div>
        )}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 z-10 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${isCurrentlyFavorite ? "text-red-500" : "text-white"}`}
          aria-label={isCurrentlyFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={20} className={`${isCurrentlyFavorite ? "fill-red-500" : "fill-transparent"} stroke-white stroke-[2.5px]`} />
        </button>
      </div>
      <CardContent className="space-y-1 p-3">
        <Link href={`/recipe/${recipe.id}`} className="block">
          <h3 className="truncate text-base font-semibold text-gray-800 hover:text-primary group-hover:underline">
            {recipe.title}
          </h3>
        </Link>
        {totalTime() && (
          <div className="flex items-center text-xs text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>{totalTime()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
