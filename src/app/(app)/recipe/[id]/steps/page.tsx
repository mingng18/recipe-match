"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { dummyRecipesData, type Recipe, type RecipeStep } from '@/lib/dummy-recipes';
import RecipeStepper from './_components/RecipeStepper';
import RecipeBottomBar from './_components/RecipeBottomBar';
import ConfettiAnimation from './_components/ConfettiAnimation'; // Import Confetti
import Image from 'next/image';

const RecipeStepsPage = () => {
  const params = useParams();
  const router = useRouter();
  const recipeId = typeof params.id === 'string' ? params.id : undefined;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false); // State for confetti

  useEffect(() => {
    if (recipeId) {
      const foundRecipe = dummyRecipesData.find(r => r.id === recipeId);
      setRecipe(foundRecipe || null);
      setCurrentStepIdx(0);
    }
  }, [recipeId]);

  const handlePreviousStep = () => {
    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    if (recipe && currentStepIdx < recipe.instructions.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else if (recipe && currentStepIdx === recipe.instructions.length - 1) {
      // Last step "Finish" action
      setShowConfetti(true);
      // Navigation will be triggered by onConfettiComplete
    }
  };

  const handleConfettiComplete = () => {
    // Navigate after confetti is considered complete
    if(recipeId) {
      router.push(`/recipe/${recipeId}`);
    }
  };

  if (!recipe) {
    return (
      <div className="flex h-screen items-center justify-center p-4 text-center">
        <p className="text-lg text-gray-600">
          {recipeId ? 'Loading recipe steps...' : 'Recipe ID not found in URL.'}
        </p>
      </div>
    );
  }

  if (recipe.instructions.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
         <h1 className="mb-4 text-2xl font-bold text-gray-800">{recipe.title}</h1>
        <p className="text-lg text-gray-600">This recipe has no steps defined.</p>
      </div>
    );
  }

  const currentStepData: RecipeStep | undefined = recipe.instructions[currentStepIdx];

  return (
    // Ensure overall page allows for scrolling if a single step's content is very long
    // The bottom bar will be fixed, so content needs padding at the bottom.
    <div className="flex min-h-screen flex-col items-center p-4 pt-6 md:p-6 md:pt-8 pb-28"> {/* Added pb-28 for bottom bar */}
      <div className="w-full max-w-3xl">
        <h1 className="mb-2 text-center text-2xl font-semibold text-gray-800 md:text-3xl">
          {recipe.title}
        </h1>
        <RecipeStepper currentStep={currentStepIdx} totalSteps={recipe.instructions.length} />
      </div>

      <div className="mt-6 w-full max-w-3xl flex-grow rounded-lg bg-white p-6 shadow-lg md:mt-8 md:p-8">
        {currentStepData ? (
          <>
            <h2 className="mb-4 text-xl font-bold text-primary md:text-2xl">
              Step {currentStepData.stepNumber}:
            </h2>
            {currentStepData.imageUrl && (
              <div className="relative mb-6 h-56 w-full overflow-hidden rounded-md shadow-sm md:h-72">
                <Image
                  src={currentStepData.imageUrl}
                  alt={`Step ${currentStepData.stepNumber}`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>{currentStepData.description}</p>
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-600">Step details not found.</p>
        )}
      </div>

      <RecipeBottomBar
        currentStep={currentStepIdx}
        totalSteps={recipe.instructions.length}
        onPrevious={handlePreviousStep}
        onNext={handleNextStep}
        isLastStep={currentStepIdx === recipe.instructions.length - 1}
      />
      {showConfetti && <ConfettiAnimation isActive={showConfetti} onComplete={handleConfettiComplete} />}
    </div>
  );
};

export default RecipeStepsPage;
