"use client";

import React, { useState } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import type { RecipeStep } from "@/lib/dummy-recipes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import Image from "next/image";

interface RecipeStepCardsProps {
  steps: RecipeStep[];
  onComplete?: () => void; // Optional callback for when all steps are swiped
}

// These two are just helpers, they curate spring data, values that are later interpolated into css
const to = (i: number) => ({
  x: 0,
  y: i * -4, // Stack cards slightly offset vertically
  scale: 1,
  rot: -5 + Math.random() * 10, // Random initial rotation
  delay: i * 100,
});

const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(0deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

export default function RecipeStepCards({
  steps,
  onComplete,
}: RecipeStepCardsProps) {
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [currentIndex, setCurrentIndex] = useState(steps.length - 1);

  const [props, api] = useSprings(steps.length, (i) => ({
    ...to(i),
    from: from(i),
  })); // Create a bunch of springs using the helpers above

  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
    ({
      args: [index],
      active,
      movement: [mx],
      direction: [xDir],
      velocity: [vx],
    }) => {
      const trigger = vx > 0.2; // If you flick hard enough it should trigger the card to fly out
      if (!active && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out

      api.start((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * xDir : active ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = mx / 100 + (isGone ? xDir * 10 * vx : 0); // How much the card tilts, flicking it harder makes it rotate more
        const scale = active ? 1.1 : 1; // Active cards lift up a bit

        if (isGone) {
          setCurrentIndex((prev) => Math.max(0, prev - 1));
          if (gone.size === steps.length && onComplete) {
            onComplete();
          }
        }

        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
        };
      });

      if (!active && gone.size === steps.length && onComplete) {
        // This might be redundant if the check inside api.start is sufficient
        // onComplete();
      }
    },
  );

  const handleNext = () => {
    if (currentIndex < 0) return; // Should not happen if reset works
    const currentCardIndexInProps = steps.length - 1 - currentIndex;
    gone.add(currentCardIndexInProps);
    api.start((i) => {
      if (i === currentCardIndexInProps) {
        if (gone.size === steps.length && onComplete) {
          onComplete();
        }
        setCurrentIndex((prev) => Math.max(0, prev - 1));
        return {
          x: 200 + window.innerWidth,
          rot: 30,
          scale: 1,
          config: { friction: 50, tension: 200 },
        };
      }
    });
  };

  const handlePrev = () => {
    // This is more complex as we need to bring a card back.
    // For simplicity, this demo usually focuses on forward movement or reset.
    // Implementing a true "previous" that re-inserts a card nicely would require reversing the "gone" logic for that card.
    // For now, let's just log or do nothing.
    console.log(
      "Previous button clicked - not fully implemented for bringing cards back yet",
    );
    // Or, we can reset to the specific previous card if it's not too complex:
    if (currentIndex < steps.length - 1) {
      const nextCardOriginalIndex = steps.length - 1 - (currentIndex + 1);
      if (gone.has(nextCardOriginalIndex)) {
        gone.delete(nextCardOriginalIndex);
        setCurrentIndex((prev) => prev + 1);
        api.start((i) => {
          if (i === nextCardOriginalIndex) return to(i); // Reset to its initial state
        });
      }
    }
  };

  const handleReset = () => {
    gone.clear();
    setCurrentIndex(steps.length - 1);
    api.start((i) => to(i));
  };

  return (
    <div className="relative flex w-full flex-col items-center select-none">
      {" "}
      {/* Added select-none */}
      <div className="relative flex h-96 w-full max-w-xs items-center justify-center md:h-[450px] md:max-w-md">
        {" "}
        {/* Deck container */}
        {props.map(({ x, y, rot, scale }, i) => (
          <animated.div
            className="absolute h-full w-full touch-none" // touch-none for useDrag
            key={steps[i]?.stepNumber}
            style={{ x, y }}
            {...bind(i)} // Bind gesture to the card index (original index)
          >
            <animated.div
              style={{
                transform: interpolate([rot, scale], trans),
              }}
              className="h-full w-full p-1"
            >
              <Card className="bg-card text-card-foreground flex h-full w-full flex-col overflow-hidden rounded-xl shadow-xl">
                {steps[i]?.imageUrl && (
                  <div className="bg-muted relative h-1/3 w-full md:h-2/5">
                    {/* Placeholder for step image - replace with actual Image component if needed */}
                    <Image
                      src={steps[i]?.imageUrl}
                      alt={`Step ${steps[i]?.stepNumber}`}
                      fill
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader
                  className={`pb-2 ${steps[i]?.imageUrl ? "pt-3" : "pt-6"}`}
                >
                  {" "}
                  {/* Adjust padding based on image */}
                  <CardTitle className="text-lg md:text-xl">
                    Step {steps[i]?.stepNumber}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto p-4 pt-0">
                  <CardDescription className="text-sm whitespace-pre-line md:text-base">
                    {steps[i]?.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </animated.div>
          </animated.div>
        ))}
      </div>
      {gone.size === steps.length ? (
        <div className="mt-6 text-center">
          <p className="mb-2 text-xl font-semibold">Recipe Steps Completed!</p>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Steps
          </Button>
        </div>
      ) : (
        <div className="mt-6 flex items-center space-x-4">
          <Button
            onClick={handlePrev}
            variant="outline"
            size="icon"
            aria-label="Previous Step"
            disabled={currentIndex >= steps.length - 1 && !gone.has(0)}
          >
            <ArrowLeft />
          </Button>
          <span className="text-muted-foreground text-sm">
            {steps.length - gone.size} / {steps.length} Steps Left
          </span>
          <Button
            onClick={handleNext}
            variant="outline"
            size="icon"
            aria-label="Next Step"
          >
            <ArrowRight />
          </Button>
        </div>
      )}
    </div>
  );
}
