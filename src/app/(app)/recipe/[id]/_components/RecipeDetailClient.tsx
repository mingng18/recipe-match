"use client"; // This is now a Client Component

import React from "react";
import { type Recipe } from "@/lib/dummy-recipes"; // Ensure Recipe type is imported
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  ChefHat,
  Clock,
  Users,
  Utensils,
  ExternalLink,
  Heart,
  ArrowLeft,
} from "lucide-react";
import RecipeStepCards from "./RecipeStepCards"; // This should be adjusted if its path relative to _components changes
import BottomAppBar from "./BottomAppBar"; // Import the new BottomAppBar
import { unstable_ViewTransition as ViewTransition } from "react";
import { useRouter } from "next/navigation";

interface RecipeDetailClientProps {
  recipe: Recipe;
}

export default function RecipeDetailClient({
  recipe,
}: RecipeDetailClientProps) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = React.useState(false);

  // All the JSX from the original return statement of page.tsx will go here
  // with `recipe` prop used directly
  return (
    <div className="bg-background pb-16">
      {/* Increased padding-bottom to accommodate the app bar */}
      <div className="relative h-72 w-full md:h-96">
        <ViewTransition name={`recipe-image-${recipe.id}`}>
          {recipe.imageUrl && (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              layout="fill"
              objectFit="cover"
              className="brightness-90"
              style={{ viewTransitionName: `recipe-image-${recipe.id}` }}
            />
          )}
        </ViewTransition>

        <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-4">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={() => router.back()}
          >
            <ArrowLeft size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={() => setIsFavorited(!isFavorited)}
            aria-label={
              isFavorited ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              size={24}
              className={
                isFavorited ? "fill-red-500 text-red-500" : "text-white"
              }
            />
          </Button>
        </div>
      </div>
      <div className="bg-background relative z-20 container mx-auto mt-[-40px] space-y-6 rounded-t-2xl p-4 shadow-2xl md:rounded-t-3xl md:p-6">
        <div className="pt-4">
          <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            {recipe.title}
          </h1>
          <p className="text-md text-muted-foreground mt-1.5 md:text-lg">
            {recipe.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {recipe.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="capitalize">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-center sm:grid-cols-4">
          {recipe.prepTime && (
            <div className="flex flex-col items-center">
              <Clock size={22} className="text-primary mb-1.5" />
              <p className="text-foreground text-sm font-semibold">Prep Time</p>
              <p className="text-muted-foreground text-xs">{recipe.prepTime}</p>
            </div>
          )}
          {recipe.cookTime && (
            <div className="flex flex-col items-center">
              <Utensils size={22} className="text-primary mb-1.5" />
              <p className="text-foreground text-sm font-semibold">Cook Time</p>
              <p className="text-muted-foreground text-xs">{recipe.cookTime}</p>
            </div>
          )}
          {recipe.servings && (
            <div className="flex flex-col items-center">
              <Users size={22} className="text-primary mb-1.5" />
              <p className="text-foreground text-sm font-semibold">Servings</p>
              <p className="text-muted-foreground text-xs">
                {recipe.servings} servings
              </p>
            </div>
          )}
          {recipe.calories && (
            <div className="flex flex-col items-center">
              <ChefHat size={22} className="text-primary mb-1.5" />
              <p className="text-foreground text-sm font-semibold">Calories</p>
              <p className="text-muted-foreground text-xs">
                ~{recipe.calories} kcal
              </p>
            </div>
          )}
        </div>

        <Separator />

        <section>
          <h2 className="text-foreground mb-3 flex items-center text-xl font-semibold md:text-2xl">
            <Utensils className="text-primary mr-2.5 h-5 w-5" /> Ingredients
          </h2>
          <ul className="text-muted-foreground list-disc space-y-2 pl-6">
            {recipe.ingredients.map((ing, index) => (
              <li key={index} className="pl-1">
                <span className="text-foreground font-medium">
                  {ing.quantity}
                </span>{" "}
                {ing.name}
                {ing.notes && (
                  <span className="text-xs italic"> ({ing.notes})</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <Separator />
      </div>
    </div>
  );
}
