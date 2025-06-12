import { dummyFridgeItems, dummyCabinetItems } from "@/data/dummy-data";
import { dummyRecipesData } from "@/lib/dummy-recipes";
import { notFound } from "next/navigation";
import { type } from "os";
import IngredientWrapper from "./IngredientWrapper";

export default async function IngredientPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { id } = await props.params;
  const { type } = await props.searchParams;

  const parsedId = parseInt(id, 10);

  const ingredient =
    type === "fridge"
      ? dummyFridgeItems.find((item) => item.id === parsedId)
      : dummyCabinetItems.find((item) => item.id === parsedId);

  if (!ingredient) notFound();

  const quantity = parseQuantity(ingredient.quantity);

  const ingredientNameLower = ingredient.name.toLowerCase();
  const count = dummyRecipesData.reduce((acc, recipe) => {
    const foundInRecipe = recipe.ingredients.some((recipeIng) =>
      recipeIng.name.toLowerCase().includes(ingredientNameLower),
    );
    return foundInRecipe ? acc + 1 : acc;
  }, 0);

  return (
    <IngredientWrapper
      ingredient={ingredient}
      currentQuantity={quantity.number}
      quantityUnit={quantity.unit}
      recipeCount={count}
    />
  );
}

const parseQuantity = (
  quantityStr: string,
): { number: number; unit: string } => {
  const match = quantityStr.match(/^(\d*\.?\d+)\s*(.*)$/);
  if (match) {
    return { number: parseFloat(match[1]!), unit: match[2]!.trim() };
  }
  // Fallback if no number found, or if it's just a description like "1 box"
  // For "1 box", parseInt would be 1. parseFloat also 1.
  // If quantityStr is "box", parseFloat will be NaN.
  const num = parseFloat(quantityStr);
  if (!isNaN(num)) {
    return { number: num, unit: quantityStr.replace(String(num), "").trim() };
  }
  return { number: 1, unit: quantityStr }; // Default to 1 if parsing fails badly
};
