// import FavouriteIcon from "./_components/FavouriteIcon"; // No longer directly used here
// import SearchInput from "./_components/Search"; // No longer directly used here
// import RecipeCard from "./_components/RecipeCard"; // No longer directly used here
import RecipeGridClient from "./_components/RecipeGridClient"; // Import the new client component
import { dummyRecipesData } from "@/lib/dummy-recipes";

export default function RecipesPage() { // Renamed from DashboardPage for clarity
  // This page is now a Server Component. 
  // It fetches or imports data and passes it to Client Components.
  const recipes = dummyRecipesData; // In a real app, this might be an async fetch

  return (
    <div className="container mx-auto p-0 md:p-0"> {/* Adjusted padding, client comp will handle its own as needed */}
      <RecipeGridClient allRecipes={recipes} />
      {/* The TODO for other sections can be managed within RecipeGridClient or here if they are server-rendered sections */}
    </div>
  );
}
