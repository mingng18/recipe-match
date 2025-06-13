import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect, useMemo } from "react";
import { db } from "./db";
import type { PantryItem } from "@/type/PantryItem";
import { dummyPantryItems } from "./dummy-data";

export default function usePantryItems() {
  const rawPantryItems = useLiveQuery(() => db.pantryItems.toArray());
  const pantryItems = useMemo(() => rawPantryItems ?? [], [rawPantryItems]);

  const fridgeItems = useMemo(() => {
    return pantryItems.filter((item) => item.type === "fridge");
  }, [pantryItems]);

  const cabinetItems = useMemo(() => {
    return pantryItems.filter((item) => item.type === "cabinet");
  }, [pantryItems]);

  // useEffect(() => {
  //   const seedPantryItems = async () => {
  //     await db.pantryItems.bulkAdd(dummyPantryItems);
  //   };
  //   if (pantryItems?.length === 0) {
  //     seedPantryItems();
  //   }
  // }, [pantryItems?.length]);

  // add student
  const addPantryItem = useCallback(async (item: PantryItem) => {
    await db.pantryItems.add(item);
  }, []);

  // update student
  const updatePantryItem = useCallback(async (item: PantryItem) => {
    console.log("updatePantryItem", item);
    await db.pantryItems.put(item);
  }, []);

  // delete student
  const deletePantryItem = useCallback(async (id: number) => {
    await db.pantryItems.delete(id);
  }, []);

  return {
    pantryItems,
    fridgeItems,
    cabinetItems,
    addPantryItem,
    updatePantryItem,
    deletePantryItem,
  };
}
