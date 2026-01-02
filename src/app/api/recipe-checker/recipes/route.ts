import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { Recipe } from '@/app/side-projects/recipe-checker/_types';

const RECIPES_KEY = 'recipe-checker:recipes';

async function getRecipes(): Promise<Recipe[]> {
  const recipes = await kv.get<Recipe[]>(RECIPES_KEY);
  return recipes || [];
}

async function setRecipes(recipes: Recipe[]): Promise<void> {
  await kv.set(RECIPES_KEY, recipes);
}

function generateId(): string {
  return `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// GET all recipes
export async function GET() {
  const recipes = await getRecipes();
  return NextResponse.json(recipes);
}

// POST create new recipe
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, ingredients, tags } = body;

  if (!name || !ingredients || !Array.isArray(ingredients)) {
    return NextResponse.json(
      { error: 'Name and ingredients are required' },
      { status: 400 }
    );
  }

  const recipes = await getRecipes();
  const newRecipe: Recipe = {
    id: generateId(),
    name,
    ingredients,
    tags: tags || [],
  };

  recipes.push(newRecipe);
  await setRecipes(recipes);

  return NextResponse.json(newRecipe, { status: 201 });
}

// PUT update existing recipe
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, name, ingredients, tags } = body;

  if (!id) {
    return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
  }

  const recipes = await getRecipes();
  const recipeIndex = recipes.findIndex((r) => r.id === id);

  if (recipeIndex === -1) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  recipes[recipeIndex] = {
    ...recipes[recipeIndex],
    ...(name && { name }),
    ...(ingredients && { ingredients }),
    ...(tags !== undefined && { tags }),
  };

  await setRecipes(recipes);
  return NextResponse.json(recipes[recipeIndex]);
}

// DELETE recipe
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
  }

  const recipes = await getRecipes();
  const recipeIndex = recipes.findIndex((r) => r.id === id);

  if (recipeIndex === -1) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  recipes.splice(recipeIndex, 1);
  await setRecipes(recipes);

  return NextResponse.json({ success: true });
}
