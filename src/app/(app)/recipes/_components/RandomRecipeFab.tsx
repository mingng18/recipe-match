"use client";

import { Button } from "@/components/ui/button";
import React, { memo } from "react";
import { motion } from "framer-motion";
import Rive, { Fit, Layout, Alignment } from "@rive-app/react-canvas";

function RandomRecipeFab() {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 50 }}
      className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2"
    >
      <Button
        size="lg"
        className="flex flex-row items-center gap-2 rounded-full shadow-lg"
      >
        <div className="h-[40px] w-[40px]">
          <Rive
            src="/rive/character_facial_animation.riv"
            stateMachines="State Machine 1"
            layout={
              new Layout({
                fit: Fit.Cover,
                alignment: Alignment.Center,
                minX: 0,
                minY: 0,
                maxX: 1,
                maxY: 1,
              })
            }
          />
        </div>
        Randomise a recipe
      </Button>
    </motion.div>
  );
}

export default memo(RandomRecipeFab);
