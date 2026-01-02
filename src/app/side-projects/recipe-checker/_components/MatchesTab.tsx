'use client';

import { motion, AnimatePresence } from 'motion/react';
import { CheckCircleIcon, ExclamationTriangleIcon, ShoppingCartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import type { MatchResult } from '../_types';

interface MatchesTabProps {
  matchResults: MatchResult[];
  fridgeCount: number;
}

export function MatchesTab({ matchResults, fridgeCount }: MatchesTabProps) {
  const exactMatches = matchResults.filter((r) => r.matchType === 'exact');
  const almostMatches = matchResults.filter((r) => r.matchType === 'almost');
  const partialMatches = matchResults.filter((r) => r.matchType === 'partial');

  // Collect all missing ingredients for shopping list (from almost matches only)
  const shoppingList = [...new Set(almostMatches.flatMap((r) => r.missingIngredients))];

  if (fridgeCount === 0) {
    return (
      <div className="text-center py-12 text-stone-400">
        <p>Add ingredients to your fridge first!</p>
      </div>
    );
  }

  const hasAnyMatches = exactMatches.length > 0 || almostMatches.length > 0 || partialMatches.length > 0;

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
            <AnimatePresence>
              {exactMatches.map((result) => (
                <motion.div
                  key={result.recipe.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-emerald-50 rounded-xl border border-emerald-200"
                >
                  <h3 className="text-lg font-medium text-stone-900 mb-2">
                    {result.recipe.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {result.recipe.ingredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="px-2.5 py-1 text-xs bg-white text-emerald-700 rounded-md border border-emerald-200"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
            <AnimatePresence>
              {almostMatches.map((result) => (
                <motion.div
                  key={result.recipe.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-amber-50 rounded-xl border border-amber-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-stone-900">
                      {result.recipe.name}
                    </h3>
                    <span className="text-xs text-amber-600 font-medium">
                      Missing {result.missingIngredients.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {result.recipe.ingredients.map((ingredient) => {
                      const isMissing = result.missingIngredients.includes(ingredient);
                      return (
                        <span
                          key={ingredient}
                          className={`px-2.5 py-1 text-xs rounded-md border ${
                            isMissing
                              ? 'bg-red-50 text-red-600 border-red-200 line-through'
                              : 'bg-white text-stone-600 border-amber-200'
                          }`}
                        >
                          {ingredient}
                        </span>
                      );
                    })}
                  </div>
                  <div className="pt-2 border-t border-amber-200">
                    <p className="text-xs text-amber-700">
                      <span className="font-medium">Need:</span>{' '}
                      {result.missingIngredients.join(', ')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Partial Matches - Need More Ingredients */}
      {partialMatches.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="w-5 h-5 text-violet-500" />
            <h2 className="text-lg font-medium text-stone-900">Need More Ingredients</h2>
            <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-700 rounded-full">
              {partialMatches.length}
            </span>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {partialMatches.map((result) => (
                <motion.div
                  key={result.recipe.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-stone-50 rounded-xl border border-stone-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-stone-900">
                      {result.recipe.name}
                    </h3>
                    <span className="text-xs text-stone-500 font-medium bg-white px-2 py-1 rounded-md">
                      {result.matchPercentage}% match
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.recipe.ingredients.map((ingredient) => {
                      const isMissing = result.missingIngredients.includes(ingredient);
                      return (
                        <span
                          key={ingredient}
                          className={`px-2.5 py-1 text-xs rounded-md border ${
                            isMissing
                              ? 'bg-red-50 text-red-500 border-red-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {isMissing ? '✗' : '✓'} {ingredient}
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Shopping List */}
      {shoppingList.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCartIcon className="w-5 h-5 text-stone-500" />
            <h2 className="text-lg font-medium text-stone-900">Quick Shopping List</h2>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <p className="text-sm text-stone-600 mb-3">
              Get these to unlock {almostMatches.length} more recipe{almostMatches.length !== 1 ? 's' : ''}:
            </p>
            <div className="flex flex-wrap gap-2">
              {shoppingList.map((ingredient) => (
                <span
                  key={ingredient}
                  className="px-3 py-1.5 text-sm bg-white text-stone-700 rounded-lg border border-stone-200 shadow-sm"
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

