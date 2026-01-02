"use client";

import { useState, useMemo } from "react";
import {
  BookOpenIcon,
  ArchiveBoxIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useRecipeChecker } from "../_hooks/useRecipeChecker";
import { RecipesTab } from "./RecipesTab";
import { FridgeTab } from "./FridgeTab";
import { MatchesTab } from "./MatchesTab";

type Tab = "recipes" | "fridge" | "matches";

const tabs: { id: Tab; label: string; icon: typeof BookOpenIcon }[] = [
  { id: "recipes", label: "Recipes", icon: BookOpenIcon },
  { id: "fridge", label: "Fridge", icon: ArchiveBoxIcon },
  { id: "matches", label: "Matches", icon: SparklesIcon },
];

interface RecipeCheckerAppProps {
  userId: string;
}

export function RecipeCheckerApp({ userId }: RecipeCheckerAppProps) {
  const [activeTab, setActiveTab] = useState<Tab>("recipes");
  const {
    recipes,
    fridge,
    matchResults,
    isLoading,
    isSaving,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    updateFridge,
  } = useRecipeChecker(userId);

  // Get all unique ingredients from recipes for autocomplete
  const recipeIngredients = useMemo(() => {
    const allIngredients = recipes.flatMap((r) => r.ingredients);
    return [...new Set(allIngredients)].sort();
  }, [recipes]);

  // Count cookable recipes for badge
  const cookableCount = matchResults.filter(
    (r) => r.matchType === "exact" || r.matchType === "almost"
  ).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 pt-20 md:pt-0">
      {/* Fixed Tab Navigation (mobile only) */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-stone-100 pt-3 pb-3 md:relative md:pt-16 md:pb-6">
        <div className="max-w-2xl mx-auto px-3 md:px-4">
          <div className="flex gap-1 p-1 bg-white rounded-2xl shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const showBadge = tab.id === "matches" && cookableCount > 0;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${
                    isActive
                      ? "bg-stone-900 text-white shadow-md"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {showBadge && (
                    <span
                      className={`absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full ${
                        isActive
                          ? "bg-emerald-400 text-white"
                          : "bg-emerald-500 text-white"
                      }`}
                    >
                      {cookableCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-3 pb-6 md:px-4 md:pb-8">
        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          {activeTab === "recipes" && (
            <RecipesTab
              recipes={recipes}
              onAddRecipe={addRecipe}
              onUpdateRecipe={updateRecipe}
              onDeleteRecipe={deleteRecipe}
              isSaving={isSaving}
            />
          )}
          {activeTab === "fridge" && (
            <FridgeTab
              fridge={fridge}
              recipeIngredients={recipeIngredients}
              onUpdateFridge={updateFridge}
              isSaving={isSaving}
            />
          )}
          {activeTab === "matches" && (
            <MatchesTab
              matchResults={matchResults}
              fridgeCount={fridge.ingredients.length}
            />
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-4 md:mt-6 flex justify-center gap-6 text-xs text-stone-400">
          <span>{recipes.length} recipes</span>
          <span>{fridge.ingredients.length} ingredients</span>
        </div>
      </div>
    </div>
  );
}
