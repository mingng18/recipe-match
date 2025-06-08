"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListFilter, ChefHat, Heart, Star, Archive } from "lucide-react"; // Added Archive
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Category } from "@/lib/constants";

const CATEGORY_FILTERS = [Category.ALL, Category.FAVORITES, Category.TRENDING];
const NAV_ITEMS = [{ name: "Cabinet", path: "/cabinet" }]; // Added Cabinet nav item

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case Category.ALL.toLowerCase():
      return <ListFilter className="mb-1 h-5 w-5" />;
    case Category.FAVORITES.toLowerCase():
      return <Heart className="mb-1 h-5 w-5" />;
    case Category.TRENDING.toLowerCase():
      return <ChefHat className="mb-1 h-5 w-5" />;
    case "cabinet": // Added case for Cabinet
      return <Archive className="mb-1 h-5 w-5" />;
    default:
      return <Star className="mb-1 h-5 w-5" />;
  }
};

export default function CategoryTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [activeCategory, setActiveCategory] = useState<string>(
    searchParams.get("category") || Category.ALL,
  );

  // Determine if a nav item (like Cabinet) is active based on the current pathname
  const isNavItemActive = (itemPath: string) => pathname === itemPath;

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== Category.ALL) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mt-4 flex justify-center border-b">
      <div className="no-scrollbar flex w-full space-x-4 overflow-x-auto px-4 pb-0 sm:px-0 md:space-x-8">
        {CATEGORY_FILTERS.map((category) => {
          const isActive = activeCategory === category && pathname.startsWith("/recipes");
          return (
            <Button
              key={category}
              variant="ghost"
              onClick={() => handleCategoryChange(category)}
              className={`relative flex flex-1 h-auto flex-col items-center justify-center px-3 py-3 text-sm font-medium transition-colors duration-150 ease-in-out hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary/80"}`}
            >
              {getCategoryIcon(category)}
              <span className="whitespace-nowrap">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
              {isActive && (
                <motion.div
                  className="bg-primary absolute right-0 bottom-0 left-0 h-0.5"
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Button>
          );
        })}
        {NAV_ITEMS.map((item) => {
          const isActive = isNavItemActive(item.path);
          return (
            <Button
              key={item.name}
              variant="ghost"
              onClick={() => router.push(item.path)}
              className={`relative flex flex-1 h-auto flex-col items-center justify-center px-3 py-3 text-sm font-medium transition-colors duration-150 ease-in-out hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary/80"}`}
            >
              {getCategoryIcon(item.name.toLowerCase())}
              <span className="whitespace-nowrap">{item.name}</span>
              {isActive && (
                <motion.div
                  className="bg-primary absolute right-0 bottom-0 left-0 h-0.5"
                  layoutId="underline" // Ensure this layoutId is unique if needed, or shared if animation should link
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
