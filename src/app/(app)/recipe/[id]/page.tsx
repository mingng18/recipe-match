// import React from 'react'; // React import might not be needed for a simple Server Component
import { getRecipeById, type Recipe } from '@/lib/dummy-recipes'; // Keep type Recipe if used for prop typing
import RecipeDetailClient from './_components/RecipeDetailClient'; // Import the new Client Component
import { Button } from '@/components/ui/button'; // For the not found case
import Link from 'next/link'; // For the not found case
import BottomAppBar from './_components/BottomAppBar';

// Optional: Define metadata for the page (Server Component feature)
// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const recipe = getRecipeById(params.id);
//   if (!recipe) {
//     return { title: "Recipe Not Found" };
//   }
//   return { title: recipe.title, description: recipe.description };
// }

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const recipe = getRecipeById(params.id);

  if (!recipe) {
    return (
      <div className="container mx-auto p-4 text-center flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-xl text-muted-foreground">Recipe not found.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/recipes">Back to Recipes</Link>
        </Button>
      </div>
    );
  }

  // The Server Component now just passes data to the Client Component
  return (
    <>
      <RecipeDetailClient recipe={recipe} />
      <BottomAppBar />
    </>
  );
}