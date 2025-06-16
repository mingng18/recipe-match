"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Cabinet from "@/images/cabinet.png";
import Fridge from "@/images/fridge.png";
import IngredientItem from "./IngredientItem";

import { animate, motion, useMotionValue, type PanInfo } from "framer-motion";
import usePantryStore from "@/store/pantry-store";
import type { PantryItem } from "@/type/PantryItem";

export const OBJECT_WIDTH = 64;
export const OBJECT_HEIGHT = 64;
const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 50;

const SpringAnimation = {
  type: "spring",
  stiffness: 200,
  damping: 20,
} as const;

const MoreSpringAnimation = {
  type: "spring",
  stiffness: 100,
  damping: 10,
} as const;

// Dynamic spring animation based on velocity
const getDynamicSpringAnimation = (velocity: number) => {
  const absVelocity = Math.abs(velocity);

  // Map velocity to spring parameters
  // Higher velocity = lower damping (more bounce), higher stiffness (faster)
  // Lower velocity = higher damping (less bounce), lower stiffness (slower)
  const minVelocity = 0;
  const maxVelocity = 2000; // Typical max drag velocity

  // Normalize velocity between 0 and 1
  const normalizedVelocity = Math.min(absVelocity / maxVelocity, 1);

  // Calculate dynamic parameters
  const stiffness = 80 + normalizedVelocity * 120; // 80-200 range
  const damping = 25 - normalizedVelocity * 15; // 25-10 range (higher velocity = lower damping)

  return {
    type: "spring" as const,
    stiffness,
    damping,
  };
};

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

type ViewType = "fridge" | "cabinet";

export default function PantryWrapper() {
  const { fridgeItems, cabinetItems, initializeSync } = usePantryStore();
  const [currentView, setCurrentView] = useState<ViewType>("fridge");
  const fridgeAreaRef = useRef<HTMLDivElement>(null);
  const cabinetAreaRef = useRef<HTMLDivElement>(null);

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
  const [isBouncing, setIsBouncing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const x = useMotionValue(0);
  const containerX = useMotionValue(
    currentView === "fridge" ? 0 : -window.innerWidth,
  );
  const scaleXMotion = useMotionValue(1);
  const scaleYMotion = useMotionValue(1);

  // Tab indicator motion values
  const tabIndicatorX = useMotionValue(0);
  const tabIndicatorScaleX = useMotionValue(1);
  const tabIndicatorTranslateX = useMotionValue(0);
  const tabIndicatorOrigin = useMotionValue("center");

  // Initialize motion values based on screen width
  useEffect(() => {
    if (typeof window !== "undefined") {
      containerX.set(currentView === "fridge" ? 0 : -window.innerWidth);
    }
  }, [currentView, containerX]);

  const handleHorizontalDragStart = () => {
    setIsDragging(true);
    setDragDirection(null);
    setDragProgress(0);
  };

  const handleHorizontalDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (isTransitioning) return; // Don't allow dragging during transition

    const { offset, point } = info;
    
    // Update drag position for indicator
    setDragPosition({ x: point.x, y: point.y });
    const absOffset = Math.abs(offset.x);

    // Determine drag direction
    if (Math.abs(offset.x) > 10) {
      setDragDirection(offset.x < 0 ? "left" : "right");
    }

    // Update tab indicator position based on drag
    // Calculate the movement ratio (how much to move the indicator)
    const maxIndicatorMovement = 40; // Maximum pixels the indicator can move
    const movementRatio = Math.min(absOffset / SWIPE_THRESHOLD, 1);
    const indicatorMovement = movementRatio * maxIndicatorMovement;

    // Move indicator in the direction of the swipe
    if (offset.x < 0) {
      // Swiping left - move indicator left
      tabIndicatorX.set(-indicatorMovement);
    } else if (offset.x > 0) {
      // Swiping right - move indicator right
      tabIndicatorX.set(indicatorMovement);
    }

    // Check if we've passed the threshold for view switching
    const passedThreshold = absOffset > SWIPE_THRESHOLD;

    if (passedThreshold) {
      // Stop squishing and start sliding
      setDragProgress(1); // Cap the squish at threshold

      // Calculate slide offset beyond threshold
      const slideOffset =
        offset.x - (offset.x > 0 ? SWIPE_THRESHOLD : -SWIPE_THRESHOLD);
      const baseOffset = currentView === "fridge" ? 0 : -window.innerWidth;
      containerX.set(baseOffset + slideOffset);
    } else {
      // Continue squishing before threshold
      const progress = absOffset / SWIPE_THRESHOLD;
      setDragProgress(progress);

      // Reset container position
      const baseOffset = currentView === "fridge" ? 0 : -window.innerWidth;
      containerX.set(baseOffset);
    }
  };

  const handleHorizontalDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent | undefined,
    info: PanInfo,
  ) => {
    event?.preventDefault();
    const { offset, velocity } = info;

    // Reset drag indicators
    setIsDragging(false);
    setDragDirection(null);
    setDragProgress(0);

    // Get dynamic spring animation based on velocity
    const dynamicSpring = getDynamicSpringAnimation(velocity.x);

    // Determine if we should switch views
    const shouldSwitch =
      Math.abs(offset.x) > SWIPE_THRESHOLD &&
      Math.abs(velocity.x) > VELOCITY_THRESHOLD;

    if (shouldSwitch) {
      setIsTransitioning(true);

      const direction = offset.x < 0 ? "left" : "right";
      const impactIntensity = Math.min(Math.abs(velocity.x) / 1000, 1);

      if (currentView === "fridge" && offset.x < 0) {
        // Swipe left from fridge to cabinet - use dynamic spring
        setCurrentView("cabinet");
        animate(containerX, -window.innerWidth, dynamicSpring);

        // Animate tab indicator to its maximum left position first, then to center
        animate(tabIndicatorX, -40, { duration: 0.15 }).then(() => {
          // When indicator hits the left side, create directional impact effect
          tabIndicatorOrigin.set("left");
          animate(tabIndicatorScaleX, 1 + impactIntensity * 0.15, {
            duration: 0.08,
          });
          animate(tabIndicatorTranslateX, -2 * impactIntensity, {
            duration: 0.08,
          });

          setTimeout(() => {
            animate(tabIndicatorScaleX, 1, {
              duration: 0.2,
              type: "spring",
              stiffness: 400,
              damping: 25,
            });
            animate(tabIndicatorTranslateX, 0, {
              duration: 0.2,
              type: "spring",
              stiffness: 400,
              damping: 25,
            });
            animate(tabIndicatorX, 0, dynamicSpring);
            tabIndicatorOrigin.set("center");
          }, 80);
        });
      } else if (currentView === "cabinet" && offset.x > 0) {
        // Swipe right from cabinet to fridge - use dynamic spring
        setCurrentView("fridge");
        animate(containerX, 0, dynamicSpring);

        // Animate tab indicator to its maximum right position first, then to center
        animate(tabIndicatorX, 40, { duration: 0.15 }).then(() => {
          // When indicator hits the right side, create directional impact effect
          tabIndicatorOrigin.set("right");
          animate(tabIndicatorScaleX, 1 + impactIntensity * 0.15, {
            duration: 0.08,
          });
          animate(tabIndicatorTranslateX, 2 * impactIntensity, {
            duration: 0.08,
          });

          setTimeout(() => {
            animate(tabIndicatorScaleX, 1, {
              duration: 0.2,
              type: "spring",
              stiffness: 400,
              damping: 25,
            });
            animate(tabIndicatorTranslateX, 0, {
              duration: 0.2,
              type: "spring",
              stiffness: 400,
              damping: 25,
            });
            animate(tabIndicatorX, 0, dynamicSpring);
            tabIndicatorOrigin.set("center");
          }, 80);
        });
      }

      // Reset scale with dynamic spring
      animate(scaleXMotion, 1, dynamicSpring);
      animate(scaleYMotion, 1, dynamicSpring);

      // Adjust timeout based on spring dynamics (higher velocity = faster animation)
      const timeoutDuration = Math.max(200, 500 - Math.abs(velocity.x) / 10);
      setTimeout(() => setIsTransitioning(false), timeoutDuration);
    } else {
      // Bounce back with squish effect using dynamic spring
      setIsBouncing(true);

      // Animate container back to original position with velocity-based spring
      const targetX = currentView === "fridge" ? 0 : -window.innerWidth;
      animate(containerX, targetX, dynamicSpring);

      // Animate tab indicator back to center
      animate(tabIndicatorX, 0, dynamicSpring);

      // Create velocity-based squish effect
      const velocityFactor = Math.min(Math.abs(velocity.x) / 1000, 1); // 0-1 based on velocity
      const offsetFactor = Math.abs(offset.x) / 100;

      // Combine velocity and offset for more pronounced squish on faster drags
      const combinedFactor = Math.max(velocityFactor, offsetFactor);
      const bounceScaleX = 1 + combinedFactor * 0.8; // More dramatic squish for high velocity
      const bounceScaleY = 1 - combinedFactor * 0.4;

      // First apply the bounce squish with dynamic timing
      const squishDuration = Math.max(0.1, 0.3 - velocityFactor * 0.2); // Faster squish for high velocity
      animate(scaleXMotion, bounceScaleX, {
        ...dynamicSpring,
        duration: squishDuration,
      });
      animate(scaleYMotion, bounceScaleY, {
        ...dynamicSpring,
        duration: squishDuration,
      });

      // Then return to normal with velocity-adjusted timing
      const returnDelay = Math.max(50, 150 - velocityFactor * 100);
      const returnDuration = Math.max(200, 400 - velocityFactor * 200);

      setTimeout(() => {
        animate(scaleXMotion, 1, dynamicSpring);
        animate(scaleYMotion, 1, dynamicSpring);
        setTimeout(() => setIsBouncing(false), returnDuration);
      }, returnDelay);
    }

    // Always snap back to center with dynamic spring
    animate(x, 0, dynamicSpring);
  };

  // Calculate indicator opacity and scale
  const indicatorOpacity =
    isDragging && dragDirection ? Math.min(dragProgress * 2, 1) : 0;
  const indicatorScale = 0.5 + Math.min(dragProgress, 1) * 0.5;

  // Determine if the swipe direction is valid for current view
  const isValidSwipeDirection = () => {
    if (!dragDirection) return false;
    if (currentView === "fridge" && dragDirection === "left") return true;
    if (currentView === "cabinet" && dragDirection === "right") return true;
    return false;
  };

  // Calculate resistance for invalid swipe directions
  const getSwipeConstraints = () => {
    if (currentView === "cabinet") {
      return { left: -30, right: SWIPE_THRESHOLD + 50 };
    } else {
      return { left: -(SWIPE_THRESHOLD + 50), right: 30 };
    }
  };

  // Get indicator text based on current view and direction
  const getIndicatorText = (dragDirection: "left" | "right" | null) => {
    if (!dragDirection) return "";

    if (currentView === "fridge" && dragDirection === "left") {
      return "Go to Cabinet";
    } else if (currentView === "cabinet" && dragDirection === "right") {
      return "Go to Fridge";
    }
    return "";
  };

  // Get arrow direction
  const getArrowDirection = (dragDirection: "left" | "right" | null) => {
    if (!dragDirection) return "";
    return dragDirection === "left" ? "←" : "→";
  };

  // Handle tab click with animation
  const handleTabClick = (targetView: ViewType) => {
    if (targetView === currentView || isTransitioning) return;

    setIsTransitioning(true);

    const impactIntensity = 0.8; // Constant intensity for clicks

    // Animate to target view
    if (targetView === "cabinet") {
      setCurrentView("cabinet");
      animate(containerX, -window.innerWidth, SpringAnimation);

      // Animate tab indicator to left edge, then create impact
      animate(tabIndicatorX, -40, { duration: 0.15 }).then(() => {
        tabIndicatorOrigin.set("left");
        animate(tabIndicatorScaleX, 1 + impactIntensity * 0.15, {
          duration: 0.08,
        });
        animate(tabIndicatorTranslateX, -2 * impactIntensity, {
          duration: 0.08,
        });

        setTimeout(() => {
          animate(tabIndicatorScaleX, 1, {
            duration: 0.2,
            type: "spring",
            stiffness: 400,
            damping: 25,
          });
          animate(tabIndicatorTranslateX, 0, {
            duration: 0.2,
            type: "spring",
            stiffness: 400,
            damping: 25,
          });
          animate(tabIndicatorX, 0, SpringAnimation);
          tabIndicatorOrigin.set("center");
        }, 80);
      });
    } else {
      setCurrentView("fridge");
      animate(containerX, 0, SpringAnimation);

      // Animate tab indicator to right edge, then create impact
      animate(tabIndicatorX, 40, { duration: 0.15 }).then(() => {
        tabIndicatorOrigin.set("right");
        animate(tabIndicatorScaleX, 1 + impactIntensity * 0.15, {
          duration: 0.08,
        });
        animate(tabIndicatorTranslateX, 2 * impactIntensity, {
          duration: 0.08,
        });

        setTimeout(() => {
          animate(tabIndicatorScaleX, 1, {
            duration: 0.2,
            type: "spring",
            stiffness: 400,
            damping: 25,
          });
          animate(tabIndicatorTranslateX, 0, {
            duration: 0.2,
            type: "spring",
            stiffness: 400,
            damping: 25,
          });
          animate(tabIndicatorX, 0, SpringAnimation);
          tabIndicatorOrigin.set("center");
        }, 80);
      });
    }

    setTimeout(() => setIsTransitioning(false), 400);
  };

  return (
    <div className="relative h-dvh overflow-hidden">
      {/* Drag Indicators */}
      {isDragging && dragDirection && (
        <motion.div
          className="absolute z-20 flex flex-col items-center"
          style={{
            opacity: isValidSwipeDirection()
              ? indicatorOpacity
              : indicatorOpacity * 0.3,
            scale: indicatorScale,
            transform: "translate(-50%, -50%)",
            left: dragPosition.x,
            top: dragPosition.y - 100,
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
              ? getIndicatorText(dragDirection)
              : "Can't go this way"}
          </div>
        </motion.div>
      )}

      {/* View Title Indicator */}
      <motion.div
        className="absolute top-8 left-1/2 z-10 -translate-x-1/2 transform"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-muted text-muted-foreground relative inline-flex h-9 items-center justify-center rounded-lg p-1"
          style={{
            scaleX: tabIndicatorScaleX,
            x: tabIndicatorTranslateX,
            animationDelay: "0.18s",
          }}
        >
          {/* Active indicator background */}
          <motion.div
            className="bg-background absolute inset-[3px] w-20 rounded-md shadow-sm"
            initial={false}
            animate={{
              x: currentView === "fridge" ? "0%" : "100%",
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />

          {/* Tab buttons */}
          <div
            className={`relative z-10 inline-flex h-[calc(100%-1px)] w-20 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              currentView === "fridge"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
            onClick={() => handleTabClick("fridge")}
          >
            Fridge
          </div>
          <div
            className={`relative z-10 inline-flex h-[calc(100%-1px)] w-20 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              currentView === "cabinet"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
            onClick={() => handleTabClick("cabinet")}
          >
            Cabinet
          </div>
        </motion.div>
      </motion.div>

      {/* Container that holds both views side by side */}
      <motion.div
        drag="x"
        dragConstraints={getSwipeConstraints()}
        style={{ x: containerX }}
        onDragStart={handleHorizontalDragStart}
        onDrag={handleHorizontalDrag}
        onDragEnd={handleHorizontalDragEnd}
        className="flex h-full w-[200vw]"
      >
        {/* Fridge View */}
        <motion.div
          ref={fridgeAreaRef}
          className="relative flex h-full w-[100vw] items-center justify-center overflow-hidden p-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Image
            src={Fridge}
            alt="fridge"
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

          {fridgeItems?.map((item: PantryItem) => (
            <IngredientItem
              key={`fridge-${item.id}-${item.x}-${item.y}`}
              item={item}
              dragConstraints={fridgeAreaRef}
              points={points}
            />
          ))}

          {points.map((p, index) => (
            <div
              key={`fridge-point-${index}`}
              className="absolute h-2 w-2 rounded-full bg-red-500"
              style={{
                top: p.y === undefined ? "0" : p.y,
                bottom: p.y === undefined ? "0" : undefined,
                left: p.x === undefined ? "0" : p.x,
                right: p.x === undefined ? "0" : undefined,
                width:
                  p.x === undefined ? undefined : p.y === undefined ? 4 : 8,
                height:
                  p.y === undefined ? undefined : p.x === undefined ? 4 : 8,
              }}
            />
          ))}
        </motion.div>

        {/* Cabinet View */}
        <motion.div
          ref={cabinetAreaRef}
          className="relative flex h-full w-[100vw] items-center justify-center overflow-hidden p-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Image
            src={Cabinet}
            alt="cabinet"
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

          {cabinetItems?.map((item: PantryItem) => (
            <IngredientItem
              key={`cabinet-${item.id}-${item.x}-${item.y}`}
              item={item}
              dragConstraints={cabinetAreaRef}
              points={points}
            />
          ))}

          {points.map((p, index) => (
            <div
              key={`cabinet-point-${index}`}
              className="absolute h-2 w-2 rounded-full bg-red-500"
              style={{
                top: p.y === undefined ? "0" : p.y,
                bottom: p.y === undefined ? "0" : undefined,
                left: p.x === undefined ? "0" : p.x,
                right: p.x === undefined ? "0" : undefined,
                width:
                  p.x === undefined ? undefined : p.y === undefined ? 4 : 8,
                height:
                  p.y === undefined ? undefined : p.x === undefined ? 4 : 8,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
