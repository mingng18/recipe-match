import type { Recipe } from "@/lib/dummy-recipes";
import RecipeCard from "./RecipeCard";

interface RecipeGridClientProps {
  filteredRecipes: Recipe[];
}

export default function RecipeGridClient({
  filteredRecipes,
}: RecipeGridClientProps) {
  return (
    <>
      {filteredRecipes.length > 0 ? (
        <div className="container mx-auto grid grid-cols-1 gap-x-4 gap-y-8 px-4 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="container mx-auto flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            No Recipes Found
          </h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </>
  );
}
