"use client";

import { useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import type { Recipe } from "../_types";
import { IngredientChips } from "./IngredientChips";

interface RecipeCardProps {
  recipe: Recipe;
  onUpdate: (recipe: Recipe) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function RecipeCard({ recipe, onUpdate, onDelete }: RecipeCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(recipe.name);
  const [editIngredients, setEditIngredients] = useState(recipe.ingredients);

  const handleSave = async () => {
    if (editName.trim()) {
      await onUpdate({
        ...recipe,
        name: editName.trim(),
        ingredients: editIngredients,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(recipe.name);
    setEditIngredients(recipe.ingredients);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-amber-50 rounded-xl space-y-3">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="w-full px-4 py-3 text-sm bg-white rounded-xl focus:outline-none focus:bg-slate-50 transition-colors text-slate-900 placeholder:text-slate-400"
          placeholder="Recipe name"
        />
        <IngredientChips
          ingredients={editIngredients}
          onChange={setEditIngredients}
          placeholder="Add ingredients"
        />
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={handleCancel}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="p-2 text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
          >
            <CheckIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-slate-900">
          {recipe.name}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(recipe.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {recipe.ingredients.map((ingredient) => (
          <span
            key={ingredient}
            className="px-2.5 py-1 text-xs bg-slate-100 text-slate-600 rounded-md"
          >
            {ingredient}
          </span>
        ))}
      </div>
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-200">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-amber-50 text-amber-700 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
