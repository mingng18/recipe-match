import { motion, useDragControls, useMotionValue } from "framer-motion";
import { usePinch } from "@use-gesture/react";
import { useCallback, useRef } from "react";
import { OBJECT_WIDTH, OBJECT_HEIGHT } from "./PantryWrapper";
import type { RecipeRackItem } from "@/type/RecipeRackItem";
import { useRouter } from "next/navigation";
import { useSnap } from "@/hooks/useSnap";
import { unstable_ViewTransition as ViewTransition } from "react";
import Image from "next/image";
import useRecipeRackStore from "@/store/recipe-rack-store";

const RecipeRackItemComponent = ({
  item,
  dragConstraints,
  points,
}: {
  item: RecipeRackItem;
  dragConstraints: React.RefObject<HTMLDivElement | null>;
  points: { x?: number; y?: number }[];
}) => {
  const { updateRackItem } = useRecipeRackStore();

  const router = useRouter();
  const controls = useDragControls();
  const itemScale = useMotionValue(item.scale);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleSnapComplete = useCallback(
    (x?: number, y?: number) => {
      // Only update if valid numbers are provided for both coordinates
      if (x !== undefined && y !== undefined && !isNaN(x) && !isNaN(y)) {
        const newRackItemPosition = {
          ...item,
          x: x, // Use absolute coordinates directly
          y: y, // Use absolute coordinates directly
          updated_at: new Date(),
        };
        updateRackItem(newRackItemPosition);
      } else {
        console.warn("onSnapComplete received undefined or NaN coordinates:", {
          x,
          y,
        });
      }
    },
    [item, updateRackItem],
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
      // Only update store when gesture is complete
      if (last) {
        updateRackItem({ ...item, scale: s, updated_at: new Date() });
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
        zIndex: 10,
        scale: itemScale,
      }}
      onClick={() => router.push(`/recipe/${item.recipeId}`)} // Navigate to the recipe page on click
    >
      <ViewTransition name={`recipe-image-${item.recipeId}`}>
        <div className="relative">
          <Image
            id={`recipe-image-${item.id}`} // Unique ID for the image
            src={item.imageUrl}
            alt={item.title}
            width={OBJECT_WIDTH}
            height={OBJECT_HEIGHT}
            style={{
              width: `${OBJECT_WIDTH * 1.5}px`,
              height: `${OBJECT_HEIGHT * 1.5}px`,
            }}
            className="outline-img pointer-events-none rounded-md object-cover shadow-md" // To ensure drag works on the parent motion.div
            priority
          />
          {/* Recipe title overlay */}
          {/* <div className="bg-opacity-70 pointer-events-none absolute right-0 bottom-0 left-0 rounded-b-lg bg-black p-1 text-xs text-white">
            <p className="truncate font-medium">{item.title}</p>
          </div> */}
        </div>
      </ViewTransition>
    </motion.div>
  );
};

export default RecipeRackItemComponent;
