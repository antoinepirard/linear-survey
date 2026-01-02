import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { RecipeCheckerData } from '@/app/side-projects/recipe-checker/_types';

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

// GET fridge contents
export async function GET() {
  const data = await readData();
  return NextResponse.json(data.fridge);
}

// PUT update fridge contents
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { ingredients } = body;

  if (!ingredients || !Array.isArray(ingredients)) {
    return NextResponse.json(
      { error: 'Ingredients array is required' },
      { status: 400 }
    );
  }

  const data = await readData();
  data.fridge.ingredients = ingredients;
  await writeData(data);

  return NextResponse.json(data.fridge);
}

