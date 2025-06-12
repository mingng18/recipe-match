"use client"; // Required for Framer Motion hooks and event handlers

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, animate, type PanInfo } from "framer-motion";
import { dummyRecipesData } from "@/lib/dummy-recipes";
import type { Recipe, RecipeIngredient, RecipeStep } from "@/lib/dummy-recipes";
import { Clock, Users, ListChecks, ChefHat, ChevronDown } from "lucide-react";

const formatTime = (time?: string): string | null => {
  if (!time) return null;
  const match = time.match(/(\d+)\s*(\w+)/);
  if (match && match[1] && match[2]) return `${match[1]} ${match[2]}`;
  return time;
};

const PlateOfTheDayPage = () => {
  const router = useRouter();
  const recipe: Recipe | undefined = dummyRecipesData[0];

  const y = useMotionValue(0);
  const [dragThreshold, setDragThreshold] = useState(300); // Default, will update on mount

  useEffect(() => {
    setDragThreshold(window.innerHeight / 2.5); // Adjust threshold based on window height
    // Prevent body scroll when dragging the component
    const unsubscribe = y.on("change", (latest) => {
      if (latest < 0) {
        // only prevent scroll if dragging down to reveal, not scrolling within content
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });
    return () => {
      document.body.style.overflow = ""; // Ensure body scroll is re-enabled on unmount
      unsubscribe();
    };
  }, [y]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    document.body.style.overflow = ""; // Re-enable body scroll after drag
    if (info.offset.y > dragThreshold && info.velocity.y > 20) {
      // Check offset and velocity
      router.push("/recipes");
    } else {
      animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  if (!recipe) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8 text-center">
        <h1 className="mb-6 text-3xl font-bold">Plate of the Day</h1>
        <p>Sorry, no recipe available for today!</p>
      </div>
    );
  }

  const prepTime = formatTime(recipe.prepTime);
  const cookTime = formatTime(recipe.cookTime);

  // Opacity for the "Scroll for more" text based on drag
  const textOpacity = useMotionValue(1);
  useEffect(() => {
    const unsubscribe = y.on("change", (latest) => {
      const newOpacity = Math.max(
        0,
        1 - Math.abs(latest) / (dragThreshold / 2),
      );
      textOpacity.set(newOpacity);
    });
    return unsubscribe;
  }, [y, dragThreshold, textOpacity]);

  return (
    // The outer div needs to allow the motion.div to be dragged "out of it"
    // so we make it full height and overflow hidden if needed (though drag should handle it)
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50">
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: dragThreshold * 2 }} // Allow ample drag down
        style={{ y }}
        onDragEnd={handleDragEnd}
        className="relative z-10 container mx-auto max-w-3xl cursor-grab px-0 active:cursor-grabbing sm:px-2"
      >
        {/* This div is to make sure the actual content doesn't get transparent bg */}
        <div className="bg-gray-50 py-8">
          <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-gray-800">
            Plate of the Day
          </h1>

          <article className="overflow-hidden rounded-lg bg-white shadow-lg">
            {recipe.imageUrl && (
              <div className="relative h-64 w-full select-none md:h-80 lg:h-96">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  fill
                  className="pointer-events-none object-cover" // Prevent image drag interference
                  priority
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              <h2 className="mb-3 text-3xl font-semibold text-gray-900">
                {recipe.title}
              </h2>
              <p className="mb-6 text-base text-gray-600">
                {recipe.description}
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
                {recipe.servings && (
                  <div className="flex items-center">
                    <Users size={18} className="text-primary mr-2" />
                    <strong>Serves:</strong>&nbsp;{recipe.servings}
                  </div>
                )}
              </div>

              <section className="mb-6">
                <h3 className="mb-3 flex items-center text-xl font-semibold text-gray-800">
                  <ListChecks size={22} className="text-primary mr-2" />{" "}
                  Ingredients
                </h3>
                <ul className="list-disc space-y-1 pl-6 text-gray-700">
                  {recipe.ingredients.map(
                    (ingredient: RecipeIngredient, index: number) => (
                      <li key={index}>
                        {ingredient.quantity} {ingredient.name}
                        {ingredient.notes && (
                          <span className="text-xs text-gray-500">
                            {" "}
                            ({ingredient.notes})
                          </span>
                        )}
                      </li>
                    ),
                  )}
                </ul>
              </section>

              <section>
                <h3 className="mb-3 flex items-center text-xl font-semibold text-gray-800">
                  <ChefHat size={22} className="text-primary mr-2" />{" "}
                  Instructions
                </h3>
                <ol className="list-decimal space-y-3 pl-6 text-gray-700">
                  {recipe.instructions.map((step: RecipeStep) => (
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

              {recipe.sourceUrl && (
                <p className="mt-8 text-xs text-gray-500">
                  Original recipe from:{" "}
                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {recipe.sourceUrl}
                  </a>
                </p>
              )}
            </div>
          </article>

          {/* Hint for scrolling */}
          <motion.div
            className="my-8 flex flex-col items-center justify-center text-center text-gray-500"
            style={{ opacity: textOpacity }}
          >
            <ChevronDown size={24} className="animate-bounce" />
            <p className="text-sm">Pull down for more recipes</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlateOfTheDayPage;
