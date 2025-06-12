import type { StaticImageData } from "next/image";

export type PantryItem = {
  id: number;
  name: string;
  quantity: string;
  expiryDate?: string;
  category: string;
  imageUrl: StaticImageData;
  x: number;
  y: number;
};
