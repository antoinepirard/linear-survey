import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { Recipe, Fridge } from '@/app/side-projects/recipe-checker/_types';

// Old keys (before per-user migration)
const OLD_RECIPES_KEY = 'recipe-checker:recipes';
const OLD_FRIDGE_KEY = 'recipe-checker:fridge';

// POST to migrate old global data to a specific userId
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    // Read old global data
    const oldRecipes = await kv.get<Recipe[]>(OLD_RECIPES_KEY);
    const oldFridge = await kv.get<Fridge>(OLD_FRIDGE_KEY);

    if (!oldRecipes && !oldFridge) {
      return NextResponse.json(
        { error: 'No old data found to migrate' },
        { status: 404 }
      );
    }

    // New user-specific keys
    const newRecipesKey = `recipe-checker:${userId}:recipes`;
    const newFridgeKey = `recipe-checker:${userId}:fridge`;

    // Copy to new keys
    if (oldRecipes) {
      await kv.set(newRecipesKey, oldRecipes);
    }
    if (oldFridge) {
      await kv.set(newFridgeKey, oldFridge);
    }

    return NextResponse.json({
      success: true,
      message: 'Data migrated successfully!',
      userId,
      recipesMigrated: oldRecipes?.length || 0,
      fridgeIngredientsMigrated: oldFridge?.ingredients?.length || 0,
    });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json(
      { error: 'Failed to migrate data', details: String(error) },
      { status: 500 }
    );
  }
}

// GET to check if old data exists
export async function GET() {
  try {
    const oldRecipes = await kv.get<Recipe[]>(OLD_RECIPES_KEY);
    const oldFridge = await kv.get<Fridge>(OLD_FRIDGE_KEY);

    return NextResponse.json({
      hasOldData: (oldRecipes?.length || 0) > 0 || (oldFridge?.ingredients?.length || 0) > 0,
      oldRecipesCount: oldRecipes?.length || 0,
      oldFridgeIngredientsCount: oldFridge?.ingredients?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check old data', details: String(error) },
      { status: 500 }
    );
  }
}

