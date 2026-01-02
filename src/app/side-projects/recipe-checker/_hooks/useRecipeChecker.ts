'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Recipe, Fridge, MatchResult } from '../_types';
import { getMatchResults } from '../_utils/matching';

interface UseRecipeCheckerReturn {
  // Data
  recipes: Recipe[];
  fridge: Fridge;
  matchResults: MatchResult[];

  // Loading states
  isLoading: boolean;
  isSaving: boolean;

  // Recipe operations
  addRecipe: (
    name: string,
    ingredients: string[],
    tags?: string[]
  ) => Promise<void>;
  updateRecipe: (recipe: Recipe) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;

  // Fridge operations
  updateFridge: (ingredients: string[]) => Promise<void>;
  addFridgeIngredient: (ingredient: string) => Promise<void>;
  removeFridgeIngredient: (ingredient: string) => Promise<void>;

  // Refresh
  refresh: () => Promise<void>;
}

export function useRecipeChecker(): UseRecipeCheckerReturn {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [fridge, setFridge] = useState<Fridge>({ ingredients: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Compute match results whenever recipes or fridge changes
  const matchResults = getMatchResults(recipes, fridge);

  // Fetch all data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [recipesRes, fridgeRes] = await Promise.all([
        fetch('/api/recipe-checker/recipes'),
        fetch('/api/recipe-checker/fridge'),
      ]);

      if (recipesRes.ok) {
        const recipesData = await recipesRes.json();
        setRecipes(recipesData);
      }

      if (fridgeRes.ok) {
        const fridgeData = await fridgeRes.json();
        setFridge(fridgeData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Recipe operations
  const addRecipe = useCallback(
    async (name: string, ingredients: string[], tags?: string[]) => {
      setIsSaving(true);
      try {
        const res = await fetch('/api/recipe-checker/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, ingredients, tags }),
        });

        if (res.ok) {
          const newRecipe = await res.json();
          setRecipes((prev) => [...prev, newRecipe]);
        }
      } catch (error) {
        console.error('Failed to add recipe:', error);
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const updateRecipe = useCallback(async (recipe: Recipe) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/recipe-checker/recipes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
      });

      if (res.ok) {
        const updatedRecipe = await res.json();
        setRecipes((prev) =>
          prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
        );
      }
    } catch (error) {
      console.error('Failed to update recipe:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteRecipe = useCallback(async (id: string) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/recipe-checker/recipes?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setRecipes((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Fridge operations
  const updateFridge = useCallback(async (ingredients: string[]) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/recipe-checker/fridge', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      if (res.ok) {
        const updatedFridge = await res.json();
        setFridge(updatedFridge);
      }
    } catch (error) {
      console.error('Failed to update fridge:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const addFridgeIngredient = useCallback(
    async (ingredient: string) => {
      const newIngredients = [...fridge.ingredients, ingredient];
      await updateFridge(newIngredients);
    },
    [fridge.ingredients, updateFridge]
  );

  const removeFridgeIngredient = useCallback(
    async (ingredient: string) => {
      const newIngredients = fridge.ingredients.filter((i) => i !== ingredient);
      await updateFridge(newIngredients);
    },
    [fridge.ingredients, updateFridge]
  );

  return {
    recipes,
    fridge,
    matchResults,
    isLoading,
    isSaving,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    updateFridge,
    addFridgeIngredient,
    removeFridgeIngredient,
    refresh: fetchData,
  };
}

