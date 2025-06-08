"use client";

import React from "react";
import { motion, useMotionValue, animate, PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";
import { CabinetItem, dummyCabinetItems } from "./dummy-data";
import CabinetWrapper from "./CabinetWrapper";

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 50; // A bit arbitrary, might need tuning

const CabinetPage: React.FC = () => {
  const router = useRouter();
  const x = useMotionValue(0);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x > SWIPE_THRESHOLD && Math.abs(velocity.x) > VELOCITY_THRESHOLD) {
      // Swipe Right to Pantry
      router.push("/pantry");
    } else {
      // Snap back
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }} // Prevent dragging too far, let onDragEnd handle navigation
      style={{ x }}
      onDragEnd={handleDragEnd}
      className="container mx-auto p-4 h-full" // Ensure it takes up height for touch actions
    >
      {/* Content of the page */}
      <h1 className="mb-4 text-2xl font-bold">My Cabinet</h1>
      <CabinetWrapper items={dummyCabinetItems} />
    </motion.div>
  );
};

export default CabinetPage;
