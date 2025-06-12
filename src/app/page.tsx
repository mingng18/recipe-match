import { sortPantryItems } from "@/data/data-utils";
import { dummyFridgeItems } from "../data/dummy-data";
import HomeWrapper from "./_components/HomeWrapper";

export default async function Home() {
  return <HomeWrapper data={sortPantryItems(dummyFridgeItems)} type="fridge" />;
}
