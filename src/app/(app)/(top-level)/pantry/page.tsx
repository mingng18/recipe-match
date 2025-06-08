"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, animate, PanInfo } from "framer-motion";
import { Loader, RefreshCw } from "lucide-react"; // Using RefreshCw for a clearer refresh icon
import { useRouter } from "next/navigation"; // Added this line
import { dummyPantryItems, type PantryItem } from "./dummy-data";
import FridgeWrapper from "./FridgeWrapper";

const getDaysUntilExpiry = (expiryDate?: string): number | null => {
  if (!expiryDate) return null;
  const diffTime = new Date(expiryDate).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const sortPantryItems = (items: PantryItem[]): PantryItem[] => {
  // Added a random element to sorting to show refresh effect
  return [...items].sort((a, b) => {
    const aDays = getDaysUntilExpiry(a.expiryDate);
    const bDays = getDaysUntilExpiry(b.expiryDate);
    if (aDays === null && bDays === null) return Math.random() - 0.5;
    if (aDays === null) return 1;
    if (bDays === null) return -1;
    if (aDays === bDays) return Math.random() - 0.5; // Randomize if expiry is same
    return aDays - bDays;
  });
};

const REFRESH_THRESHOLD = 80; // How far user needs to pull down
const INDICATOR_AREA_HEIGHT = 60; // Height of the area where indicator is shown

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>(() => sortPantryItems(dummyPantryItems));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const y = useMotionValue(0); // Motion value for the Y position of the draggable content
  // const router = useRouter(); // Already added in the previous step's thought process, just ensuring it's here
  // const x = useMotionValue(0); // Already added in the previous step's thought process

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Animate content down to show loader fully
    animate(y, INDICATOR_AREA_HEIGHT, { type: "spring", stiffness: 200, damping: 20 });

    setTimeout(() => {
      setItems(sortPantryItems(dummyPantryItems)); // Re-sort to simulate data refresh
      setIsRefreshing(false);
      animate(y, 0, { type: "spring", stiffness: 200, damping: 20 }); // Animate content back up
    }, 1500); // Simulate API call
  }, [y]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (y.get() > REFRESH_THRESHOLD && !isRefreshing) {
      handleRefresh();
    } else if (!isRefreshing) {
      // If not refreshing and not pulled enough, snap back
      animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
    // If isRefreshing, it will snap back after timeout in handleRefresh
  };

  // Prevent drag if page is scrolled
  const [canDragY, setCanDragY] = useState(true);
  // router and x are defined above now
  // const router = useRouter();
  // const x = useMotionValue(0);

  useEffect(() => {
    const checkScroll = () => {
      setCanDragY(window.scrollY === 0);
    };
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const SWIPE_THRESHOLD = 100;
  const VELOCITY_THRESHOLD = 50;

  const handleHorizontalDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x < -SWIPE_THRESHOLD && Math.abs(velocity.x) > VELOCITY_THRESHOLD) {
      // Swipe Left to Cabinet
      router.push("/cabinet");
    } else {
      // Snap back
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x }}
      onDragEnd={handleHorizontalDragEnd}
      // The overall container for horizontal swipe needs to encompass the vertical drag setup
      // Ensure it doesn't interfere with vertical scrolling unless intended for swipe
      className="relative h-screen overflow-y-auto" // This might need to be on an inner div if FridgeWrapper itself scrolls
    >
      {/* This div is the one that handles pull-to-refresh (vertical) */}
      {/* It should not have overflow-y-auto if the motion.div above is meant to handle swipe for the whole viewport */}
      <div className="relative h-full"> {/* Removed overflow-y-auto here, was h-screen */}
      {/* Refresh Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center" // Added z-20
        style={{
          height: INDICATOR_AREA_HEIGHT,
          // The indicator's y position should be static at the top, reveal is by content moving down
          opacity: isRefreshing ? 1 : Math.min(y.get() / REFRESH_THRESHOLD, 1),
          scale: isRefreshing ? 1 : Math.min(y.get() / (REFRESH_THRESHOLD * 1.5), 1) * 0.8 + 0.2, // Adjusted scale factor slightly
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
            opacity: isRefreshing ? 1 : Math.min(y.get() / REFRESH_THRESHOLD, 1),
            scale: isRefreshing ? 1 : Math.min(y.get() / (REFRESH_THRESHOLD * 1.5), 1) * 0.8 + 0.2,
        }}
      >
        {isRefreshing ? (
          <Loader className="animate-spin text-primary" size={32} />
        ) : (
          <RefreshCw
            className="text-primary"
            size={32}
            style={{ transform: `rotate(${Math.min(y.get() / REFRESH_THRESHOLD, 1) * 360}deg)`}}
          />
        )}
      </motion.div>

      {/* Draggable Content Area for Pull-to-Refresh */}
      <motion.div
        drag={canDragY && !isRefreshing ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        style={{ y }}
        onDragEnd={handleDragEnd} // This is the vertical drag end handler
        className="relative z-10 h-full bg-white" // Ensure content has a background
      >
        <FridgeWrapper data={items} />
      </motion.div>
      </div>
    </motion.div>
  );
}
// Need to import useRouter
import { useRouter } from "next/navigation";
