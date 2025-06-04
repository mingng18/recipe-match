import { ChefHat } from "lucide-react";
import RecipeStepCards from "../_components/RecipeStepCards";
import React from "react";
import { getRecipeById } from "@/lib/dummy-recipes";

export default function StepsPage({ params }: { params: { id: string } }) {
  const recipe = getRecipeById(params.id);

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <section>
      <h2 className="text-foreground mb-4 flex items-center text-xl font-semibold md:text-2xl">
        <ChefHat className="text-primary mr-2.5 h-5 w-5" /> Preparation Steps
      </h2>
      {/* Assuming RecipeStepCards is correctly imported relative to this new file location */}
      {/* If RecipeStepCards.tsx is in the same _components folder, the import path would be './RecipeStepCards' */}
      {/* If it's one level up (i.e. src/app/(app)/recipes/[id]/RecipeStepCards.tsx), import would be '../RecipeStepCards' */}
      <RecipeStepCards steps={recipe.instructions} />
    </section>
  );
}
