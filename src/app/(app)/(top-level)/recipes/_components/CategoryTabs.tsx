"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListFilter, ChefHat, Heart, Star, Archive, ShoppingBasket, BookOpen } from "lucide-react"; // Added ShoppingBasket, BookOpen
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Category } from "@/lib/constants";

const CATEGORY_FILTERS = [Category.ALL, Category.FAVORITES, Category.TRENDING];
// Updated NAV_ITEMS to include Recipes and Pantry
const NAV_ITEMS = [
  { name: "Recipes", path: "/recipes", iconName: "recipes" },
  { name: "Pantry", path: "/pantry", iconName: "pantry" },
  { name: "Cabinet", path: "/cabinet", iconName: "cabinet" },
];

const getCategoryIcon = (iconName: string) => { // Changed parameter to iconName for clarity
  switch (iconName.toLowerCase()) {
    case Category.ALL.toLowerCase(): // Keep filter icons if needed, or remove if NAV_ITEMS cover all
      return <ListFilter className="mb-1 h-5 w-5" />;
    case Category.FAVORITES.toLowerCase():
      return <Heart className="mb-1 h-5 w-5" />;
    case Category.TRENDING.toLowerCase():
      return <ChefHat className="mb-1 h-5 w-5" />;
    case "recipes":
      return <BookOpen className="mb-1 h-5 w-5" />;
    case "pantry":
      return <ShoppingBasket className="mb-1 h-5 w-5" />;
    case "cabinet":
      return <Archive className="mb-1 h-5 w-5" />;
    default:
      return <Star className="mb-1 h-5 w-5" />; // Default icon
  }
};

export default function CategoryTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [activeFilterCategory, setActiveFilterCategory] = useState<string>(
    searchParams.get("category") || Category.ALL,
  );

  // Active state for NAV_ITEMS is based on current pathname.
  // Active state for CATEGORY_FILTERS is based on searchParam and being on /recipes page.
  const isNavItemActive = (itemPath: string) => pathname === itemPath;
  const isFilterActive = (filterCategory: string) =>
    activeFilterCategory === filterCategory && pathname.startsWith("/recipes");

  const handleFilterCategoryChange = (category: string) => {
    setActiveFilterCategory(category);
    // Ensure navigation to /recipes if a filter is clicked (might be on /pantry or /cabinet)
    const params = new URLSearchParams(); // Start fresh or use existing from searchParams if preferred
    if (category && category !== Category.ALL) {
      params.set("category", category);
    }
    // No else needed to delete, as starting fresh or explicitly not setting means no category
    router.push(`/recipes?${params.toString()}`, { scroll: false });
  };

  const handleNavItemClick = (path: string) => {
    // If navigating to /recipes, clear category filter unless it's already the target
    if (path === "/recipes" && searchParams.get("category")) {
        setActiveFilterCategory(Category.ALL); // Reset to "All" for recipes main view
        router.push(path, { scroll: false }); // Navigate to /recipes without category
    } else {
        router.push(path, { scroll: false });
    }
  };

  return (
    <div className="mt-4 flex justify-center border-b">
      <div className="no-scrollbar flex w-full space-x-1 overflow-x-auto px-1 pb-0 sm:px-0 md:space-x-2">
        {/* Navigation Items */}
        {NAV_ITEMS.map((item) => {
          const isActive = isNavItemActive(item.path);
          return (
            <Button
              key={item.name}
              variant="ghost"
              onClick={() => handleNavItemClick(item.path)}
              className={`relative flex flex-1 h-auto flex-col items-center justify-center px-2 py-3 text-sm font-medium transition-colors duration-150 ease-in-out hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 sm:px-3 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary/80"}`}
            >
              {getCategoryIcon(item.iconName)}
              <span className="whitespace-nowrap">{item.name}</span>
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
        {/* Separator - only show if filters are relevant (e.g. on /recipes page) */}
        {pathname.startsWith("/recipes") && CATEGORY_FILTERS.length > 0 && (
            <div className="mx-1 self-center h-6 w-px bg-border"></div>
        )}
        {/* Category Filters - only show if on /recipes page */}
        {pathname.startsWith("/recipes") && CATEGORY_FILTERS.map((category) => {
          const isActive = isFilterActive(category);
          return (
            <Button
              key={category}
              variant="ghost"
              onClick={() => handleFilterCategoryChange(category)}
              className={`relative flex flex-1 h-auto flex-col items-center justify-center px-2 py-3 text-sm font-medium transition-colors duration-150 ease-in-out hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 sm:px-3 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary/80"}`}
            >
              {getCategoryIcon(category.toLowerCase())}
              <span className="whitespace-nowrap">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
              {isActive && (
                <motion.div
                  className="bg-primary absolute right-0 bottom-0 left-0 h-0.5"
                  layoutId="filter-underline" // Different layoutId for filter underline
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
