"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { Fridge } from "../_types";
import { normalizeIngredient } from "../_utils/matching";

interface FridgeTabProps {
  fridge: Fridge;
  recipeIngredients: string[]; // All unique ingredients from recipes
  onUpdateFridge: (ingredients: string[]) => Promise<void>;
  isSaving: boolean;
}

export function FridgeTab({
  fridge,
  recipeIngredients,
  onUpdateFridge,
  isSaving,
}: FridgeTabProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get suggestions based on input - fuzzy match against recipe ingredients
  const suggestions = useMemo(() => {
    if (!inputValue.trim()) return [];

    const normalizedInput = normalizeIngredient(inputValue);
    const normalizedFridge = fridge.ingredients.map(normalizeIngredient);

    return recipeIngredients
      .filter((ingredient) => {
        const normalizedIngredient = normalizeIngredient(ingredient);
        // Don't suggest items already in fridge
        if (normalizedFridge.includes(normalizedIngredient)) return false;
        // Match if ingredient contains the input or starts with it
        return (
          normalizedIngredient.includes(normalizedInput) ||
          normalizedIngredient.startsWith(normalizedInput) ||
          // Fuzzy: check if input letters appear in order
          fuzzyMatch(normalizedInput, normalizedIngredient)
        );
      })
      .slice(0, 6); // Limit to 6 suggestions
  }, [inputValue, recipeIngredients, fridge.ingredients]);

  // Simple fuzzy matching - checks if input chars appear in order
  function fuzzyMatch(input: string, target: string): boolean {
    let inputIdx = 0;
    for (let i = 0; i < target.length && inputIdx < input.length; i++) {
      if (target[i] === input[inputIdx]) {
        inputIdx++;
      }
    }
    return inputIdx === input.length && input.length >= 2;
  }

  const addIngredient = useCallback(
    async (ingredient?: string) => {
      const toAdd = ingredient || inputValue.trim();
      if (toAdd && !fridge.ingredients.includes(toAdd)) {
        await onUpdateFridge([...fridge.ingredients, toAdd]);
        setInputValue("");
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    },
    [inputValue, fridge.ingredients, onUpdateFridge]
  );

  const removeIngredient = useCallback(
    async (ingredient: string) => {
      await onUpdateFridge(fridge.ingredients.filter((i) => i !== ingredient));
    },
    [fridge.ingredients, onUpdateFridge]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        addIngredient(suggestions[selectedIndex]);
      } else {
        addIngredient();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  return (
    <div className="space-y-6">
      {/* Add Ingredient Input */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="What's in your fridge?"
            className="flex-1 px-4 py-3 bg-white rounded-xl ring-1 ring-stone-300/30 shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-800 transition-all text-stone-900 placeholder:text-stone-400"
            disabled={isSaving}
            autoComplete="off"
          />
          <button
            onClick={() => addIngredient()}
            disabled={!inputValue.trim() || isSaving}
            className="px-4 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-xl transition-colors disabled:opacity-10 disabled:cursor-not-allowed"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 left-0 right-14 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden"
          >
            <div className="py-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => addIngredient(suggestion)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    index === selectedIndex
                      ? "bg-stone-100 text-stone-900"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <HighlightMatch text={suggestion} query={inputValue} />
                </button>
              ))}
            </div>
            <div className="px-4 py-2 bg-stone-50 border-t border-slate-200">
              <p className="text-xs text-stone-400">
                From your recipes • ↑↓ to navigate • Enter to select
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Ingredient Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {fridge.ingredients.map((ingredient) => (
          <div
            key={ingredient}
            className="group flex items-center justify-between px-3 py-2.5 bg-white rounded-xl ring-1 ring-stone-300/30 shadow-sm transition-shadow"
          >
            <span className="text-sm text-stone-700 truncate">
              {ingredient}
            </span>
            <button
              onClick={() => removeIngredient(ingredient)}
              disabled={isSaving}
              className="ml-2 p-1 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all disabled:cursor-not-allowed"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {fridge.ingredients.length === 0 && (
        <div className="text-center py-12 text-stone-400">
          <p>Your fridge is empty. Add some ingredients!</p>
        </div>
      )}

      {fridge.ingredients.length > 0 && (
        <div className="pt-4 border-t border-stone-100">
          <p className="text-sm text-stone-500">
            {fridge.ingredients.length} ingredient
            {fridge.ingredients.length !== 1 ? "s" : ""} in your fridge
          </p>
        </div>
      )}
    </div>
  );
}

// Highlight matching parts of the suggestion
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = text.toLowerCase();
  const index = normalizedText.indexOf(normalizedQuery);

  if (index === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <span className="font-semibold text-stone-900">
        {text.slice(index, index + query.length)}
      </span>
      {text.slice(index + query.length)}
    </>
  );
}
