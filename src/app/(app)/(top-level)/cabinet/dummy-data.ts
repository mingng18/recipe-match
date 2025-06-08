export interface CabinetItem {
  id: string;
  name: string;
  quantity: string;
  imageUrl?: string;
}

export const dummyCabinetItems: CabinetItem[] = [
  {
    id: "1",
    name: "Flour",
    quantity: "1 kg",
  },
  {
    id: "2",
    name: "Sugar",
    quantity: "500g",
  },
  {
    id: "3",
    name: "Pasta",
    quantity: "1 box",
  },
  {
    id: "4",
    name: "Rice",
    quantity: "2 lbs",
  },
];
