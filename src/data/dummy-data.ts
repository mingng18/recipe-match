import ChickenImg from "@/images/chicken-breast.png";
import GarlicImg from "@/images/garlic.png";
import MilkImg from "@/images/milk.png";
import OnionImg from "@/images/onion.png";
import TomatoesImg from "@/images/tomato.png";
import PotatoImg from "@/images/potato.png";

import FlourImg from "@/images/cabinet/flour.png";
import PastaImg from "@/images/cabinet/pasta.png";
import RiceImg from "@/images/cabinet/rice.png";
import SugarImg from "@/images/cabinet/sugar.png";
import type { PantryItem } from "@/type/PantryItem";

const today = new Date();
const getDummyDate = (daysOffset: number) =>
  new Date(today.getTime() + daysOffset * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

export const dummyPantryItems: PantryItem[] = [
  {
    id: 1,
    name: "Tomatoes",
    quantity: "5 units",
    expiryDate: getDummyDate(3),
    category: "Vegetables",
    imageUrl: TomatoesImg,
    type: "fridge",
    x: 0,
    y: 0,
    scale: 1,
  },
  {
    id: 2,
    name: "Chicken Breast",
    quantity: "900 g",
    expiryDate: getDummyDate(1),
    category: "Meat",
    imageUrl: ChickenImg,
    type: "fridge",
    x: 0,
    y: 0,
    scale: 1,
  },
  {
    id: 3,
    name: "Pasta",
    quantity: "500 g",
    expiryDate: getDummyDate(365),
    category: "Grains",
    imageUrl: PotatoImg,
    type: "fridge",
    x: 0,
    y: 0,
    scale: 1,
  },
  {
    id: 4,
    name: "Potato",
    quantity: "500 g",
    expiryDate: getDummyDate(365),
    category: "Vegetables",
    imageUrl: PotatoImg,
    type: "fridge",
    x: 0,
    y: 0,
    scale: 1,
  },
  {
    id: 5,
    name: "Onions",
    quantity: "3 units",
    expiryDate: getDummyDate(10),
    category: "Vegetables",
    imageUrl: OnionImg,
    type: "fridge",
    x: 0,
    y: 0,
    scale: 1,
  },
  {
    id: 6,
    name: "Garlic",
    quantity: "1 unit",
    expiryDate: getDummyDate(30),
    category: "Vegetables",
    imageUrl: GarlicImg,
    type: "fridge",
    x: 0,
    y: 0,
    scale: 1,
  },
  {
    id: 7,
    name: "Milk",
    quantity: "3.8 L",
    expiryDate: getDummyDate(-2),
    category: "Dairy",
    imageUrl: MilkImg,
    type: "fridge",
    x: 0,
    y: 0,
    scale: 1,
  },
  {
    id: 8,
    name: "Flour",
    quantity: "1 kg",
    expiryDate: getDummyDate(-2),
    category: "Baking",
    imageUrl: FlourImg,
    type: "cabinet",
    x: 0,
    y: 0,
    scale: 1,
  },
  {
    id: 9,
    name: "Sugar",
    quantity: "500g",
    expiryDate: getDummyDate(-2),
    category: "Baking",
    imageUrl: SugarImg,
    type: "cabinet",
    x: 0,
    y: 0,
    scale: 1,
  },
  {
    id: 10,
    name: "Pasta",
    quantity: "1 box",
    expiryDate: getDummyDate(-2),
    category: "Baking",
    imageUrl: PastaImg,
    type: "cabinet",
    x: 0,
    y: 0,
    scale: 1,
  },
  {
    id: 11,
    name: "Rice",
    quantity: "2 lbs",
    expiryDate: getDummyDate(-2),
    category: "Baking",
    imageUrl: RiceImg,
    type: "cabinet",
    x: 0,
    y: 0,
    scale: 1,
  },
];
