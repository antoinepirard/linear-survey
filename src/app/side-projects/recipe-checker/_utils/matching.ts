import type { Recipe, Fridge, MatchResult } from '../_types';

/**
 * Normalize an ingredient string for comparison
 * - lowercase
 * - trim whitespace
 * - remove trailing 's' for basic plural handling
 */
export function normalizeIngredient(ingredient: string): string {
  return ingredient
    .toLowerCase()
    .trim()
    .replace(/s$/, '');
}

/**
 * Check if a fridge ingredient matches a recipe ingredient
 */
export function ingredientsMatch(
  fridgeIngredient: string,
  recipeIngredient: string
): boolean {
  return (
    normalizeIngredient(fridgeIngredient) ===
    normalizeIngredient(recipeIngredient)
  );
}

/**
 * Find which recipe ingredients are missing from the fridge
 */
export function findMissingIngredients(
  recipe: Recipe,
  fridge: Fridge
): string[] {
  const normalizedFridge = fridge.ingredients.map(normalizeIngredient);

  return recipe.ingredients.filter((recipeIngredient) => {
    const normalizedRecipe = normalizeIngredient(recipeIngredient);
    return !normalizedFridge.includes(normalizedRecipe);
  });
}

/**
 * Find which recipe ingredients are in the fridge
 */
export function findMatchedIngredients(
  recipe: Recipe,
  fridge: Fridge
): string[] {
  const normalizedFridge = fridge.ingredients.map(normalizeIngredient);

  return recipe.ingredients.filter((recipeIngredient) => {
    const normalizedRecipe = normalizeIngredient(recipeIngredient);
    return normalizedFridge.includes(normalizedRecipe);
  });
}

/**
 * Get match results for all recipes against fridge contents
 * Returns recipes sorted by: exact matches first, then by match percentage
 */
export function getMatchResults(
  recipes: Recipe[],
  fridge: Fridge
): MatchResult[] {
  const results: MatchResult[] = recipes.map((recipe) => {
    const missingIngredients = findMissingIngredients(recipe, fridge);
    const matchedIngredients = findMatchedIngredients(recipe, fridge);
    const missingCount = missingIngredients.length;
    const totalIngredients = recipe.ingredients.length;
    const matchPercentage = totalIngredients > 0 
      ? Math.round((matchedIngredients.length / totalIngredients) * 100)
      : 0;

    let matchType: MatchResult['matchType'];
    if (missingCount === 0) {
      matchType = 'exact';
    } else if (missingCount <= 2) {
      matchType = 'almost';
    } else if (matchedIngredients.length > 0) {
      // Has at least 1 matching ingredient
      matchType = 'partial';
    } else {
      matchType = 'no-match';
    }

    return {
      recipe,
      missingIngredients,
      matchedIngredients,
      matchType,
      matchPercentage,
    };
  });

  // Sort by match quality: exact first, then almost, then partial (sorted by match %), then no-match
  return results.sort((a, b) => {
    const order = { exact: 0, almost: 1, partial: 2, 'no-match': 3 };
    if (order[a.matchType] !== order[b.matchType]) {
      return order[a.matchType] - order[b.matchType];
    }
    // Within same category, sort by higher match percentage (or fewer missing)
    if (a.matchPercentage !== b.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    return a.missingIngredients.length - b.missingIngredients.length;
  });
}

/**
 * Filter to only get cookable recipes (exact + almost matches)
 */
export function getCookableRecipes(
  recipes: Recipe[],
  fridge: Fridge
): MatchResult[] {
  return getMatchResults(recipes, fridge).filter(
    (result) => result.matchType !== 'no-match'
  );
}

