import { DoughInputs, DoughRecipe } from '../_types';

/**
 * Calculate dough recipe based on target weight and baker's percentages.
 * 
 * Formula (baker's percentages where flour = 100%):
 * Total = Flour + (Flour × Hydration%) + (Flour × Starter%) + (Flour × Salt%)
 * Flour = Total Dough Weight / (1 + Hydration% + Starter% + Salt%)
 * 
 * Note: Starter is typically 100% hydration (equal parts flour and water),
 * so it contributes to both flour and water totals. This calculation
 * gives a simplified approach for home bakers.
 */
export function calculateDoughRecipe(inputs: DoughInputs): DoughRecipe {
  const { targetWeight, hydration, starterPercentage, saltPercentage } = inputs;

  // Convert percentages to decimals
  const hydrationDecimal = hydration / 100;
  const starterDecimal = starterPercentage / 100;
  const saltDecimal = saltPercentage / 100;

  // Calculate flour weight
  // Total = Flour × (1 + hydration + starter + salt)
  const flour = targetWeight / (1 + hydrationDecimal + starterDecimal + saltDecimal);

  // Calculate other ingredients based on flour weight
  const water = flour * hydrationDecimal;
  const starter = flour * starterDecimal;
  const salt = flour * saltDecimal;

  // Calculate actual total (may differ slightly due to rounding)
  const totalWeight = flour + water + starter + salt;

  return {
    flour: Math.round(flour),
    water: Math.round(water),
    starter: Math.round(starter),
    salt: Math.round(salt * 10) / 10, // Keep one decimal for salt precision
    totalWeight: Math.round(totalWeight),
  };
}

/**
 * Format weight for display with appropriate unit
 */
export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)}kg`;
  }
  return `${grams}g`;
}

