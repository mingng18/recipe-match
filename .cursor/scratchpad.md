# Project: Recipe Matcher PWA

## Background and Motivation

The user aims to develop a Next.js-based Progressive Web App (PWA) called "Recipe Matcher". The core idea is to help users discover recipes they can cook based on ingredients they have, identified by uploading photos of a recipe and their groceries. The application will use a vision model to extract ingredient information. The goal is a mobile-first design with rapid development using Shadcn UI and a Next.js backend.

The user wants to enhance the recipe detail page by adding a bottom app bar with a CTA to navigate to a dedicated recipe steps view. This view, using the existing `RecipeStepCards` component, needs to be improved with an initial ingredients checklist card and a progress stepper.

**User's Vision:**
- Mobile-first design (PWA).
- Fast iteration using Shadcn UI.
- Integrated Next.js backend.

**Core Functionality:**
- User uploads a photo of a recipe.
- User uploads a photo of their groceries.
- A vision model extracts ingredients from both photos.
- The app recommends recipes based on available ingredients.
- The app suggests purchasing a few extra ingredients to unlock more recipes.

**Complimentary Features:**
- Calorie counting for recipes and daily intake tracking.
- Suggestions for nearby places to buy ingredients at cheaper prices.
- Reminders for expiring food items in the fridge.

## Key Challenges and Analysis

1.  **Vision Model Accuracy & Integration:**
    *   **Challenge:** Reliably extracting ingredients from recipe photos (text/image) and grocery photos (various items, packaging, lighting).
    *   **Analysis:**
        *   Need robust OCR (for text recipes) and object detection/classification (for groceries/image recipes).
        *   Choice/fine-tuning of vision model(s) is critical (e.g., Google Cloud Vision AI, AWS Rekognition, open-source alternatives).
        *   Handling image variability (quality, lighting, packaging).
        *   Standardizing recognized ingredients against a common database.
        *   **Crucial:** User interface for confirming/correcting AI-extracted ingredients.

2.  **Recipe Database & Matching Algorithm:**
    *   **Challenge:** Sourcing a comprehensive recipe database and creating an effective matching logic.
    *   **Analysis:**
        *   Options: Third-party recipe API (e.g., Edamam, Spoonacular - faster, potential costs), web scraping (legal/maintenance issues), user submissions (moderation).
        *   Matching Algorithm: Prioritize recipes using existing ingredients, suggest minimal additions, consider quantities, allow filtering (cuisine, diet).

3.  **Data Management (User Pantry, Expiry Dates):**
    *   **Challenge:** Efficiently managing user pantry data (ingredients, quantities, expiry dates).
    *   **Analysis:**
        *   Database design (PostgreSQL with Drizzle ORM seems appropriate from `package.json`).
        *   Easy UX for manual adjustments and expiry date input.
        *   Reliable notification system for expiry reminders.

4.  **PWA Specifics & Mobile-First UX:**
    *   **Challenge:** Delivering a smooth, native-like PWA experience.
    *   **Analysis:**
        *   Service workers (caching, potential offline access via `next-pwa` or similar).
        *   True mobile-first responsive design.
        *   Optimized image handling (uploads, processing).

5.  **Third-Party Service Integration (Maps/Pricing, Calorie Info):**
    *   **Challenge:** Integrating external APIs for local grocery pricing and calorie data.
    *   **Analysis:**
        *   Finding reliable APIs for grocery prices (can be difficult/hyperlocal).
        *   Nutrition database APIs (e.g., Nutritionix, USDA FoodData Central).
        *   Managing API keys, rate limits, and costs.

6.  **Rapid Development vs. Feature Creep:**
    *   **Challenge:** Balancing speed with the scope of features.
    *   **Analysis:** Prioritize core MVP features, then iterate.

*   **Component Reusability vs. Specificity**: `RecipeStepCards` will need to handle both regular recipe steps and a special ingredients card.
*   **State Management**: Managing the state of checkboxes for ingredients and the current step for the stepper.
*   **Navigation**: Ensuring seamless navigation between the recipe detail page and the new steps page.
*   **UI/UX**: Designing an intuitive and clean UI for the bottom app bar, stepper, and ingredients card.
*   **TypeScript Errors**: Resolving existing linter errors in `RecipeStepCards.tsx`.

## High-Level Task Breakdown (Phased Approach)

**Phase 1: Core MVP - Grocery Photo to Recipe**

1.  **Project Setup & Basic UI (Next.js, Shadcn UI, PWA Basics):**
    *   [x] Initialize Next.js project.
    *   [x] Integrate Shadcn UI.
    *   [x] Setup basic PWA manifest and service worker.
    *   [c] Design mobile-first layouts for core screens (Dashboard, Pantry, Capture, Recipe List, Recipe Detail).
        *   Pantry page UI updated with card layout, SI units, expiry logic (display only).
        *   Account page created (displays email, sign-out button).
        *   Bottom navigation bar implemented (`src/app/_components/bottom-navbar.tsx`) with 3 items: "Recipes" (links to `/recipes`), "Pantry", "Account".
        *   Floating Action Button (FAB) for "Capture" removed; "Capture Ingredients" button added to Pantry page.
        *   Recipe Detail page (`recipe/[id]`) styled with full-width image, overlay header buttons (Back, Favorite), and content flowing below, inspired by Airbnb design. Links to recipe detail page updated from `/recipes/[id]` to `/recipe/[id]`. Back button now links to `/recipes`.
    *   **Success Criterion:** Basic app shell runs as a PWA, navigates between placeholder screens with basic themed UI.
2.  **User Authentication (Supabase Auth):**
    *   [x] Configure Supabase Auth.
    *   [c] Frontend components for login/signup integrated with Supabase Auth actions (`src/actions/auth.ts`); `signout` action added.
    *   [ ] Implement logic to protect relevant pages/API routes.
    *   [ ] Ensure user session is managed correctly.
    *   **Success Criterion:** Users can sign up, log in, log out, and protected routes are enforced.
3.  **Grocery Image Upload & Vision API Integration (Backend):**
    *   [ ] Create an API endpoint to receive an image file.
    *   [ ] Integrate with a chosen cloud vision API.
    *   [ ] Process API response to extract potential ingredient names.
    *   [ ] Basic ingredient name standardization.
    *   **Success Criterion:** Uploaded grocery photo results in a list of detected ingredient names.
4.  **Ingredient Confirmation UI (Frontend):**
    *   [ ] Display AI-detected ingredients to the user.
    *   [ ] Allow users to confirm, edit, or delete detected ingredients.
    *   [ ] Allow users to manually add ingredients.
    *   **Success Criterion:** User can curate an accurate list of available ingredients.
5.  **Pantry Management (Backend & DB):**
    *   [ ] Define Drizzle schema for `User`, `PantryItem`.
    *   [ ] API endpoints to save/update/delete pantry items.
    *   [c] Basic UI to view current pantry (`pantry/page.tsx` updated to card layout).
    *   **Success Criterion:** Confirmed ingredients are saved and viewable.
6.  **Recipe API Integration & Basic Matching:**
    *   [ ] Choose and integrate a recipe API.
    *   [ ] API endpoint for recipe queries based on pantry.
    *   [ ] Simple matching logic.
    *   **Success Criterion:** App displays recipes from API based on pantry.
7.  **Recipe Display:**
    *   [c] UI to list recipe results (images, titles, basic info) - `recipes/page.tsx` updated to use dummy data and link to detail page.
    *   [c] UI for a recipe detail view (`recipes/[id]/page.tsx`):
        *   Created dummy recipe data (`src/lib/dummy-recipes.ts`) based on Love & Lemons brownie recipe.
        *   Installed `@use-gesture/react` and `@react-spring/web` for animations.
        *   Implemented swipeable card stack for recipe instructions (`RecipeStepCards.tsx`).
        *   Refactored page into Server Component (`page.tsx`) and Client Component (`_components/RecipeDetailClient.tsx`) to handle `useState` for favorite button and other client-side interactions.
        *   Styled to mimic Airbnb example (full-width image, overlay header buttons, content below).
    *   **Success Criterion:** User can view recipe lists and detailed recipe pages with interactive instruction steps.

**Phase 2: Enhancements - Recipe OCR, "Buy Extra" Suggestions, Basic Calories**

1.  **Recipe Photo Upload & OCR Integration:**
    *   [ ] API endpoint for recipe image upload.
    *   [ ] Integrate with vision API's OCR capabilities to extract text.
    *   [ ] Basic NLP to parse ingredients from extracted recipe text.
    *   [ ] UI for user to confirm/edit ingredients extracted from recipe.
    *   **Success Criterion:** User can upload a recipe photo, and ingredients are extracted and confirmable.
2.  **Enhanced Recipe Matching ("Buy Extra Ingredients"):**
    *   [ ] Modify recipe search logic to find recipes requiring 1-2 additional ingredients not in the pantry.
    *   [ ] Clearly indicate missing ingredients and how many.
    *   **Success Criterion:** App suggests recipes that are "close matches" with a small shopping list.
3.  **Basic Calorie Display:**
    *   [ ] If recipe API provides calorie info, display it on the recipe detail page.
    *   **Success Criterion:** Calorie information (if available) is shown.

**Phase 3: Complementary Features**

1.  **Food Expiry Reminders:**
    *   [ ] Allow users to input expiry dates for pantry items (manual or attempt smart suggestions).
    *   [ ] Backend logic/cron job to check for expiring items.
    *   [ ] Notification system (in-app, potentially email/push if PWA configured).
    *   **Success Criterion:** Users receive reminders for expiring food.
2.  **Advanced Calorie Tracking (Daily Intake):**
    *   [ ] Allow users to log meals/recipes consumed.
    *   [ ] Track daily/weekly calorie intake against user-defined goals.
    *   [ ] Nutrition database integration if recipe API is insufficient.
    *   **Success Criterion:** Users can track their calorie consumption.
3.  **Nearby Ingredient Sourcing (Basic):**
    *   [ ] For missing ingredients, integrate with a maps API (e.g., Google Places) to show nearby grocery stores.
    *   [ ] (Advanced/Optional) Explore grocery store APIs or price comparison services if feasible.
    *   **Success Criterion:** App can suggest nearby stores for missing ingredients.
4.  **User Profile & Preferences:**
    *   [ ] Dietary restrictions, favorite cuisines, etc.
    *   [ ] Saved/favorite recipes.
    *   **Success Criterion:** Enhanced personalization.

**Phase 4: Bottom App Bar and Navigation**
1.  Create `BottomAppBar.tsx` component in `src/app/(app)/recipe/[id]/_components/`.
2.  Integrate `BottomAppBar` into `RecipeDetailClient.tsx`.
3.  Create a new recipe steps page: `src/app/(app)/recipe/[id]/steps/page.tsx`.
4.  Implement navigation from `BottomAppBar` CTA to the new steps page.

**Phase 5: Enhance RecipeStepCards Component**
1.  Add a stepper UI to the top of `RecipeStepCards.tsx`.
2.  Prepend a special "Ingredients" card with checkboxes to `RecipeStepCards`.
3.  Adjust card swiping/navigation logic in `RecipeStepCards.tsx` to accommodate the ingredients card.

**Phase 6: Refinements and Error Handling**
1.  Fix linter errors in `RecipeStepCards.tsx`.
2.  Thoroughly test all new features and user flows.

## Project Status Board

- [x] Setup PWA basics and Shadcn UI.
- [c] Implement basic mobile-first navigation (BottomNavbar).
- [x] Create placeholder pages for Dashboard, Pantry, Capture, Recipes, Account.
- [x] Style Pantry page with card layout, SI units, and simplified actions.
- [x] Create Account page with email display and signout.
- [x] Update BottomNavbar to 3 items: Recipes (->/recipes), Pantry, Account.
- [x] Remove FAB; add Capture button to Pantry page.
- [x] Create dummy recipe data structure and initial brownie recipe.
- [x] Install gesture/animation libraries (`@use-gesture/react`, `@react-spring/web`).
- [c] Implement Recipe Detail page (`recipes/[id]`):
    - [x] Basic structure and data display.
    - [x] Swipeable card stack for instructions (`RecipeStepCards.tsx`).
    - [x] Refactor into Server (`page.tsx`) and Client (`_components/RecipeDetailClient.tsx`) components.
    - [x] Style to mimic Airbnb example (full-width image, overlay header buttons, etc.).
- [c] Update Recipe List page (`recipes/page.tsx`) to use new dummy data and link to detail page.
- [x] Corrected navigation links across recipe list, recipe detail, and bottom navigation bar to ensure consistency with route changes (e.g., `/dashboard` to `/recipes`, `/recipes/[id]` to `/recipe/[id]`).
- [ ] Task: Full Supabase Auth integration (protected routes, session management).
- [ ] Task: Backend for grocery image upload and vision API call.
- [ ] **Phase 1: Bottom App Bar and Navigation**
    *   [ ] Create `BottomAppBar.tsx`
    *   [ ] Integrate `BottomAppBar` into `RecipeDetailClient.tsx`
    *   [ ] Create recipe steps page (`.../steps/page.tsx`)
    *   [ ] Implement navigation from CTA to steps page
- [ ] **Phase 2: Enhance RecipeStepCards Component**
    *   [ ] Add stepper to `RecipeStepCards.tsx`
    *   [ ] Add Ingredients card with checkboxes to `RecipeStepCards.tsx`
    *   [ ] Adjust card logic in `RecipeStepCards.tsx`
- [ ] **Phase 3: Refinements and Error Handling**
    *   [ ] Fix linter errors in `RecipeStepCards.tsx`
    *   [ ] Test new features

## Executor Feedback or Help Requests

*(Executor to provide updates, ask questions, or request assistance here)*

## Lessons Learned

*(Record reusable insights here as the project progresses)*
- Program output must include debugging information.
- Read the file before editing it.
- Dont use legacy behavior in Link
- When terminal vulnerabilities appear, run `npm audit` first.

## Current Market Competitors

- **SuperCook:** Major player. Focuses on recipes from ingredients users have (manual/voice pantry input). Large recipe database (11M+), AI-driven. iOS & Android. Does not seem to heavily feature photo-based ingredient input for groceries/recipes as a primary input.
- **ChefKitty.ai:** Web tool to generate recipes from an *image of food* (finished dish).
- **RecipeSpawn (GitHub):** Open-source deep learning project (Flask web app) generating recipes from food images using CNNs.
- **Recipe Snap (GitHub):** Open-source React Native app (hackathon project) generating recipes from food photos using Clarifai (image recognition) and Edamam (recipe search) APIs.
- **Others (often pantry managers/recipe finders):** Cooklist, MyFridgeFood, Mealime, Samsung Food, Recipe Keeper, Zest Cooking.

**Market Observations & Potential for Recipe Matcher:**
- Ingredient-based recipe search is a validated market need.
- **Key Differentiator:** Your dual vision model approach (recipe photo + grocery photo) for ingredient extraction offers a potentially superior UX over manual entry.
- PWA is suitable for rapid, cross-platform deployment.
- Complementary features (calories, local ingredient sourcing, expiry alerts) add significant value.

## Technology Stack Considerations

*   **Frontend:** Next.js (React) - (as specified by user)
*   **UI Library:** Shadcn UI (Tailwind CSS) - (as specified by user)
*   **Backend:** Next.js API Routes / tRPC (already in `package.json`)
*   **Database:** Supabase (PostgreSQL) with Drizzle ORM (user confirmed Supabase setup, Drizzle in `package.json`)
*   **Authentication:** Supabase Auth (user confirmed setup - `src/actions/auth.ts` exists)
*   **Vision Model (OCR & Object Detection):**
    *   **Recommended Start:** Google Cloud Vision AI or AWS Rekognition (robust, good for MVP).
    *   **Alternatives:** Azure Computer Vision, Open-source models (TensorFlow Lite, OpenCV, Hugging Face models - more complex to manage initially).
*   **Recipe Data Source:**
    *   **Recommended Start:** Recipe API like Spoonacular or Edamam (check free/low-cost tiers for MVP).
    *   **Later/Alternative:** Build/scrape own (complex).
*   **Calorie Information API:** Nutritionix, USDA FoodData Central.
*   **Grocery Pricing/Location API:** Google Places API (for store locations). Price data is harder; explore specific grocery APIs or services if viable later.
*   **Deployment:** Vercel (recommended for Next.js), Netlify, AWS Amplify.
*   **State Management (Frontend):** React Query (existing), Zustand/Jotai for client state if complex.
*   **PWA Tooling:** `next-pwa` plugin or manual service worker setup.

**Suggestions on User's Overall Project Plan (Summary from above):**
*   **Adopt a Phased Approach:** Start with an MVP focusing on the core grocery-to-recipe flow using a cloud vision API and a recipe API.
*   **Prioritize Vision Model UX:** The interface for confirming/correcting AI-extracted ingredients is critical for success.
*   **Mobile-First Testing:** Continuously test on real devices or accurate emulators.
*   **Leverage Shadcn for Speed:** Stick to its components to iterate quickly.
*   **Defer Complexities:** Building a custom recipe DB or highly accurate hyperlocal price comparison can be post-MVP.