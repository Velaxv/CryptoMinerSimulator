import { create } from 'zustand';
import type { EntityType } from '../core/WorldGrid';

export type CurrencyID = 'BTC' | 'ETH' | 'SOL';

export interface GameState {
  tick: number;
  gameSpeed: number;
  selectedEntityType: EntityType | null;
  resources: {
    fiat: number;
    crypto: Record<CurrencyID, number>;
    researchData: number;
  };
}

interface GameStore extends GameState {
  // Actions
  incrementTick: () => void;
  setGameSpeed: (speed: number) => void;
  setSelectedEntityType: (type: EntityType | null) => void;
  addFiat: (amount: number) => void;
  addCrypto: (currency: CurrencyID, amount: number) => void;
  addResearchData: (amount: number) => void;
  updateResources: (resources: Partial<GameState['resources']>) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  tick: 0,
  gameSpeed: 1,
  selectedEntityType: null,
  resources: {
    fiat: 10000, // Starting cash
    crypto: {
      BTC: 0,
      ETH: 0,
      SOL: 0,
    },
    researchData: 0,
  },

  incrementTick: () => set((state) => ({ tick: state.tick + 1 })),
  setGameSpeed: (speed) => set({ gameSpeed: speed }),
  setSelectedEntityType: (type) => set({ selectedEntityType: type }),
  addFiat: (amount) => 
    set((state) => ({ 
      resources: { ...state.resources, fiat: state.resources.fiat + amount } 
    })),
  addCrypto: (currency, amount) => 
    set((state) => ({ 
      resources: { 
        ...state.resources, 
        crypto: { ...state.resources.crypto, [currency]: state.resources.crypto[currency] + amount } 
      } 
    })),
  addResearchData: (amount) => 
    set((state) => ({ 
      resources: { ...state.resources, researchData: state.resources.researchData + amount } 
    })),
  updateResources: (updates) => 
    set((state) => ({ 
      resources: { ...state.resources, ...updates } 
    })),
}));
