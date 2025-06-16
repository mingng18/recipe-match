"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Cabinet from "@/images/cabinet.png";
import Fridge from "@/images/fridge.png";
import IngredientItem from "./IngredientItem";

import { animate, motion, useMotionValue, type PanInfo } from "framer-motion";
import usePantryStore from "@/store/pantry-store";
import type { PantryItem } from "@/type/PantryItem";
import { useTransitionRouter } from "next-view-transitions";

export const OBJECT_WIDTH = 64;
export const OBJECT_HEIGHT = 64;
const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 50;
const REFRESH_THRESHOLD = 80; // How far user needs to pull down
const INDICATOR_AREA_HEIGHT = 60; // Height of the area where indicator is shown

const SpringAnimation = {
  type: "spring",
  stiffness: 200,
  damping: 20,
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
} as const;

const points: { x?: number; y?: number }[] = [
  { y: 220 },
  { y: 440 },
  { y: 660 },
];

export default function HomeWrapper({ type }: { type: "fridge" | "cabinet" }) {
  const router = useTransitionRouter();
  const { fridgeItems, cabinetItems, initializeSync } = usePantryStore();
  const items = type === "fridge" ? fridgeItems : cabinetItems;
  const fridgeAreaRef = useRef<HTMLDivElement>(null);

  // Initialize database sync on mount
  useEffect(() => {
    initializeSync();
  }, [initializeSync]);

  // Drag indicator state
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [dragProgress, setDragProgress] = useState(0);

  const x = useMotionValue(0); // Correctly initialize x for horizontal drag

  const handleHorizontalDragStart = () => {
    setIsDragging(true);
    setDragDirection(null);
    setDragProgress(0);
  };

  function slideInOut(type: "left" | "right") {
    // Old Page
    document.documentElement.animate(
      [
        { opacity: 1, transform: "translateX(0)" },
        {
          opacity: 1,
          transform: `translateX(${type === "left" ? "-100%" : "100%"})`,
        },
      ],
      {
        duration: 500,
        easing: "cubic-bezier(0,.4,.44,1.56)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      },
    );

    // New Page
    document.documentElement.animate(
      [
        {
          opacity: 1,
          transform: `translateX(${type === "left" ? "100%" : "-100%"})`,
        },
        { opacity: 1, transform: "translateX(0)" },
      ],
      // [
      //   { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
      //   { clipPath: "polygon(0 100%, 100% 100%, 100% 0%, 0 0%)" },
      // ],
      {
        duration: 500,
        easing: "cubic-bezier(0,.4,.44,1.56)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  }

  const handleHorizontalDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const { offset } = info;
    const absOffset = Math.abs(offset.x);

    // Determine drag direction
    if (Math.abs(offset.x) > 10) {
      // Minimum threshold to determine direction
      setDragDirection(offset.x < 0 ? "left" : "right");
    }

    // Calculate progress (0 to 1) based on how close to threshold
    const progress = Math.min(absOffset / SWIPE_THRESHOLD, 1);
    setDragProgress(progress);
  };

  const handleHorizontalDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    event.preventDefault();
    const { offset, velocity } = info;

    // Reset drag indicators
    setIsDragging(false);
    setDragDirection(null);
    setDragProgress(0);

    switch (type) {
      case "fridge":
        if (
          offset.x < -SWIPE_THRESHOLD &&
          Math.abs(velocity.x) > VELOCITY_THRESHOLD
        ) {
          router.push("/cabinet", {
            onTransitionReady: () => slideInOut("left"),
          });
        } else {
          // Snap back
          animate(x, 0, SpringAnimation);
        }
        break;
      case "cabinet":
        if (
          offset.x > SWIPE_THRESHOLD &&
          Math.abs(velocity.x) > VELOCITY_THRESHOLD
        ) {
          // Swipe Right to Pantry
          router.push("/fridge", {
            onTransitionReady: () => slideInOut("right"),
          });
        } else {
          // Snap back
          animate(x, 0, SpringAnimation);
        }
        break;
    }
  };

  // Calculate indicator opacity and scale
  const indicatorOpacity =
    isDragging && dragDirection ? Math.min(dragProgress * 2, 1) : 0;
  const indicatorScale = 0.5 + dragProgress * 0.5; // Scale from 0.5 to 1

  // Calculate the squeezeness for the main image
  // The more it squeeze, the X is longer while Y is shorter
  const scaleX = 1 + dragProgress * 0.3; // Increased from 0.1 to 0.3 for more dramatic effect
  const scaleY = 1 - dragProgress * 0.2; // Increased from 0.1 to 0.2 for more dramatic effect

  // Determine if the swipe direction is valid for current type
  const isValidSwipeDirection = () => {
    if (!dragDirection) return false;
    if (type === "fridge" && dragDirection === "left") return true;
    if (type === "cabinet" && dragDirection === "right") return true;
    return false;
  };

  // Calculate resistance for invalid swipe directions
  const getSwipeConstraints = () => {
    if (type === "cabinet") {
      // In cabinet, only allow right swipe, add resistance to left swipe
      return { left: -30, right: SWIPE_THRESHOLD + 50 }; // Allow right swipe for navigation
    } else {
      // In fridge, only allow left swipe, add resistance to right swipe
      return { left: -(SWIPE_THRESHOLD + 50), right: 30 }; // Allow left swipe for navigation
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={getSwipeConstraints()}
      style={{ x }}
      onDragStart={handleHorizontalDragStart}
      onDrag={handleHorizontalDrag}
      onDragEnd={handleHorizontalDragEnd}
      className="relative h-dvh"
    >
      {/* Drag Indicators */}
      {isDragging && dragDirection && (
        <>
          {/* Left Indicator - shows when swiping left */}
          {dragDirection === "left" && (
            <motion.div
              className="absolute top-1/2 left-8 z-20 flex flex-col items-center"
              style={{
                opacity: isValidSwipeDirection()
                  ? indicatorOpacity
                  : indicatorOpacity * 0.3, // Dimmer for invalid direction
                scale: indicatorScale,
                transform: "translateY(-50%)",
              }}
            >
              <div className="mb-2 text-4xl text-white drop-shadow-lg">
                {getArrowDirection(dragDirection)}
              </div>
              <div
                className={`rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap text-white ${
                  isValidSwipeDirection() ? "bg-green-500/70" : "bg-red-500/70"
                }`}
              >
                {isValidSwipeDirection()
                  ? getIndicatorText(dragDirection, type)
                  : "Can't go this way"}
              </div>
            </motion.div>
          )}

          {/* Right Indicator - shows when swiping right */}
          {dragDirection === "right" && (
            <motion.div
              className="absolute top-1/2 right-8 z-20 flex flex-col items-center"
              style={{
                opacity: isValidSwipeDirection()
                  ? indicatorOpacity
                  : indicatorOpacity * 0.3, // Dimmer for invalid direction
                scale: indicatorScale,
                transform: "translateY(-50%)",
              }}
            >
              <div className="mb-2 text-4xl text-white drop-shadow-lg">
                {getArrowDirection(dragDirection)}
              </div>
              <div
                className={`rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap text-white ${
                  isValidSwipeDirection() ? "bg-green-500/70" : "bg-red-500/70"
                }`}
              >
                {isValidSwipeDirection() &&
                  getIndicatorText(dragDirection, type)}
              </div>
            </motion.div>
          )}
        </>
      )}

      <motion.div
        ref={fridgeAreaRef}
        className="relative flex h-full w-full items-center justify-center overflow-hidden p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          scaleX,
          scaleY,
        }}
      >
        <Image
          src={type === "cabinet" ? Cabinet : Fridge}
          alt={type === "cabinet" ? "cabinet" : "fridge"}
          width={1000}
          height={1000}
          className="mx-auto my-auto object-contain p-4"
          style={{
            alignSelf: "center",
            justifySelf: "center",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          priority
        />

        {items?.map((item: PantryItem) => (
          <IngredientItem
            key={`${item.id}-${item.x}-${item.y}`}
            item={item}
            dragConstraints={fridgeAreaRef}
            points={points}
          />
        ))}
        {points.map((p, index) => (
          <div
            key={index} // Array is static so it's fine to use index as key
            className="absolute h-2 w-2 rounded-full bg-red-500"
            style={{
              top: p.y === undefined ? "0" : p.y,
              bottom: p.y === undefined ? "0" : undefined,
              left: p.x === undefined ? "0" : p.x,
              right: p.x === undefined ? "0" : undefined,
              width: p.x === undefined ? undefined : p.y === undefined ? 4 : 8,
              height: p.y === undefined ? undefined : p.x === undefined ? 4 : 8,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// Get indicator text based on type and direction
const getIndicatorText = (
  dragDirection: "left" | "right" | null,
  type: "fridge" | "cabinet",
) => {
  if (!dragDirection) return "";

  if (type === "fridge" && dragDirection === "left") {
    return "Go to Cabinet";
  } else if (type === "cabinet" && dragDirection === "right") {
    return "Go to Fridge";
  }
  return "";
};

// Get arrow direction
const getArrowDirection = (dragDirection: "left" | "right" | null) => {
  if (!dragDirection) return "";
  return dragDirection === "left" ? "←" : "→";
};
