export interface RecipeIngredient {
  name: string;
  quantity: string;
  notes?: string;
}

export interface RecipeStep {
  stepNumber: number;
  description: string;
  imageUrl?: string; // Optional image for a specific step
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string; // Main image for the recipe
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  ingredients: RecipeIngredient[];
  instructions: RecipeStep[]; // Changed from string[] to RecipeStep[]
  sourceUrl?: string;
  calories?: number; // Added from previous recipe list example
  tags?: string[];
}

export const dummyRecipesData: Recipe[] = [
  {
    id: "homemade-brownies",
    title: "Best Homemade Brownies",
    description: "With crispy edges, fudgy middles, and rich chocolate flavor, these homemade brownies will disappear in no time.",
    imageUrl: "/placeholders/brownies-hero.jpg", // Will need a placeholder image
    prepTime: "5 minutes",
    cookTime: "40-45 minutes",
    servings: 16,
    ingredients: [
      { name: "granulated sugar", quantity: "1 1/2 cups" },
      { name: "all-purpose flour", quantity: "3/4 cup" },
      { name: "cocoa powder", quantity: "2/3 cup", notes: "sifted if lumpy (e.g., Hershey's Special Dark Dutch-processed or Whole Foods' 365 Cocoa Powder)" },
      { name: "powdered sugar", quantity: "1/2 cup", notes: "sifted if lumpy" },
      { name: "dark chocolate chips", quantity: "1/2 cup", notes: "good quality, e.g., Ghiradelli's 60% Cacao or Enjoy Life's Dark Chocolate Morsels" },
      { name: "sea salt", quantity: "3/4 teaspoons" },
      { name: "large eggs", quantity: "2" },
      { name: "canola oil or extra-virgin olive oil", quantity: "1/2 cup" },
      { name: "water", quantity: "2 tablespoons" },
      { name: "vanilla extract", quantity: "1/2 teaspoon" },
    ],
    instructions: [
      {
        stepNumber: 1,
        description: "Preheat the oven to 325°F (160°C). Lightly spray an 8x8 inch baking dish with cooking spray and line it with parchment paper. Spray the parchment paper.",
        // imageUrl: "/placeholders/brownie-step1.jpg" // Example for step-specific image
      },
      {
        stepNumber: 2,
        description: "In a medium bowl, combine the sugar, flour, cocoa powder, powdered sugar, chocolate chips, and salt.",
      },
      {
        stepNumber: 3,
        description: "In a large bowl, whisk together the eggs, olive oil (or canola oil), water, and vanilla.",
      },
      {
        stepNumber: 4,
        description: "Sprinkle the dry mixture over the wet one, and fold until just combined. The batter will be thick!",
      },
      {
        stepNumber: 5,
        description: "Pour the batter into the prepared baking pan. Use a rubber spatula to spread it to all four sides of the pan and to smooth the top.",
      },
      {
        stepNumber: 6,
        description: "Bake for 40 to 45 minutes, until a toothpick inserted comes out with a few crumbs attached. Allow the brownies to cool completely before slicing and serving.",
      },
    ],
    sourceUrl: "https://www.loveandlemons.com/brownies-recipe/",
    tags: ["dessert", "chocolate", "baking", "vegetarian"],
    calories: 200, // Approximate, actual calculation needed if for real use
  },
  // ... can add more recipes here later
];

// Helper function to get a recipe by ID
export const getRecipeById = (id: string): Recipe | undefined => {
  return dummyRecipesData.find(recipe => recipe.id === id);
}; 