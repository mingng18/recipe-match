"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import FridgeImg from "@/images/fridge.png";
import type { PantryItem } from "./dummy-data";
import { motion, useDragControls, useMotionValue } from "motion/react";
import { usePinch } from "@use-gesture/react";

interface PositionedPantryItem extends PantryItem {
  x: number;
  y: number;
}

const OBJECT_WIDTH = 64;
const OBJECT_HEIGHT = 64;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export default function FridgeWrapper({ data }: { data: PantryItem[] }) {
  const fridgeAreaRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<PositionedPantryItem[]>([]);

  useEffect(() => {
    if (!fridgeAreaRef.current) return;

    const containerSize = {
      width: fridgeAreaRef.current.clientWidth,
      height: fridgeAreaRef.current.clientHeight,
    };

    const positionedItems = data.map((pItem) => {
      // Use saved position if available (e.g., (pItem as any).x), otherwise randomize
      // Ensure random positions are within the calculated container bounds

      const containerInit =
        containerSize.width > OBJECT_WIDTH &&
        containerSize.height > OBJECT_HEIGHT;

      const initialX = containerInit
        ? Math.random() * (containerSize.width - OBJECT_WIDTH)
        : Math.random() * 50;
      const initialY = containerInit
        ? Math.random() * (containerSize.height - OBJECT_HEIGHT)
        : Math.random() * 50;

      return {
        ...pItem,
        x: Math.max(
          0,
          Math.min(
            initialX,
            containerSize.width > OBJECT_WIDTH
              ? containerSize.width - OBJECT_WIDTH
              : 0,
          ),
        ),
        y: Math.max(
          0,
          Math.min(
            initialY,
            containerSize.height > OBJECT_HEIGHT
              ? containerSize.height - OBJECT_HEIGHT
              : 0,
          ),
        ),
      };
    });

    setItems(positionedItems);
  }, [data]);

  return (
    <div className="relative h-full w-full p-4">
      <h1 className="text-2xl font-bold">My Pantry</h1>
      <motion.div
        ref={fridgeAreaRef}
        className="relative mt-8 flex h-full w-full items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Image
          src={FridgeImg}
          alt="fridge"
          width={1000}
          height={1000}
          className="mx-auto my-auto object-contain p-4" // Changed to object-contain for better scaling visibility
          style={{
            alignSelf: "center",
            justifySelf: "center",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          priority
        />

        {items.map((item) => (
          <FridgeItem
            key={item.id}
            item={item}
            initialX={item.x}
            initialY={item.y}
            dragConstraints={fridgeAreaRef}
            // onPositionChange={handlePositionChange}
          />
        ))}
      </motion.div>
    </div>
  );
}

const FridgeItem = ({
  item,
  initialX,
  initialY,
  dragConstraints,
  //   onPositionChange,
}: {
  item: PositionedPantryItem;
  initialX: number;
  initialY: number;
  dragConstraints: React.RefObject<HTMLDivElement | null>;
  //   onPositionChange: (id: string, x: number, y: number) => void;
}) => {
  const controls = useDragControls();
  // Parse the leading integer from the quantity string, default to 1.
  //   const numItems = Math.max(1, parseInt(item.quantity, 10) || 1);
  const itemScale = useMotionValue(1);
  const itemRef = useRef<HTMLDivElement>(null);

  const bind = usePinch(
    ({ offset: [s] }) => {
      itemScale.set(s);
    },
    {
      target: itemRef,
      eventOptions: { passive: true },
      bounds: { scale: [0.5, 2] },
    },
  );

  return (
    <motion.div
      ref={itemRef}
      key={item.id}
      drag
      dragControls={controls}
      dragConstraints={dragConstraints}
      className="absolute cursor-grab active:cursor-grabbing"
      initial={{
        scale: 0,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
        type: "spring",
        damping: 10,
      }}
      style={{
        top: initialY,
        left: initialX,
        zIndex: 10,
        scale: itemScale,
      }}
    >
      <Image
        src={item.imageUrl}
        alt={item.name}
        width={OBJECT_WIDTH}
        height={OBJECT_HEIGHT}
        className="pointer-events-none"
        priority
      />
    </motion.div>
  );
};
