"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { Recipe } from "../_types";
import { IngredientChips } from "./IngredientChips";
import { RecipeCard } from "./RecipeCard";

interface RecipesTabProps {
  recipes: Recipe[];
  onAddRecipe: (
    name: string,
    ingredients: string[],
    tags?: string[]
  ) => Promise<void>;
  onUpdateRecipe: (recipe: Recipe) => Promise<void>;
  onDeleteRecipe: (id: string) => Promise<void>;
  isSaving: boolean;
}

export function RecipesTab({
  recipes,
  onAddRecipe,
  onUpdateRecipe,
  onDeleteRecipe,
  isSaving,
}: RecipesTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIngredients, setNewIngredients] = useState<string[]>([]);

  const handleAdd = async () => {
    if (newName.trim() && newIngredients.length > 0) {
      await onAddRecipe(newName.trim(), newIngredients);
      setNewName("");
      setNewIngredients([]);
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewName("");
    setNewIngredients([]);
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      {/* Add New Recipe */}
      {isAdding ? (
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Recipe name"
            className="w-full px-3 py-2 mb-3 text-lg font-medium bg-white rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400"
            autoFocus
          />
          <IngredientChips
            ingredients={newIngredients}
            onChange={setNewIngredients}
            placeholder="Add key ingredients (Enter to add)"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={
                !newName.trim() || newIngredients.length === 0 || isSaving
              }
              className="px-4 py-2 text-sm text-white bg-stone-800 hover:bg-stone-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Add Recipe"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-4 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 bg-white hover:bg-slate-50 rounded-xl border border-dashed border-stone-300 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Recipe
        </button>
      )}

      {/* Recipe List */}
      <div className="space-y-3">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onUpdate={onUpdateRecipe}
            onDelete={onDeleteRecipe}
          />
        ))}
      </div>

      {recipes.length === 0 && !isAdding && (
        <div className="text-center py-12 text-stone-400">
          <p>No recipes yet. Add your first recipe!</p>
        </div>
      )}
    </div>
  );
}
