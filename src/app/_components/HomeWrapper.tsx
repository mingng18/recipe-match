"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Cabinet from "@/images/cabinet.png";
import Fridge from "@/images/fridge.png";
import IngredientItem from "./PantryItem";

import { animate, motion, useMotionValue, type PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";
import type { PantryItem } from "../type/pantry-item";

export const OBJECT_WIDTH = 64;
export const OBJECT_HEIGHT = 64;
const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 50;
const REFRESH_THRESHOLD = 80; // How far user needs to pull down
const INDICATOR_AREA_HEIGHT = 60; // Height of the area where indicator is shown

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

const SpringAnimation = {
  type: "spring",
  stiffness: 200,
  damping: 20,
} as const;

const points: { x?: number; y?: number }[] = [
  { y: 0.32 },
  { y: 0.46 },
  { y: 0.6 },
];

export default function HomeWrapper({
  data,
  type,
}: {
  data: PantryItem[];
  type: "fridge" | "cabinet";
}) {
  const router = useRouter();
  const fridgeAreaRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<PantryItem[]>([]);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    setWidth(fridgeAreaRef.current?.getBoundingClientRect().width ?? 0);
    setHeight(fridgeAreaRef.current?.getBoundingClientRect().height ?? 0);
  }, []);

  const x = useMotionValue(0); // Correctly initialize x for horizontal drag

  const handleHorizontalDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const { offset, velocity } = info;

    switch (type) {
      case "fridge":
        if (
          offset.x < -SWIPE_THRESHOLD &&
          Math.abs(velocity.x) > VELOCITY_THRESHOLD
        ) {
          router.push("/cabinet");
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
          router.push("/");
        } else {
          // Snap back
          animate(x, 0, SpringAnimation);
        }
        break;
    }
  };

  useEffect(() => {
    if (!fridgeAreaRef.current) return;

    const containerSize = {
      width: fridgeAreaRef.current.clientWidth,
      height: fridgeAreaRef.current.clientHeight,
    };

    const positionedItems = data.map((pItem) => {
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
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x }}
      onDragEnd={handleHorizontalDragEnd}
      className="relative h-dvh overflow-y-auto"
    >
      <motion.div
        ref={fridgeAreaRef}
        className="relative flex h-full w-full items-center justify-center overflow-hidden p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
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

        {items.map((item) => (
          <IngredientItem
            type={type}
            key={item.id}
            item={item}
            initialX={item.x}
            initialY={item.y}
            dragConstraints={fridgeAreaRef}
            points={points}
          />
        ))}
        {points.map((p, index) => (
          <div
            key={index} // Array is static so it's fine to use index as key
            className="absolute h-2 w-2 rounded-full bg-red-500"
            style={{
              top: p.y === undefined ? "0" : (height - OBJECT_HEIGHT) * p.y,
              bottom: p.y === undefined ? "0" : undefined,
              left: p.x === undefined ? "0" : (width - OBJECT_WIDTH) * p.x,
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
