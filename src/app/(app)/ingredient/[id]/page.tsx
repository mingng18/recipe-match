import { dummyRecipesData } from "@/lib/dummy-recipes";
import { notFound } from "next/navigation";
import { type } from "os";
import IngredientWrapper from "./IngredientWrapper";

export default async function IngredientPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const parsedId = parseInt(id, 10);

  // const ingredient =
  //   type === "fridge"
  //     ? dummyFridgeItems.find((item) => item.id === parsedId)
  //     : dummyCabinetItems.find((item) => item.id === parsedId);

  // if (!ingredient) notFound();

  //

  // const ingredientNameLower = ingredient.name.toLowerCase();
  // const count = dummyRecipesData.reduce((acc, recipe) => {
  //   const foundInRecipe = recipe.ingredients.some((recipeIng) =>
  //     recipeIng.name.toLowerCase().includes(ingredientNameLower),
  //   );
  //   return foundInRecipe ? acc + 1 : acc;
  // }, 0);

  return <IngredientWrapper id={parsedId} />;
}
