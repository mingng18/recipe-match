import {
  motion,
  useDragControls,
  useMotionValue,
  type PanInfo,
} from "framer-motion";
import { usePinch } from "@use-gesture/react";
import { useCallback, useRef } from "react";
import { OBJECT_WIDTH, OBJECT_HEIGHT } from "./HomeWrapper";
import type { PantryItem } from "../../type/PantryItem";
import { useRouter } from "next/navigation";
import { useSnap } from "@/hooks/useSnap";
import { unstable_ViewTransition as ViewTransition } from "react";
import Image from "next/image";
import usePantryStore from "@/store/pantry-store";

const IngredientItem = ({
  item,
  dragConstraints,
  points,
}: {
  item: PantryItem;
  dragConstraints: React.RefObject<HTMLDivElement | null>;
  points: { x?: number; y?: number }[];
}) => {
  const { updatePantryItem } = usePantryStore();

  const router = useRouter();
  const controls = useDragControls();
  const itemScale = useMotionValue(item.scale);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleSnapComplete = useCallback(
    (x?: number, y?: number) => {
      // Only update if valid numbers are provided for both coordinates
      if (x !== undefined && y !== undefined && !isNaN(x) && !isNaN(y)) {
        const newPantryItemPosition = {
          ...item,
          x: x, // Use absolute coordinates directly
          y: y, // Use absolute coordinates directly
        };
        updatePantryItem(newPantryItemPosition);
      } else {
        console.warn("onSnapComplete received undefined or NaN coordinates:", {
          x,
          y,
        });
      }
    },
    [item, updatePantryItem],
  );

  const { dragProps } = useSnap({
    direction: "both",
    snapPoints: {
      type: "constraints-box",
      unit: "pixel",
      points: points,
    },
    ref: itemRef,
    constraints: dragConstraints,
    onSnapComplete: handleSnapComplete,
  });

  // usePinch is from @use-gesture/react
  usePinch(
    ({ offset: [s], last }) => {
      itemScale.set(s);
      // Only update database when gesture is complete
      if (last) {
        updatePantryItem({ ...item, scale: s });
      }
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
      drag
      dragControls={controls}
      dragConstraints={dragConstraints}
      {...dragProps}
      className="absolute cursor-grab active:cursor-grabbing"
      transition={{
        duration: 0.5,
        type: "spring",
        damping: 10,
      }}
      style={{
        top: item.y,
        left: item.x,
        // transform: "translate(-50%, -50%)",
        zIndex: 10,
        scale: itemScale,
      }}
      onClick={() => router.push(`/ingredient/${item.id}`)} // Navigate to the ingredient page on click
    >
      <ViewTransition name={`ingredient-image-${item.id}`}>
        <Image
          id={`ingredient-image-${item.id}`} // Unique ID for the image
          src={item.imageUrl}
          alt={item.name}
          style={{
            width: "auto",
            height: `${OBJECT_HEIGHT}px`,
            objectFit: "contain",
          }} // Use CSS for sizing to avoid conflicts with transforms
          className="pointer-events-none" // To ensure drag works on the parent motion.div
          priority
        />
      </ViewTransition>
    </motion.div>
  );
};

export default IngredientItem;
