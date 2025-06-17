import { motion, MotionValue } from "framer-motion";
import React, { useCallback } from "react";

interface PantryTabProps {
  currentView: "fridge" | "cabinet";
  handleTabClick: (view: "fridge" | "cabinet") => void;
  tabIndicatorScaleX: MotionValue<number>;
  tabIndicatorTranslateX: MotionValue<number>;
}

const PantryTab = React.memo<PantryTabProps>(({
  currentView,
  handleTabClick,
  tabIndicatorScaleX,
  tabIndicatorTranslateX,
}) => {
  const onFridgeClick = useCallback(() => {
    handleTabClick("fridge");
  }, [handleTabClick]);

  const onCabinetClick = useCallback(() => {
    handleTabClick("cabinet");
  }, [handleTabClick]);

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
            x: currentView === "fridge" ? "0%" : "100%",
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
            currentView === "fridge"
              ? "text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={onFridgeClick}
        >
          Fridge
        </div>
        <div
          className={`relative z-10 inline-flex h-[calc(100%-1px)] w-20 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
            currentView === "cabinet"
              ? "text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={onCabinetClick}
        >
          Cabinet
        </div>
      </motion.div>
    </motion.div>
  );
});

PantryTab.displayName = "PantryTab";

export default PantryTab;
