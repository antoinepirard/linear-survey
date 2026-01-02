import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { Fridge } from '@/app/side-projects/recipe-checker/_types';

const FRIDGE_KEY = 'recipe-checker:fridge';

async function getFridge(): Promise<Fridge> {
  const fridge = await kv.get<Fridge>(FRIDGE_KEY);
  return fridge || { ingredients: [] };
}

async function setFridge(fridge: Fridge): Promise<void> {
  await kv.set(FRIDGE_KEY, fridge);
}

// GET fridge contents
export async function GET() {
  const fridge = await getFridge();
  return NextResponse.json(fridge);
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

  const fridge: Fridge = { ingredients };
  await setFridge(fridge);

  return NextResponse.json(fridge);
}
