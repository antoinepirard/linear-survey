"use client";

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ShoppingCartIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { MatchResult } from "../_types";

interface MatchesTabProps {
  matchResults: MatchResult[];
  fridgeCount: number;
}

// Consistent tag component for ingredients
function IngredientTag({
  ingredient,
  hasIt,
}: {
  ingredient: string;
  hasIt: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${
        hasIt ? "bg-white text-stone-700 shadow-sm" : "bg-red-50 text-red-600"
      }`}
    >
      {hasIt ? (
        <CheckIcon className="w-3 h-3 text-emerald-500" />
      ) : (
        <XMarkIcon className="w-3 h-3 text-red-400" />
      )}
      {ingredient}
    </span>
  );
}

// Sort ingredients: have first, then missing
function sortIngredients(ingredients: string[], missingIngredients: string[]) {
  const have = ingredients.filter((i) => !missingIngredients.includes(i));
  const missing = ingredients.filter((i) => missingIngredients.includes(i));
  return [...have, ...missing];
}

export function MatchesTab({ matchResults, fridgeCount }: MatchesTabProps) {
  const exactMatches = matchResults.filter((r) => r.matchType === "exact");
  const almostMatches = matchResults.filter((r) => r.matchType === "almost");
  const partialMatches = matchResults.filter((r) => r.matchType === "partial");

  // Collect all missing ingredients for shopping list (from almost matches only)
  const shoppingList = [
    ...new Set(almostMatches.flatMap((r) => r.missingIngredients)),
  ];

  if (fridgeCount === 0) {
    return (
      <div className="text-center py-12 text-stone-400">
        <p>Add ingredients to your fridge first!</p>
      </div>
    );
  }

  const hasAnyMatches =
    exactMatches.length > 0 ||
    almostMatches.length > 0 ||
    partialMatches.length > 0;

  if (matchResults.length === 0 || !hasAnyMatches) {
    return (
      <div className="text-center py-12 text-stone-400">
        <p>No matching recipes found. Add more recipes or ingredients!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Exact Matches */}
      {exactMatches.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-medium text-stone-900">Cook Now</h2>
            <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
              {exactMatches.length}
            </span>
          </div>
          <div className="space-y-3">
            {exactMatches.map((result) => (
              <div
                key={result.recipe.id}
                className="p-4 bg-emerald-50 rounded-xl"
              >
                <h3 className="text-base font-semibold text-stone-900 mb-3">
                  {result.recipe.name}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.recipe.ingredients.map((ingredient) => (
                    <IngredientTag
                      key={ingredient}
                      ingredient={ingredient}
                      hasIt={true}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Almost Matches */}
      {almostMatches.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-medium text-stone-900">Almost There</h2>
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
              {almostMatches.length}
            </span>
          </div>
          <div className="space-y-3">
            {almostMatches.map((result) => (
              <div
                key={result.recipe.id}
                className="p-4 bg-amber-50 rounded-xl"
              >
                <h3 className="text-base font-semibold text-stone-900 mb-3">
                  {result.recipe.name}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {sortIngredients(
                    result.recipe.ingredients,
                    result.missingIngredients
                  ).map((ingredient) => {
                    const hasIt =
                      !result.missingIngredients.includes(ingredient);
                    return (
                      <IngredientTag
                        key={ingredient}
                        ingredient={ingredient}
                        hasIt={hasIt}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Partial Matches */}
      {partialMatches.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="w-5 h-5 text-violet-500" />
            <h2 className="text-lg font-medium text-stone-900">Need More</h2>
            <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-700 rounded-full">
              {partialMatches.length}
            </span>
          </div>
          <div className="space-y-3">
            {partialMatches.map((result) => (
              <div
                key={result.recipe.id}
                className="p-4 bg-stone-50 rounded-xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-stone-900">
                    {result.recipe.name}
                  </h3>
                  <span className="text-xs text-stone-500 font-medium">
                    {result.matchPercentage}%
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sortIngredients(
                    result.recipe.ingredients,
                    result.missingIngredients
                  ).map((ingredient) => {
                    const hasIt =
                      !result.missingIngredients.includes(ingredient);
                    return (
                      <IngredientTag
                        key={ingredient}
                        ingredient={ingredient}
                        hasIt={hasIt}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shopping List */}
      {shoppingList.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCartIcon className="w-5 h-5 text-stone-500" />
            <h2 className="text-lg font-medium text-stone-900">
              Shopping List
            </h2>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl">
            <p className="text-sm text-stone-500 mb-3">
              Get these to unlock {almostMatches.length} recipe
              {almostMatches.length !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {shoppingList.map((ingredient) => (
                <span
                  key={ingredient}
                  className="px-2.5 py-1 text-xs bg-white text-stone-700 rounded-md border border-stone-200"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
