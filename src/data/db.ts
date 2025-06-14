import type { PantryItem } from "@/type/PantryItem";
import Dexie, { type Table } from "dexie";

export class DB extends Dexie {
  pantryItems!: Table<PantryItem>;
  constructor() {
    super("pantry-db");
    this.version(1).stores({
      pantryItems: "++id, name, quantity, expiryDate, category, imageUrl, x, y",
    });
  }
}

export const db = new DB();
