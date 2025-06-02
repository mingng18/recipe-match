// Recipe List Screen
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image"; // For placeholder images
import { dummyRecipesData } from "@/lib/dummy-recipes"; // Import new dummy data source
import { ChefHat, BookOpen } from "lucide-react"; // Added icons

export default function RecipeListPage() {
  const recipes = dummyRecipesData; // Use the new dummy data

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
          <BookOpen size={28} className="mr-3 text-primary" /> Available Recipes
        </h1>
        {/* TODO: Add filter button/options later */}
      </div>

      {recipes.length === 0 ? (
        <Card className="text-center p-6">
            <p className="text-muted-foreground">
                No recipes found for your current ingredients. Try adding more ingredients or browse all available recipes!
            </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                {recipe.imageUrl ? (
                    <div className="relative h-48 w-full bg-muted">
                        <Image 
                            src={recipe.imageUrl} 
                            alt={recipe.title} 
                            layout="fill" 
                            objectFit="cover" 
                        />
                    </div>
                ) : (
                    <div className="relative h-48 w-full bg-muted flex items-center justify-center">
                        <ChefHat size={48} className="text-muted-foreground/50" />
                    </div>
                )}
              <CardHeader className="pt-4 pb-2">
                <CardTitle className="text-lg font-semibold leading-tight hover:text-primary transition-colors">
                    <Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                </CardTitle>
                {recipe.description && (
                    <CardDescription className="text-xs mt-1 line-clamp-2">
                        {recipe.description}
                    </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-grow pt-1 pb-3">
                {recipe.calories && (
                    <p className="text-muted-foreground text-xs">
                        Calories: ~{recipe.calories} kcal
                    </p>
                )}
                {/* We can add more info like prep time or tags here if desired */}
              </CardContent>
              <CardFooter className="pt-0 pb-4">
                <Button asChild className="w-full" size="sm">
                  <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
