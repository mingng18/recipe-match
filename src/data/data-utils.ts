import type { PantryItem } from "@/type/PantryItem";

export const getDaysUntilExpiry = (expiryDate?: string): number | null => {
  if (!expiryDate) return null;
  const diffTime = new Date(expiryDate).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const sortPantryItems = (items: PantryItem[]): PantryItem[] => {
  // Add random property for stable sorting, then sort by expiry
  const itemsWithRandom = items.map((item) => ({
    ...item,
    randomSeed: Math.random(),
  }));

  return itemsWithRandom.sort((a, b) => {
    const aDays = getDaysUntilExpiry(a.expiryDate);
    const bDays = getDaysUntilExpiry(b.expiryDate);
    if (aDays === null && bDays === null) return a.randomSeed - b.randomSeed;
    if (aDays === null) return 1;
    if (bDays === null) return -1;
    if (aDays === bDays) return a.randomSeed - b.randomSeed; // Use stable random seed for ties
    return aDays - bDays;
  });
};
