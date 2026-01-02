export interface Recipe {
  id: string;
  name: string;
  ingredients: string[]; // key ingredients only
  tags?: string[]; // e.g. "fast", "kid", "oven"
}

export interface Fridge {
  ingredients: string[];
}

export interface RecipeCheckerData {
  recipes: Recipe[];
  fridge: Fridge;
}

export interface MatchResult {
  recipe: Recipe;
  missingIngredients: string[];
  matchType: 'exact' | 'almost' | 'no-match';
}

