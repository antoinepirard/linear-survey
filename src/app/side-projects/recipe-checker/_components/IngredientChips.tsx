'use client';

import { useState, useCallback, KeyboardEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';

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
    <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl focus-within:bg-slate-100 transition-colors min-h-[48px]">
      {ingredients.map((ingredient) => (
        <span
          key={ingredient}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg text-sm text-slate-700"
        >
          {ingredient}
          {!disabled && (
            <button
              type="button"
              onClick={() => removeIngredient(ingredient)}
              className="p-0.5 hover:bg-slate-100 rounded transition-colors"
            >
              <XMarkIcon className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </span>
      ))}

      {!disabled && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addIngredient}
          placeholder={ingredients.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
        />
      )}
    </div>
  );
}

