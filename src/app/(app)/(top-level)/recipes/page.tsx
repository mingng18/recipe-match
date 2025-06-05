import RecipeGridClient from "./_components/RecipeGridClient";
import RecipeOfTheDay from "./_components/RecipeOfTheDay";
import SearchBar from "./_components/SearchBar";
import CategoryTabs from "./_components/CategoryTabs";
import { dummyRecipesData } from "@/lib/dummy-recipes";
import { Category } from "@/lib/constants";
import RandomRecipeFab from "./_components/RandomRecipeFab";

export default async function RecipesPage(props: {
  searchParams: Promise<{
    search: string;
    category: string;
  }>;
}) {
  const { search, category } = await props.searchParams;
  const recipes = dummyRecipesData;

  const currentSearch = search || "";
  const currentCategory = category || Category.ALL;

  // Filter recipes based on category and search
  // const filteredRecipes = recipes.filter((recipe) => {
  //   const matchesCategory =
  //     currentCategory === Category.ALL ||
  //     recipe.tags?.includes(currentCategory);
  //   const matchesSearch =
  //     !search ||
  //     [recipe.title, recipe.description, ...(recipe.tags || [])].some((text) =>
  //       text.toLowerCase().includes(currentSearch.toLowerCase()),
  //     );

  //   return matchesCategory && matchesSearch;
  // });

  return (
    <div className="container mx-auto p-0 md:p-0">
      <div className="space-y-6">
        <div className="bg-background/95 sticky top-0 z-20 pt-4 backdrop-blur-lg md:px-0">
          <SearchBar />
          <CategoryTabs />
        </div>
        <RecipeOfTheDay recipe={recipes[0]!} />
        <RecipeGridClient filteredRecipes={recipes.slice(1)} />
      </div>
      <RandomRecipeFab />
    </div>
  );
}
