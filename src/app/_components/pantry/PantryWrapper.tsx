"use client";

import {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
import Image from "next/image";
import Cabinet from "@/images/cabinet.png";
import Fridge from "@/images/fridge.png";
import IngredientItem from "./IngredientItem";

import { animate, motion, useMotionValue, type PanInfo } from "framer-motion";
import usePantryStore from "@/store/pantry-store";
import type { PantryItem } from "@/type/PantryItem";
import PantryTab from "./PantryTab";
import DragIndicators from "./DragIndicators";
import Points from "./DebugPoints";

export const OBJECT_WIDTH = 64;
export const OBJECT_HEIGHT = 64;
const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 50;

const SpringAnimation = {
  type: "spring",
  stiffness: 200,
  damping: 20,
} as const;

type SpringConfig = {
  type: "spring";
  stiffness: number;
  damping: number;
};

const DEBUG_POINTS = false;
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

// Configuration for shelf positions (easily adjustable)
const SHELF_CONFIG = {
  fridge: {
    // Relative positions from top of container (0-1 range)
    // Adjust these values to match the fridge image shelves
    shelfPositions: [0.18, 0.34, 0.5, 0.66], // 4 shelves
    // Horizontal bounds (relative to container width)
    leftBound: 0.2, // 15% from left edge
    rightBound: 0.8, // 85% from left edge (15% from right)
    // Vertical padding from container edges
    topPadding: 0.1, // 10% from top
    bottomPadding: 0.1, // 10% from bottom
  },
  cabinet: {
    // Relative positions from top of container (0-1 range)
    // Adjust these values to match the cabinet image shelves
    shelfPositions: [0.14, 0.31, 0.45, 0.59, 0.73], // 5 shelves
    // Horizontal bounds (relative to container width)
    leftBound: 0.2, // 12% from left edge
    rightBound: 0.8, // 88% from left edge (12% from right)
    // Vertical padding from container edges
    topPadding: 0.12, // 12% from top
    bottomPadding: 0.12, // 12% from bottom
  },
} as const;

const calculateShelfPoints = (
  containerHeight: number,
  storageType: "fridge" | "cabinet",
): { x?: number; y?: number }[] => {
  const config = SHELF_CONFIG[storageType];

  // Calculate usable area (excluding padding)
  const usableHeight =
    containerHeight * (1 - config.topPadding - config.bottomPadding);
  const topOffset = containerHeight * config.topPadding;

  // Generate shelf points
  // Add horizontal shelf lines (y-coordinates only)
  // These create the main shelf levels where items can be placed
  const points: { x?: number; y?: number }[] = config.shelfPositions.map(
    (relativeY) => {
      const actualY = topOffset + usableHeight * relativeY;
      return { y: actualY };
    },
  );

  return points;
};

type ViewType = "fridge" | "cabinet";

export default function PantryWrapper() {
  const { fridgeItems, cabinetItems, initializeSync, seedWithDummyData } =
    usePantryStore();
  const [currentView, setCurrentView] = useState<ViewType>("fridge");
  const fridgeAreaRef = useRef<HTMLDivElement>(null);
  const cabinetAreaRef = useRef<HTMLDivElement>(null);

  // State for dynamic points
  const [fridgePoints, setFridgePoints] = useState<
    { x?: number; y?: number }[]
  >([]);
  const [cabinetPoints, setCabinetPoints] = useState<
    { x?: number; y?: number }[]
  >([]);

  // useEffect(() => {
  //   seedWithDummyData();
  // }, []);

  // Track window width to avoid SSR issues
  const [windowWidth, setWindowWidth] = useState(0);

  const x = useMotionValue(0);
  const containerX = useMotionValue(0); // Initialize to 0, will be set correctly after mount
  const scaleXMotion = useMotionValue(1);
  const scaleYMotion = useMotionValue(1);

  // Tab indicator motion values
  const tabIndicatorX = useMotionValue(0);
  const tabIndicatorScaleX = useMotionValue(1);
  const tabIndicatorTranslateX = useMotionValue(0);

  // Initialize component and database sync on mount
  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      handleResize();
      containerX.set(currentView === "fridge" ? 0 : -window.innerWidth);

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [containerX, currentView]);

  useEffect(() => {
    initializeSync();
  }, [initializeSync]);

  // Calculate points when component mounts or window resizes
  useLayoutEffect(() => {
    const updatePoints = () => {
      if (fridgeAreaRef.current && cabinetAreaRef.current) {
        const fridgeRect = fridgeAreaRef.current.getBoundingClientRect();
        const cabinetRect = cabinetAreaRef.current.getBoundingClientRect();

        const newFridgePoints = calculateShelfPoints(
          fridgeRect.height,
          "fridge",
        );
        const newCabinetPoints = calculateShelfPoints(
          cabinetRect.height,
          "cabinet",
        );

        setFridgePoints(newFridgePoints);
        setCabinetPoints(newCabinetPoints);
      }
    };

    // Initial calculation
    updatePoints();
  }, [windowWidth]); // Depend on windowWidth instead of manual resize listener

  // Drag indicator state
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [dragProgress, setDragProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const handleHorizontalDragStart = useCallback(() => {
    setIsDragging(true);
    setDragDirection(null);
    setDragProgress(0);
  }, []);

  const handleHorizontalDrag = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      event?.preventDefault();
      event?.stopPropagation();

      const { point } = info;

      // Update drag position for indicator
      setDragPosition({ x: point.x, y: point.y });
    },
    [setDragPosition],
  );

  const swipeTabs = useCallback(
    (
      targetView: "fridge" | "cabinet",
      impactIntensity: number,
      springAnimation: SpringConfig | typeof SpringAnimation = SpringAnimation,
    ) => {
      setCurrentView(targetView);

      // Animate container to correct position
      animate(
        containerX,
        targetView === "fridge" ? 0 : -windowWidth,
        springAnimation,
      );

      // Animate tab indicator to edge, then create impact
      const indicatorDirection = targetView === "fridge" ? 40 : -40;
      const translateDirection = targetView === "fridge" ? 2 : -2;

      animate(tabIndicatorX, indicatorDirection, { duration: 0.15 }).then(
        () => {
          animate(tabIndicatorScaleX, 1 + impactIntensity * 0.15, {
            duration: 0.08,
          });
          animate(
            tabIndicatorTranslateX,
            translateDirection * impactIntensity,
            {
              duration: 0.08,
            },
          );

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
            animate(tabIndicatorX, 0, springAnimation);
          }, 80);
        },
      );
    },
    [
      setCurrentView,
      containerX,
      windowWidth,
      tabIndicatorX,
      tabIndicatorScaleX,
      tabIndicatorTranslateX,
    ],
  );

  const handleHorizontalDragEnd = useCallback(
    (
      event: MouseEvent | TouchEvent | PointerEvent | undefined,
      info: PanInfo,
    ) => {
      event?.preventDefault();
      event?.stopPropagation();

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

        const impactIntensity = Math.min(Math.abs(velocity.x) / 1000, 1);

        if (currentView === "fridge" && offset.x < 0) {
          // Swipe left from fridge to cabinet - use dynamic spring
          swipeTabs("cabinet", impactIntensity, dynamicSpring);
        } else if (currentView === "cabinet" && offset.x > 0) {
          // Swipe right from cabinet to fridge - use dynamic spring
          swipeTabs("fridge", impactIntensity, dynamicSpring);
        }

        // Reset scale with dynamic spring
        animate(scaleXMotion, 1, dynamicSpring);
        animate(scaleYMotion, 1, dynamicSpring);

        // Adjust timeout based on spring dynamics (higher velocity = faster animation)
        const timeoutDuration = Math.max(200, 500 - Math.abs(velocity.x) / 10);
        setTimeout(() => setIsTransitioning(false), timeoutDuration);
      } else {
        // Bounce back with squish effect using dynamic spring
        // setIsBouncing(true);

        // Animate container back to original position with velocity-based spring
        const targetX = currentView === "fridge" ? 0 : -windowWidth;
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
        // const returnDuration = Math.max(200, 400 - velocityFactor * 200);

        setTimeout(() => {
          animate(scaleXMotion, 1, dynamicSpring);
          animate(scaleYMotion, 1, dynamicSpring);
          // setTimeout(() => setIsBouncing(false), returnDuration);
        }, returnDelay);
      }

      // Always snap back to center with dynamic spring
      animate(x, 0, dynamicSpring);
    },
    [
      containerX,
      currentView,
      scaleXMotion,
      scaleYMotion,
      swipeTabs,
      tabIndicatorX,
      windowWidth,
      x,
    ],
  );

  // Handle tab click with animation
  const handleTabClick = useCallback(
    (targetView: ViewType) => {
      if (targetView === currentView || isTransitioning) return;
      const impactIntensity = 0.8;

      setIsTransitioning(true);
      swipeTabs(targetView, impactIntensity);
      setTimeout(() => setIsTransitioning(false), 400);
    },
    [currentView, isTransitioning, swipeTabs],
  );

  return (
    <div className="relative h-dvh overflow-hidden">
      {/* Drag Indicators */}
      {isDragging && dragDirection && (
        <DragIndicators
          currentView={currentView}
          dragDirection={dragDirection}
          dragPosition={dragPosition}
          isDragging={isDragging}
          dragProgress={dragProgress}
        />
      )}

      {/* View Title Indicator */}
      <PantryTab
        currentView={currentView}
        handleTabClick={handleTabClick}
        tabIndicatorScaleX={tabIndicatorScaleX}
        tabIndicatorTranslateX={tabIndicatorTranslateX}
      />

      {/* Container that holds both views side by side */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -windowWidth, right: 0 }}
        dragElastic={0.1}
        onDragStart={handleHorizontalDragStart}
        onDrag={handleHorizontalDrag}
        onDragEnd={handleHorizontalDragEnd}
        className="flex h-full"
        style={{ x: containerX, width: "200%" }}
      >
        {/* Fridge View */}
        <motion.div
          ref={fridgeAreaRef}
          className="relative flex h-full w-[100vw] items-center justify-center p-4"
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
              points={fridgePoints}
            />
          ))}

          {DEBUG_POINTS && <Points points={fridgePoints} />}
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
              points={cabinetPoints}
            />
          ))}

          {DEBUG_POINTS && <Points points={cabinetPoints} />}
        </motion.div>
      </motion.div>
    </div>
  );
}
