'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { PencilIcon, TrashIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import type { Recipe } from '../_types';
import { IngredientChips } from './IngredientChips';

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
      <motion.div
        layout
        className="p-4 bg-white rounded-xl border border-amber-200 shadow-sm"
      >
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="w-full px-3 py-2 mb-3 text-lg font-medium bg-stone-50 rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400"
          placeholder="Recipe name"
        />
        <IngredientChips
          ingredients={editIngredients}
          onChange={setEditIngredients}
          placeholder="Add key ingredients"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm text-white bg-stone-800 hover:bg-stone-900 rounded-lg transition-colors"
          >
            <CheckIcon className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 bg-white rounded-xl border border-stone-200"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-stone-900">{recipe.name}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(recipe.id)}
            className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {recipe.ingredients.map((ingredient) => (
          <span
            key={ingredient}
            className="px-2.5 py-1 text-xs bg-stone-100 text-stone-600 rounded-md"
          >
            {ingredient}
          </span>
        ))}
      </div>
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-stone-100">
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
    </motion.div>
  );
}

