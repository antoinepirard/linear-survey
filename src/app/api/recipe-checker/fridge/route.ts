import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { Fridge } from '@/app/side-projects/recipe-checker/_types';

function getFridgeKey(userId: string): string {
  return `recipe-checker:${userId}:fridge`;
}

async function getFridge(userId: string): Promise<Fridge> {
  const fridge = await kv.get<Fridge>(getFridgeKey(userId));
  return fridge || { ingredients: [] };
}

async function setFridge(userId: string, fridge: Fridge): Promise<void> {
  await kv.set(getFridgeKey(userId), fridge);
}

// GET fridge contents
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const fridge = await getFridge(userId);
  return NextResponse.json(fridge);
}

// PUT update fridge contents
export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const body = await request.json();
  const { ingredients } = body;

  if (!ingredients || !Array.isArray(ingredients)) {
    return NextResponse.json(
      { error: 'Ingredients array is required' },
      { status: 400 }
    );
  }

  const fridge: Fridge = { ingredients };
  await setFridge(userId, fridge);

  return NextResponse.json(fridge);
}
