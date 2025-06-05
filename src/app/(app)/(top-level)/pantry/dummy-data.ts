import ChickenImg from "@/images/chicken-breast.png";
import GarlicImg from "@/images/garlic.png";
import MilkImg from "@/images/milk.png";
import OnionImg from "@/images/onion.png";
import TomatoesImg from "@/images/tomato.png";
import PotatoImg from "@/images/potato.png";
import type { StaticImageData } from "next/image";

// Dummy data for pantry items - replace with API data later
const today = new Date();
const getDummyDate = (daysOffset: number) =>
  new Date(today.getTime() + daysOffset * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

export type PantryItem = {
  id: number;
  name: string;
  quantity: string;
  expiryDate?: string;
  category: string;
  imageUrl: StaticImageData;
};

export const dummyPantryItems: PantryItem[] = [
  {
    id: 1,
    name: "Tomatoes",
    quantity: "5 units",
    expiryDate: getDummyDate(3),
    category: "Vegetables",
    imageUrl: TomatoesImg,
  },
  {
    id: 2,
    name: "Chicken Breast",
    quantity: "900 g",
    expiryDate: getDummyDate(1),
    category: "Meat",
    imageUrl: ChickenImg,
  }, // lbs to g
  {
    id: 3,
    name: "Pasta",
    quantity: "500 g",
    expiryDate: getDummyDate(365),
    category: "Grains",
    imageUrl: PotatoImg,
  }, // box to g
  {
    id: 4,
    name: "Potato",
    quantity: "500 g",
    expiryDate: getDummyDate(365),
    category: "Vegetables",
    imageUrl: PotatoImg,
  }, // removed "bottle"
  {
    id: 5,
    name: "Onions",
    quantity: "3 units",
    expiryDate: getDummyDate(10),
    category: "Vegetables",
    imageUrl: OnionImg,
  },
  {
    id: 6,
    name: "Garlic",
    quantity: "1 unit",
    expiryDate: getDummyDate(30),
    category: "Vegetables",
    imageUrl: GarlicImg,
  }, // head to unit
  {
    id: 7,
    name: "Milk",
    quantity: "3.8 L",
    expiryDate: getDummyDate(-2),
    category: "Dairy",
    imageUrl: MilkImg,
  }, // Gallon to L
];
