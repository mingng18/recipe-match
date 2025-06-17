import { motion } from "framer-motion";
import { memo, useCallback } from "react";

interface DragIndicatorsProps {
  currentView: "fridge" | "cabinet";
  dragDirection: "left" | "right" | null;
  dragPosition: { x: number; y: number };
  isDragging: boolean;
  dragProgress: number;
}

const DragIndicators = memo<DragIndicatorsProps>(
  ({ currentView, dragDirection, dragPosition, isDragging, dragProgress }) => {
    // Determine if the swipe direction is valid for current view
    const isValidSwipeDirection = useCallback(() => {
      if (!dragDirection) return false;
      if (currentView === "fridge" && dragDirection === "left") return true;
      if (currentView === "cabinet" && dragDirection === "right") return true;
      return false;
    }, [currentView, dragDirection]);

    // Get arrow direction
    const getArrowDirection = useCallback(
      (dragDirection: "left" | "right" | null) => {
        if (!dragDirection) return "";
        return dragDirection === "left" ? "←" : "→";
      },
      [],
    );

    // Get indicator text based on current view and direction
    const getIndicatorText = useCallback(
      (dragDirection: "left" | "right" | null) => {
        if (!dragDirection) return "";

        if (currentView === "fridge" && dragDirection === "left") {
          return "Go to Cabinet";
        } else if (currentView === "cabinet" && dragDirection === "right") {
          return "Go to Fridge";
        }
        return "";
      },
      [currentView],
    );

    // Calculate indicator opacity and scale
    const indicatorOpacity =
      isDragging && dragDirection ? Math.min(dragProgress * 2, 1) : 0;
    const indicatorScale = 0.5 + Math.min(dragProgress, 1) * 0.5;

    const isValid = isValidSwipeDirection();

    return (
      <motion.div
        className="absolute z-20 flex flex-col items-center"
        style={{
          opacity: isValid ? indicatorOpacity : indicatorOpacity * 0.3,
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
            isValid ? "bg-green-500/70" : "bg-red-500/70"
          }`}
        >
          {isValid ? getIndicatorText(dragDirection) : "Can't go this way"}
        </div>
      </motion.div>
    );
  },
);

DragIndicators.displayName = "DragIndicators";

export default DragIndicators;
