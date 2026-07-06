import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { BUILDING_DATA } from '../core/BuildingData';
import type { EntityType } from '../core/WorldGrid';

export const BuildMenu: React.FC = () => {
  const { selectedEntityType, setSelectedEntityType, resources } = useGameStore();

  return (
    <div className="bg-slate-800 p-4 border-r border-slate-700 w-64 flex flex-col gap-6 font-mono">
      <h2 className="text-slate-300 uppercase text-xs font-bold tracking-widest">Build Menu</h2>
      
      <div className="flex flex-col gap-3">
        {(Object.keys(BUILDING_DATA) as EntityType[]).map((type) => {
          const spec = BUILDING_DATA[type];
          const canAfford = resources.fiat >= spec.cost;
          const isSelected = selectedEntityType === type;

          return (
            <button
              key={type}
              onClick={() => setSelectedEntityType(type)}
              className={`flex flex-col p-3 rounded border transition-all text-left ${
                isSelected 
                  ? 'border-blue-500 bg-blue-900/30 ring-1 ring-blue-500' 
                  : 'border-slate-700 bg-slate-900 hover:bg-slate-800'
              } ${!canAfford ? 'opacity-50 grayscale' : ''}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-100 font-bold text-sm">{spec.name}</span>
                <span className={`text-xs font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                  ${spec.cost}
                </span>
              </div>
              <span className="text-slate-400 text-[10px] leading-tight">
                {spec.description}
              </span>
            </button>
          );
        })}
      </div>

      {selectedEntityType && (
        <button 
          onClick={() => setSelectedEntityType(null)}
          className="text-slate-500 hover:text-slate-300 text-xs uppercase text-center py-2 transition-colors"
        >
          Cancel Selection
        </button>
      )}
    </div>
  );
};
