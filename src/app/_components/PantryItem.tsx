import { motion, useDragControls, useMotionValue } from "framer-motion";
import { usePinch } from "@use-gesture/react";
import { useRef } from "react";
import { OBJECT_WIDTH, OBJECT_HEIGHT } from "./HomeWrapper";
import type { PantryItem } from "../type/pantry-item";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSnap } from "@/hooks/useSnap";
import { unstable_ViewTransition as ViewTransition } from "react";

const points = [
  { x: 123, y: 324 },
  { x: 323, y: 224 },
];

const IngredientItem = ({
  item,
  initialX,
  initialY,
  dragConstraints,
  type,
}: {
  item: PantryItem;
  initialX: number;
  initialY: number;
  dragConstraints: React.RefObject<HTMLDivElement | null>;
  type: "fridge" | "cabinet";
}) => {
  const router = useRouter();
  const controls = useDragControls();
  const itemScale = useMotionValue(1);
  const itemRef = useRef<HTMLDivElement>(null);

  const { dragProps } = useSnap({
    direction: "both",
    snapPoints: {
      type: "constraints-box",
      unit: "pixel",
      points: points,
    },
    ref: itemRef,
    constraints: dragConstraints,
  });

  // usePinch is from @use-gesture/react
  usePinch(
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
    <>
      {points.map((point, index) => (
        <div
          className="absolute h-2 w-2 rounded-full bg-red-500"
          key={index}
          style={{ left: point.x, top: point.y }}
        ></div>
      ))}
      <motion.div
        ref={itemRef}
        drag
        dragControls={controls}
        dragConstraints={dragConstraints}
        {...dragProps}
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
        onClick={() => router.push(`/ingredient/${item.id}?type=${type}`)} // Navigate to the ingredient page on click
      >
        <ViewTransition name={`ingredient-image-${item.id}`}>
          <Image
            id={`ingredient-image-${item.id}`} // Unique ID for the image
            src={item.imageUrl}
            alt={item.name}
            width={OBJECT_WIDTH}
            height={OBJECT_HEIGHT}
            className="pointer-events-none" // To ensure drag works on the parent motion.div
            priority
          />
        </ViewTransition>
      </motion.div>
    </>
  );
};

export default IngredientItem;
