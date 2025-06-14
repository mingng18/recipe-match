"use client";

import React from 'react';
import { cn } from '@/lib/utils'; // For conditional class names

interface RecipeStepperProps {
  currentStep: number; // 0-indexed
  totalSteps: number;
}

const RecipeStepper: React.FC<RecipeStepperProps> = ({ currentStep, totalSteps }) => {
  if (totalSteps <= 0) return null;

  return (
    <div className="flex items-center justify-center p-4 w-full">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold",
                currentStep === index
                  ? "border-primary bg-primary text-primary-foreground scale-110"
                  : currentStep > index
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-gray-300 bg-gray-100 text-gray-500",
                "transition-all duration-300 ease-in-out"
              )}
            >
              {index + 1}
            </div>
            {/* Optional: Add step titles below dots later if needed */}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={cn(
                "h-1 w-8 flex-1 rounded-full", // Adjusted width to be more flexible
                currentStep > index ? "bg-primary" : "bg-gray-300",
                "transition-colors duration-300 ease-in-out mx-1" // Added margin for spacing
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default RecipeStepper;
