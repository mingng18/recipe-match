"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { CookingPot } from 'lucide-react'; // Or any other relevant icon
import { useRouter, useParams } from 'next/navigation'; // To handle navigation

export default function BottomAppBar() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params.id;

  const handleStartCooking = () => {
    if (recipeId) {
      router.push(`/recipe/${recipeId}/steps`);
    } else {
      // Handle cases where recipeId might not be available, though unlikely in this context
      console.error("Recipe ID not found, cannot navigate to steps.");
      // Optionally, redirect to a fallback or show an error
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 bg-background border-t border-border shadow-lg p-3 z-50">
      <div className="container mx-auto flex items-center justify-center">
        <Button 
          size="lg" 
          className="w-full max-w-md"
          onClick={handleStartCooking}
        >
          <CookingPot className="mr-2 h-5 w-5" />
          Start Cooking
        </Button>
      </div>
    </div>
  );
} 