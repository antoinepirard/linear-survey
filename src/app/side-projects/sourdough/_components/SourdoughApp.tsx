"use client";

import { useState, useMemo } from "react";
import { ScaleIcon } from "@heroicons/react/24/outline";
import { FlourType, FLOUR_CONFIGS, DoughInputs } from "../_types";
import { calculateDoughRecipe } from "../_utils/calculations";

const FLOUR_TYPES = Object.values(FLOUR_CONFIGS);

export function SourdoughApp() {
  const [targetWeight, setTargetWeight] = useState(1000);
  const [flourType, setFlourType] = useState<FlourType>("t65");
  const [hydration, setHydration] = useState(FLOUR_CONFIGS.t65.defaultHydration);
  const [starterPercentage, setStarterPercentage] = useState(20);
  const [saltPercentage, setSaltPercentage] = useState(2);

  const flourConfig = FLOUR_CONFIGS[flourType];

  // Calculate recipe whenever inputs change
  const recipe = useMemo(() => {
    const inputs: DoughInputs = {
      targetWeight,
      flourType,
      hydration,
      starterPercentage,
      saltPercentage,
    };
    return calculateDoughRecipe(inputs);
  }, [targetWeight, flourType, hydration, starterPercentage, saltPercentage]);

  // Update hydration when flour type changes
  const handleFlourTypeChange = (newFlourType: FlourType) => {
    setFlourType(newFlourType);
    const newConfig = FLOUR_CONFIGS[newFlourType];
    // Clamp current hydration to new flour's range
    if (hydration < newConfig.minHydration) {
      setHydration(newConfig.minHydration);
    } else if (hydration > newConfig.maxHydration) {
      setHydration(newConfig.maxHydration);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 py-8 md:py-16">
      <div className="max-w-lg mx-auto px-4">
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-amber-700"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C8.5 2 5.5 3.5 4 6c-1.5 2.5-1 5.5.5 7.5 1 1.5 2 2.5 2 4.5v2c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2v-2c0-2 1-3 2-4.5 1.5-2 2-5-.5-7.5C17.5 3.5 15.5 2 12 2zm-2.5 4c.83 0 1.5.67 1.5 1.5S10.33 9 9.5 9 8 8.33 8 7.5 8.67 6 9.5 6zm5 0c.83 0 1.5.67 1.5 1.5S15.33 9 14.5 9 13 8.33 13 7.5s.67-1.5 1.5-1.5zM12 11c1.38 0 2.5.9 2.5 2h-5c0-1.1 1.12-2 2.5-2z" />
            </svg>
          </div>
        </div>

        {/* Inputs Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          {/* Target Weight */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-3">
              <ScaleIcon className="w-4 h-4" />
              Target Dough Weight
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="250"
                max="2000"
                step="50"
                value={targetWeight}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className="flex-1 h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-stone-900"
              />
              <div className="w-20 text-right">
                <span className="text-xl font-semibold text-stone-900 tabular-nums">
                  {targetWeight}
                </span>
                <span className="text-stone-500 text-sm ml-0.5">g</span>
              </div>
            </div>
          </div>

          {/* Flour Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Flour Type
            </label>
            <div className="flex flex-wrap gap-2">
              {FLOUR_TYPES.map((flour) => (
                <button
                  key={flour.id}
                  onClick={() => handleFlourTypeChange(flour.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    flourType === flour.id
                      ? "bg-stone-900 text-white shadow-md"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {flour.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hydration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Hydration
            </label>
            <p className="text-xs text-stone-400 mb-3">
              Recommended: {flourConfig.minHydration}–{flourConfig.maxHydration}% for {flourConfig.label}
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={flourConfig.minHydration}
                max={flourConfig.maxHydration}
                step="1"
                value={hydration}
                onChange={(e) => setHydration(Number(e.target.value))}
                className="flex-1 h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-stone-900"
              />
              <div className="w-16 text-right">
                <span className="text-xl font-semibold text-stone-900 tabular-nums">
                  {hydration}
                </span>
                <span className="text-stone-500 text-sm ml-0.5">%</span>
              </div>
            </div>
          </div>

          {/* Starter Percentage */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Starter
            </label>
            <p className="text-xs text-stone-400 mb-3">
              Active sourdough starter at 100% hydration
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="40"
                step="1"
                value={starterPercentage}
                onChange={(e) => setStarterPercentage(Number(e.target.value))}
                className="flex-1 h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-stone-900"
              />
              <div className="w-16 text-right">
                <span className="text-xl font-semibold text-stone-900 tabular-nums">
                  {starterPercentage}
                </span>
                <span className="text-stone-500 text-sm ml-0.5">%</span>
              </div>
            </div>
          </div>

          {/* Salt Percentage */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Salt
            </label>
            <p className="text-xs text-stone-400 mb-3">
              Standard range: 1.8–2.2%
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1.5"
                max="2.5"
                step="0.1"
                value={saltPercentage}
                onChange={(e) => setSaltPercentage(Number(e.target.value))}
                className="flex-1 h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-stone-900"
              />
              <div className="w-16 text-right">
                <span className="text-xl font-semibold text-stone-900 tabular-nums">
                  {saltPercentage}
                </span>
                <span className="text-stone-500 text-sm ml-0.5">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-medium text-stone-500 mb-4 uppercase tracking-wide">
            Your Recipe
          </h2>
          
          <div className="space-y-4">
            <RecipeRow label="Flour" value={recipe.flour} unit="g" accent />
            <RecipeRow label="Water" value={recipe.water} unit="g" />
            <RecipeRow label="Starter" value={recipe.starter} unit="g" />
            <RecipeRow label="Salt" value={recipe.salt} unit="g" />
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-stone-700">Total</span>
              <div>
                <span className="text-2xl font-bold text-stone-900 tabular-nums">
                  {recipe.totalWeight}
                </span>
                <span className="text-stone-500 ml-1">g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-stone-400 mt-6">
          Baker&apos;s percentages based on flour weight
        </p>
      </div>
    </div>
  );
}

interface RecipeRowProps {
  label: string;
  value: number;
  unit: string;
  accent?: boolean;
}

function RecipeRow({ label, value, unit, accent }: RecipeRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-stone-600">{label}</span>
      <div className={accent ? "bg-amber-50 px-3 py-1 rounded-lg" : ""}>
        <span
          className={`text-lg font-semibold tabular-nums ${
            accent ? "text-amber-700" : "text-stone-900"
          }`}
        >
          {value}
        </span>
        <span className={`text-sm ml-0.5 ${accent ? "text-amber-600" : "text-stone-500"}`}>
          {unit}
        </span>
      </div>
    </div>
  );
}

