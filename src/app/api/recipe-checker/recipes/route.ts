import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { RecipeCheckerData, Recipe } from '@/app/side-projects/recipe-checker/_types';

const DATA_FILE = path.join(process.cwd(), 'data', 'recipe-checker.json');

async function readData(): Promise<RecipeCheckerData> {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { recipes: [], fridge: { ingredients: [] } };
  }
}

async function writeData(data: RecipeCheckerData): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateId(): string {
  return `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// GET all recipes
export async function GET() {
  const data = await readData();
  return NextResponse.json(data.recipes);
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

  const data = await readData();
  const newRecipe: Recipe = {
    id: generateId(),
    name,
    ingredients,
    tags: tags || [],
  };

  data.recipes.push(newRecipe);
  await writeData(data);

  return NextResponse.json(newRecipe, { status: 201 });
}

// PUT update existing recipe
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, name, ingredients, tags } = body;

  if (!id) {
    return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
  }

  const data = await readData();
  const recipeIndex = data.recipes.findIndex((r) => r.id === id);

  if (recipeIndex === -1) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  data.recipes[recipeIndex] = {
    ...data.recipes[recipeIndex],
    ...(name && { name }),
    ...(ingredients && { ingredients }),
    ...(tags !== undefined && { tags }),
  };

  await writeData(data);
  return NextResponse.json(data.recipes[recipeIndex]);
}

// DELETE recipe
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
  }

  const data = await readData();
  const recipeIndex = data.recipes.findIndex((r) => r.id === id);

  if (recipeIndex === -1) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  data.recipes.splice(recipeIndex, 1);
  await writeData(data);

  return NextResponse.json({ success: true });
}

