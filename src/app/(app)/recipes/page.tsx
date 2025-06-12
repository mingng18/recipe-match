"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, animate, type PanInfo } from "framer-motion";
import { dummyRecipesData } from "@/lib/dummy-recipes"; // Assuming full Recipe types needed
import { Clock, Users, ListChecks, ChefHat, ChevronDown } from "lucide-react";

import RecipeGridClient from "./_components/RecipeGridClient";
import SearchBar from "./_components/SearchBar";
import Image from "next/image";
import CategoryTabs from "./_components/CategoryTabs";
import RandomRecipeFab from "./_components/RandomRecipeFab";

// Helper function from PlateOfTheDayPage
const formatTime = (time?: string): string | null => {
  if (!time) return null;
  const match = time.match(/(\d+)\s*(\w+)/);
  if (match && match[1] && match[2]) return `${match[1]} ${match[2]}`;
  return time;
};

// Props might change as it's a client component now, searchParams can be read by useSearchParams hook
// For now, let's assume searchParams are not immediately used or will be refactored.
export default function RecipesPage() {
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const singleRecipe = dummyRecipesData[0]; // Plate of the day recipe

  const y = useMotionValue(0);
  const [dragThreshold, setDragThreshold] = useState(300);
  const textOpacity = useMotionValue(1);

  useEffect(() => {
    setDragThreshold(window.innerHeight / 2.5);
    const unsubscribeYChanges = y.on("change", (latest) => {
      if (!showAllRecipes && latest < 0) {
        // Only prevent body scroll if showing single recipe and dragging it
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      const newOpacity = Math.max(
        0,
        1 - Math.abs(latest) / (dragThreshold / 2),
      );
      textOpacity.set(newOpacity);
    });
    return () => {
      document.body.style.overflow = "";
      unsubscribeYChanges();
    };
  }, [y, dragThreshold, showAllRecipes, textOpacity]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    document.body.style.overflow = ""; // Always re-enable body scroll after drag
    if (info.offset.y > dragThreshold && info.velocity.y > 20) {
      setShowAllRecipes(true);
      // Optionally, animate y to 0 or a specific position before showing all
      animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
    } else {
      animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  // Prepare data for RecipeGridClient - all recipes except the first one if it's shown as "Recipe of the Day"
  // Or all recipes if the singleRecipe view is not meant to be exclusive.
  // For this logic, if showAllRecipes is true, we show all.
  const gridRecipes = dummyRecipesData; // Show all recipes in the grid for now. Can be .slice(1) if needed.

  if (!singleRecipe) {
    // Should always be there with dummy data
    return <p>Loading recipes...</p>;
  }

  const prepTime = formatTime(singleRecipe.prepTime);
  const cookTime = formatTime(singleRecipe.cookTime);

  return (
    <div className="container mx-auto p-0 md:p-0">
      {/* Main container */}
      <div className="bg-background/95 sticky top-0 z-20 pt-4 backdrop-blur-lg md:px-0">
        <SearchBar />
        <CategoryTabs />
      </div>
      {!showAllRecipes && (
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: dragThreshold * 2 }}
          style={{ y }}
          onDragEnd={handleDragEnd}
          // This motion.div wraps the single recipe view
          className="relative z-10 min-h-[calc(100vh-100px)] cursor-grab bg-gray-50 active:cursor-grabbing" // Ensure it has background & takes height
        >
          <div className="container mx-auto max-w-3xl px-0 py-8 sm:px-2">
            {" "}
            {/* Inner container for content styling */}
            <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-gray-800">
              Recipe of the Day
            </h1>
            <article className="overflow-hidden rounded-lg bg-white shadow-lg">
              {singleRecipe.imageUrl && (
                <div className="relative h-64 w-full select-none md:h-80 lg:h-96">
                  <Image
                    src={singleRecipe.imageUrl}
                    alt={singleRecipe.title}
                    fill
                    className="pointer-events-none object-cover"
                    priority
                    style={{
                      viewTransitionName: `recipe-image-${singleRecipe.id}`,
                    }}
                  />
                </div>
              )}
              <div className="p-6 md:p-8">
                <h2 className="mb-3 text-3xl font-semibold text-gray-900">
                  {singleRecipe.title}
                </h2>
                <p className="mb-6 text-base text-gray-600">
                  {singleRecipe.description}
                </p>
                <div className="mb-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 sm:grid-cols-3">
                  {prepTime && (
                    <div className="flex items-center">
                      <Clock size={18} className="text-primary mr-2" />
                      <strong>Prep:</strong>&nbsp;{prepTime}
                    </div>
                  )}
                  {cookTime && (
                    <div className="flex items-center">
                      <ChefHat size={18} className="text-primary mr-2" />
                      <strong>Cook:</strong>&nbsp;{cookTime}
                    </div>
                  )}
                  {singleRecipe.servings && (
                    <div className="flex items-center">
                      <Users size={18} className="text-primary mr-2" />
                      <strong>Serves:</strong>&nbsp;{singleRecipe.servings}
                    </div>
                  )}
                </div>
                <section className="mb-6">
                  <h3 className="mb-3 flex items-center text-xl font-semibold text-gray-800">
                    <ListChecks size={22} className="text-primary mr-2" />
                    Ingredients
                  </h3>
                  <ul className="list-disc space-y-1 pl-6 text-gray-700">
                    {singleRecipe.ingredients.map((ing, idx) => (
                      <li key={idx}>
                        {ing.quantity} {ing.name}
                        {ing.notes && (
                          <span className="text-xs text-gray-500">
                            {" "}
                            ({ing.notes})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="mb-3 flex items-center text-xl font-semibold text-gray-800">
                    <ChefHat size={22} className="text-primary mr-2" />
                    Instructions
                  </h3>
                  <ol className="list-decimal space-y-3 pl-6 text-gray-700">
                    {singleRecipe.instructions.map((step) => (
                      <li key={step.stepNumber} className="leading-relaxed">
                        {step.description}
                        {step.imageUrl && (
                          <div className="mt-2 overflow-hidden rounded-md">
                            <Image
                              src={step.imageUrl}
                              alt={`Step ${step.stepNumber}`}
                              width={400}
                              height={250}
                              className="pointer-events-none object-cover"
                            />
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                </section>
                {singleRecipe.sourceUrl && (
                  <p className="mt-8 text-xs text-gray-500">
                    Original recipe from:{" "}
                    <a
                      href={singleRecipe.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {singleRecipe.sourceUrl}
                    </a>
                  </p>
                )}
              </div>
            </article>
            <motion.div
              className="my-8 flex flex-col items-center justify-center text-center text-gray-500"
              style={{ opacity: textOpacity }}
            >
              <ChevronDown size={24} className="animate-bounce" />
              <p className="text-sm">Pull down for all recipes</p>
            </motion.div>
          </div>
        </motion.div>
      )}
      {showAllRecipes && (
        <div className="mt-8">
          {" "}
          {/* Add margin if needed when grid shows */}
          <RecipeGridClient filteredRecipes={gridRecipes} />
        </div>
      )}
      <RandomRecipeFab />
    </div>
  );
}
