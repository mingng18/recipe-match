"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface RecipeBottomBarProps {
  currentStep: number; // 0-indexed
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isLastStep: boolean;
}

const RecipeBottomBar: React.FC<RecipeBottomBarProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isLastStep,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-3 shadow-top backdrop-blur-lg md:p-4">
      <div className="container mx-auto flex max-w-3xl items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="w-1/3 md:w-auto"
        >
          <ChevronLeft size={18} className="mr-1 md:mr-2" />
          Previous
        </Button>

        <div className="text-center text-sm font-medium text-gray-700">
          Step {currentStep + 1} of {totalSteps}
        </div>

        <Button onClick={onNext} className="w-1/3 md:w-auto bg-primary hover:bg-primary/90">
          {isLastStep ? (
            <>
              Finish <CheckCircle size={18} className="ml-1 md:ml-2" />
            </>
          ) : (
            <>
              Next <ChevronRight size={18} className="ml-1 md:ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default RecipeBottomBar;
