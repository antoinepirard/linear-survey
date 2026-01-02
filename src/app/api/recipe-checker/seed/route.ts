import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { Recipe, Fridge } from '@/app/side-projects/recipe-checker/_types';

const RECIPES_KEY = 'recipe-checker:recipes';
const FRIDGE_KEY = 'recipe-checker:fridge';

// Your existing data from the JSON file
const existingData = {
  recipes: [
    {
      id: 'recipe_1767348871928_vpcdxr8sw',
      name: 'Chicon Gratin',
      ingredients: ['Chicon', 'Milk', 'Butter', 'Ham'],
      tags: [],
    },
    {
      id: 'recipe_1767348871929_test123',
      name: 'Pasta Carbonara',
      ingredients: ['Pasta', 'Eggs', 'Bacon', 'Parmesan'],
      tags: [],
    },
    {
      id: 'recipe_1767349864943_5y87ne4p5',
      name: 'Spaghetti bolognese',
      ingredients: ['Celery', 'Carrots', 'Haché', 'Passata', 'Onions', 'Garlic'],
      tags: [],
    },
    {
      id: 'recipe_1767351276856_afiv35i5x',
      name: 'Meat Loaf',
      ingredients: ['Haché', 'Onions', 'Eggs', 'Milk'],
      tags: [],
    },
    {
      id: 'recipe_1767351481627_u7abn4bxz',
      name: 'Stoemp',
      ingredients: ['Potatoes', 'Milk', 'Carrots', 'Leeks', 'Butter', 'Onions', 'Garlic', 'Lardons'],
      tags: [],
    },
  ] as Recipe[],
  fridge: {
    ingredients: ['Carrots', 'Pasta', 'Eggplant'],
  } as Fridge,
};

// POST to seed the database (hit this once to migrate your data)
export async function POST() {
  try {
    // Check if data already exists
    const existingRecipes = await kv.get<Recipe[]>(RECIPES_KEY);
    
    if (existingRecipes && existingRecipes.length > 0) {
      return NextResponse.json(
        { 
          message: 'Data already exists in KV. Delete existing data first if you want to reseed.',
          recipeCount: existingRecipes.length 
        },
        { status: 409 }
      );
    }

    // Seed recipes
    await kv.set(RECIPES_KEY, existingData.recipes);
    
    // Seed fridge
    await kv.set(FRIDGE_KEY, existingData.fridge);

    return NextResponse.json({
      success: true,
      message: 'Data seeded successfully!',
      recipesSeeded: existingData.recipes.length,
      fridgeIngredientsSeeded: existingData.fridge.ingredients.length,
    });
  } catch (error) {
    console.error('Seeding failed:', error);
    return NextResponse.json(
      { error: 'Failed to seed data', details: String(error) },
      { status: 500 }
    );
  }
}

// GET to check current KV status
export async function GET() {
  try {
    const recipes = await kv.get<Recipe[]>(RECIPES_KEY);
    const fridge = await kv.get<Fridge>(FRIDGE_KEY);

    return NextResponse.json({
      recipesCount: recipes?.length || 0,
      fridgeIngredientsCount: fridge?.ingredients?.length || 0,
      hasData: (recipes?.length || 0) > 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check KV status', details: String(error) },
      { status: 500 }
    );
  }
}

