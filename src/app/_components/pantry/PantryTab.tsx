"use client";

import { animate, motion, MotionValue, useMotionValue } from "framer-motion";
import React, { memo, useCallback, useEffect } from "react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { acceptedViews, type ViewType } from "@/app/constants/view";
import { SpringAnimation, type SpringConfig } from "@/app/constants/spring";

const IMPACT_INTENSITY = 0.8;

const PantryTab = memo(() => {
  const tabIndicatorX = useMotionValue(0);
  const tabIndicatorScaleX = useMotionValue(1);
  const tabIndicatorTranslateX = useMotionValue(0);

  const [currentView, setCurrentView] = useQueryState<ViewType>(
    "view",
    parseAsStringLiteral(acceptedViews).withDefault("fridge"),
  );

  const animateTabs = useCallback(
    (
      targetView: ViewType,
      impactIntensity: number,
      springAnimation: SpringConfig | typeof SpringAnimation = SpringAnimation,
    ) => {
      // Animate tab indicator to edge, then create impact
      let indicatorDirection = 0;
      let translateDirection = 0;

      if (targetView === "recipe") {
        indicatorDirection = -40; // Left position
        translateDirection = -2;
      } else if (targetView === "fridge") {
        indicatorDirection = 0; // Center position
        translateDirection = 0;
      } else if (targetView === "cabinet") {
        indicatorDirection = 40; // Right position
        translateDirection = 2;
      }

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
    [tabIndicatorScaleX, tabIndicatorTranslateX, tabIndicatorX],
  );

  useEffect(() => {
    if (currentView) {
      animateTabs(currentView, IMPACT_INTENSITY);
    }
  }, [animateTabs, currentView]);

  const handleTabClick = useCallback(
    (targetView: ViewType) => {
      if (targetView === currentView) return;
      setCurrentView(targetView);

      animateTabs(targetView, IMPACT_INTENSITY);
    },
    [currentView, setCurrentView, animateTabs],
  );

  return (
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
            x:
              currentView === "recipe"
                ? "0%"
                : currentView === "fridge"
                  ? "100%"
                  : "200%",
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
            currentView === "recipe"
              ? "text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => handleTabClick("recipe")}
        >
          Recipe
        </div>
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
  );
});

PantryTab.displayName = "PantryTab";

export default PantryTab;
