import type { PantryItem } from "@/type/PantryItem";
import { create } from "zustand";
import { pantryRepository } from "@/data/pantry-repository";
import { db } from "@/data/db";

interface PantryStore {
  pantryItems: PantryItem[];
  fridgeItems: PantryItem[];
  cabinetItems: PantryItem[];
  loaded: boolean;

  // Actions
  setPantryItems: (pantryItems: PantryItem[]) => void;
  addPantryItem: (pantryItem: PantryItem) => Promise<void>;
  updatePantryItem: (pantryItem: PantryItem) => Promise<void>;
  deletePantryItem: (id: number) => Promise<void>;

  // Utility methods
  syncFromDatabase: () => Promise<void>;
  seedWithDummyData: () => Promise<void>;
  clearAllItems: () => Promise<void>;

  // Internal method to initialize database sync
  initializeSync: () => void;
}

const usePantryStore = create<PantryStore>((set, get) => ({
  pantryItems: [],
  fridgeItems: [],
  cabinetItems: [],
  loaded: false,

  setPantryItems: (pantryItems: PantryItem[]) => {
    const fridgeItems = pantryItems.filter((item) => item.type === "fridge");
    const cabinetItems = pantryItems.filter((item) => item.type === "cabinet");

    set({
      pantryItems,
      fridgeItems,
      cabinetItems,
      loaded: true,
    });
  },

  addPantryItem: async (pantryItem: PantryItem) => {
    await pantryRepository.add(pantryItem);
    // Database change will trigger live query update automatically
  },

  updatePantryItem: async (pantryItem: PantryItem) => {
    await pantryRepository.update(pantryItem);
    // Database change will trigger live query update automatically
  },

  deletePantryItem: async (id: number) => {
    await pantryRepository.delete(id);
    // Database change will trigger live query update automatically
  },

  syncFromDatabase: async () => {
    try {
      const pantryItems = await pantryRepository.getAll();
      get().setPantryItems(pantryItems);
    } catch (error) {
      console.error("Failed to sync pantry items from database:", error);
    }
  },

  seedWithDummyData: async () => {
    await pantryRepository.seedWithDummyData();
    // Database change will trigger live query update automatically
  },

  clearAllItems: async () => {
    await pantryRepository.clear();
    // Database change will trigger live query update automatically
  },

  initializeSync: () => {
    // Set up database listener for live updates
    db.pantryItems.hook("creating", () => get().syncFromDatabase());
    db.pantryItems.hook("updating", () => get().syncFromDatabase());
    db.pantryItems.hook("deleting", () => get().syncFromDatabase());

    // Initial sync
    get().syncFromDatabase();
  },
}));

// This is the main hook that UI components should use
export default usePantryStore;
