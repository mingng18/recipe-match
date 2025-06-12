import HomeWrapper from "@/app/_components/HomeWrapper";
import { sortPantryItems } from "@/data/data-utils";
import { dummyCabinetItems } from "@/data/dummy-data";

export default async function Home() {
  return (
    <HomeWrapper data={sortPantryItems(dummyCabinetItems)} type="cabinet" />
  );
}
