# Project: Recipe Matcher PWA

## Background and Motivation

The user aims to develop a Next.js-based Progressive Web App (PWA) called "Recipe Matcher". The core idea is to help users discover recipes they can cook based on ingredients they have, identified by uploading photos of a recipe and their groceries. The application will use a vision model to extract ingredient information. The goal is a mobile-first design with rapid development using Shadcn UI and a Next.js backend.

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

## High-Level Task Breakdown (Phased Approach)

**Phase 1: Core MVP - Grocery Photo to Recipe**

1.  **Project Setup & Basic UI (Next.js, Shadcn UI, PWA Basics):**
    *   [x] Initialize Next.js project (already done).
    *   [x] Integrate Shadcn UI. (User confirmed setup)
    *   [x] Setup basic PWA manifest and service worker. (Manifest linked, next-pwa configured)
    *   [c] Design mobile-first layouts for core screens (Dashboard, Pantry, Capture, Recipe List, Recipe Detail). (Placeholder pages created, bottom navigation updated, FAB added. Pantry page refactored to card layout with expiry logic.)
    *   **Success Criterion:** Basic app shell runs as a PWA, navigates between placeholder screens with basic themed UI.
2.  **User Authentication (Supabase Auth - User Confirmed Setup):**
    *   [x] Configure Supabase Auth (email/password, potentially social logins). (User confirmed setup)
    *   [ ] Ensure frontend components for login/signup are integrated with Supabase Auth actions (`src/actions/auth.ts`).
    *   [ ] Implement logic to protect relevant pages/API routes based on Supabase Auth state.
    *   [ ] Ensure user session is managed correctly (e.g., using Supabase SSR utilities for Next.js).
    *   **Success Criterion:** Users can sign up, log in, log out, and protected routes are enforced.
3.  **Grocery Image Upload & Vision API Integration (Backend):**
    *   [ ] Create an API endpoint to receive an image file.
    *   [ ] Integrate with a chosen cloud vision API (e.g., Google Cloud Vision AI for object/label detection).
    *   [ ] Process API response to extract potential ingredient names.
    *   [ ] Basic ingredient name standardization (e.g., lowercase, remove plurals).
    *   **Success Criterion:** Uploaded grocery photo results in a list of detected ingredient names.
4.  **Ingredient Confirmation UI (Frontend):**
    *   [ ] Display AI-detected ingredients to the user.
    *   [ ] Allow users to confirm, edit (rename), or delete detected ingredients.
    *   [ ] Allow users to manually add ingredients the AI missed.
    *   **Success Criterion:** User can curate an accurate list of available ingredients.
5.  **Pantry Management (Backend & DB):**
    *   [ ] Define Drizzle schema for `User`, `PantryItem` (user_id, ingredient_name, quantity, added_date, (optional) expiry_date, category, imageUrl).
    *   [ ] API endpoints to save/update/delete the user's pantry items.
    *   [c] Basic UI to view current pantry (Placeholder `pantry/page.tsx` updated to card layout with expiry logic and dummy images).
    *   **Success Criterion:** Confirmed ingredients are saved to the user's pantry in the database and can be viewed with appropriate UI.
6.  **Recipe API Integration & Basic Matching:**
    *   [ ] Choose and integrate a recipe API (e.g., Spoonacular, Edamam - free tier if possible).
    *   [ ] API endpoint that takes the user's pantry ingredients and queries the recipe API.
    *   [ ] Simple matching: Find recipes that use *only* ingredients from the user's pantry.
    *   **Success Criterion:** App displays a list of recipes cookable with current pantry items.
7.  **Recipe Display:**
    *   [ ] UI to list recipe results (image, title, basic info).
    *   [ ] UI for a recipe detail view (ingredients, instructions, source URL).
    *   **Success Criterion:** User can view and select recipes.
4.  **UI/UX Refinements for Mobile (Ongoing with each feature):**
    *   [c] Review and improve all workflows based on mobile usability testing.
    *   [c] Implement mobile-first navigation (BottomNavbar includes Dashboard, Pantry, Recipes, Account; FAB for Capture).
    *   [c] Adapt dashboard, pantry (card layout, expiry logic), and other page layouts for mobile, drawing inspiration from user-provided image and best practices.
    *   [c] Adapt dashboard, pantry, and other page layouts for mobile, drawing inspiration from user-provided image and best practices.
    *   [c] Implement mobile-first navigation (BottomNavbar created and componentized).
    *   [c] Adapt dashboard and other page layouts for mobile, drawing inspiration from user-provided image.
    *   **Success Criterion:** Smoother user experience on mobile devices.

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

## Project Status Board

*(Executor to update this section with progress using markdown checklists)*

- [ ] Task 1
- [ ] Task 2

## Executor Feedback or Help Requests

*(Executor to provide updates, ask questions, or request assistance here)*

## Lessons Learned

*(Record reusable insights here as the project progresses)*
- Program output must include debugging information.
- Read the file before editing it.
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