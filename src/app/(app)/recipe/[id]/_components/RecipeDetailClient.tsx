"use client"; // This is now a Client Component

import React from 'react';
import { type Recipe } from '@/lib/dummy-recipes'; // Ensure Recipe type is imported
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ChefHat, Clock, Users, Utensils, ExternalLink, Heart, ArrowLeft } from 'lucide-react';
import RecipeStepCards from './RecipeStepCards'; // This should be adjusted if its path relative to _components changes

interface RecipeDetailClientProps {
  recipe: Recipe;
}

export default function RecipeDetailClient({ recipe }: RecipeDetailClientProps) {
  const [isFavorited, setIsFavorited] = React.useState(false);

  // All the JSX from the original return statement of page.tsx will go here
  // with `recipe` prop used directly
  return (
    <div className="pb-12 bg-background">
      <div className="relative w-full h-72 md:h-96">
        {recipe.imageUrl && (
          <Image 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            layout="fill" 
            objectFit="cover" 
            className="brightness-90"
          />
        )}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <Button asChild variant="ghost" size="icon" className="bg-black/30 hover:bg-black/50 text-white rounded-full">
            <Link href="/dashboard">
              <ArrowLeft size={24} />
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-black/30 hover:bg-black/50 text-white rounded-full"
            onClick={() => setIsFavorited(!isFavorited)}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={24} className={isFavorited ? "fill-red-500 text-red-500" : "text-white"} />
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6 space-y-6 mt-[-40px] relative z-20 bg-background rounded-t-2xl md:rounded-t-3xl shadow-2xl">
        <div className="pt-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{recipe.title}</h1>
            <p className="text-md md:text-lg text-muted-foreground mt-1.5">
                {recipe.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
                {recipe.tags?.map(tag => <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>)}
            </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 text-center">
          {recipe.prepTime && (
            <div className="flex flex-col items-center">
              <Clock size={22} className="text-primary mb-1.5" />
              <p className="text-sm font-semibold text-foreground">Prep Time</p>
              <p className="text-xs text-muted-foreground">{recipe.prepTime}</p>
            </div>
          )}
          {recipe.cookTime && (
            <div className="flex flex-col items-center">
              <Utensils size={22} className="text-primary mb-1.5" />
              <p className="text-sm font-semibold text-foreground">Cook Time</p>
              <p className="text-xs text-muted-foreground">{recipe.cookTime}</p>
            </div>
          )}
          {recipe.servings && (
            <div className="flex flex-col items-center">
              <Users size={22} className="text-primary mb-1.5" />
              <p className="text-sm font-semibold text-foreground">Servings</p>
              <p className="text-xs text-muted-foreground">{recipe.servings} servings</p>
            </div>
          )}
          {recipe.calories && (
              <div className="flex flex-col items-center">
                  <ChefHat size={22} className="text-primary mb-1.5" />
                  <p className="text-sm font-semibold text-foreground">Calories</p>
                  <p className="text-xs text-muted-foreground">~{recipe.calories} kcal</p>
              </div>
          )}
        </div>

        <Separator />

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-3 flex items-center text-foreground">
            <Utensils className="mr-2.5 h-5 w-5 text-primary" /> Ingredients
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            {recipe.ingredients.map((ing, index) => (
              <li key={index} className="pl-1">
                <span className="font-medium text-foreground">{ing.quantity}</span> {ing.name}
                {ing.notes && <span className="text-xs italic"> ({ing.notes})</span>}
              </li>
            ))}
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center text-foreground">
            <ChefHat className="mr-2.5 h-5 w-5 text-primary" /> Preparation Steps
          </h2>
          {/* Assuming RecipeStepCards is correctly imported relative to this new file location */}
          {/* If RecipeStepCards.tsx is in the same _components folder, the import path would be './RecipeStepCards' */}
          {/* If it's one level up (i.e. src/app/(app)/recipes/[id]/RecipeStepCards.tsx), import would be '../RecipeStepCards' */}
          <RecipeStepCards steps={recipe.instructions} />
        </section>

        {recipe.sourceUrl && (
          <>
            <Separator />
            <div className="pt-4 text-center">
              <Button asChild variant="link" className="text-sm text-primary hover:text-primary/80">
                <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                  View Original Recipe Source <ExternalLink size={14} className="ml-1.5" />
                </a>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 