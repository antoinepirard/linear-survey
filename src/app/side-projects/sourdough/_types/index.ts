export type FlourType = 't65' | 'bread' | 'whole_wheat' | 'rye' | 'spelt';

export interface FlourConfig {
  id: FlourType;
  label: string;
  defaultHydration: number;
  minHydration: number;
  maxHydration: number;
}

export interface DoughInputs {
  targetWeight: number; // grams
  flourType: FlourType;
  hydration: number; // percentage (e.g., 75 for 75%)
  starterPercentage: number; // percentage
  saltPercentage: number; // percentage
}

export interface DoughRecipe {
  flour: number; // grams
  water: number; // grams
  starter: number; // grams
  salt: number; // grams
  totalWeight: number; // grams
}

export const FLOUR_CONFIGS: Record<FlourType, FlourConfig> = {
  t65: {
    id: 't65',
    label: 'T65',
    defaultHydration: 72,
    minHydration: 65,
    maxHydration: 80,
  },
  bread: {
    id: 'bread',
    label: 'Bread Flour',
    defaultHydration: 70,
    minHydration: 65,
    maxHydration: 78,
  },
  whole_wheat: {
    id: 'whole_wheat',
    label: 'Whole Wheat',
    defaultHydration: 80,
    minHydration: 75,
    maxHydration: 90,
  },
  rye: {
    id: 'rye',
    label: 'Rye',
    defaultHydration: 85,
    minHydration: 75,
    maxHydration: 95,
  },
  spelt: {
    id: 'spelt',
    label: 'Spelt',
    defaultHydration: 68,
    minHydration: 60,
    maxHydration: 75,
  },
};

