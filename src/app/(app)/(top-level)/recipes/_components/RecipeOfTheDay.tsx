"use client";

import Float from "@/components/fancy/float";
import type { Recipe } from "@/lib/dummy-recipes";
import { motion } from "motion/react";
import Image from "next/image";

export default function RecipeOfTheDay({ recipe }: { recipe: Recipe }) {
  return (
    <div className="text-foreground dark:text-muted flex flex-col items-center justify-center bg-white">
      <div className="flex h-[400px] w-full flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.5, ease: "easeOut" }}
        >
          <Float>
            <div className="relative h-64 w-64 cursor-pointer overflow-hidden border-4 shadow-2xl transition-transform duration-200 sm:h-40 sm:w-40 md:h-48 md:w-48">
              <Image
                src={recipe.imageUrl!}
                alt={recipe.title}
                width={240}
                height={240}
                className="absolute top-0 left-0 h-full w-full object-cover"
              />
            </div>
          </Float>
        </motion.div>
        <motion.h2
          className="z-10 pt-8 text-xl uppercase sm:pt-12 sm:text-3xl md:pt-16 md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.7, ease: "easeOut" }}
        >
          {recipe.title}
        </motion.h2>
      </div>
    </div>
  );
}
