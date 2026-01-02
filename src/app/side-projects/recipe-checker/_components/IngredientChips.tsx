'use client';

import { useState, useCallback, KeyboardEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { motion, AnimatePresence } from 'motion/react';

interface IngredientChipsProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function IngredientChips({
  ingredients,
  onChange,
  placeholder = 'Type ingredient + Enter',
  disabled = false,
}: IngredientChipsProps) {
  const [inputValue, setInputValue] = useState('');

  const addIngredient = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      onChange([...ingredients, trimmed]);
      setInputValue('');
    }
  }, [inputValue, ingredients, onChange]);

  const removeIngredient = useCallback(
    (ingredient: string) => {
      onChange(ingredients.filter((i) => i !== ingredient));
    },
    [ingredients, onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addIngredient();
      } else if (e.key === 'Backspace' && inputValue === '' && ingredients.length > 0) {
        removeIngredient(ingredients[ingredients.length - 1]);
      }
    },
    [addIngredient, inputValue, ingredients, removeIngredient]
  );

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 focus-within:border-stone-400 focus-within:ring-1 focus-within:ring-stone-400 transition-all min-h-[52px]">
        <AnimatePresence mode="popLayout">
          {ingredients.map((ingredient) => (
            <motion.span
              key={ingredient}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg border border-stone-200 text-sm text-stone-700 shadow-sm"
            >
              {ingredient}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeIngredient(ingredient)}
                  className="ml-0.5 p-0.5 hover:bg-stone-100 rounded transition-colors"
                >
                  <XMarkIcon className="w-3.5 h-3.5 text-stone-400 hover:text-stone-600" />
                </button>
              )}
            </motion.span>
          ))}
        </AnimatePresence>

        {!disabled && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addIngredient}
            placeholder={ingredients.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-400"
          />
        )}
      </div>
    </div>
  );
}

