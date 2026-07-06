import { useState, useEffect } from 'react';
import type { Entity } from '../core/WorldGrid';
import { worldGrid } from '../core/WorldGrid';
import { useGameStore } from '../store/useGameStore';
import { BUILDING_DATA } from '../core/BuildingData';

const CELL_SIZE = 56;

export const GameGrid = () => {
  const { selectedEntityType, resources, addFiat } = useGameStore();
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCellClick = (x: number, y: number) => {
    if (!selectedEntityType) return;

    const existingEntity = worldGrid.getEntity(x, y);
    if (existingEntity) {
      alert('Célula já ocupada!');
      return;
    }

    const spec = BUILDING_DATA[selectedEntityType];
    if (resources.fiat < spec.cost) {
      alert('Fundos insuficientes!');
      return;
    }

    worldGrid.setEntity(x, y, {
      id: `${selectedEntityType}-${Date.now()}`,
      type: selectedEntityType,
      level: 1,
      powerDraw: spec.powerDraw,
      powerSupply: spec.powerSupply,
      heatGen: spec.heatGen,
      coolingPower: spec.coolingPower,
      hashrate: spec.hashrate,
      status: 'active',
      position: { x, y },
      connections: [],
      durability: spec.durability,
      maxDurability: spec.durability,
      wearRate: spec.wearRate,
      voltage: 0,
      voltageClass: spec.voltageClass,
      thermalInsulation: spec.thermalInsulation,
      sectorId: null,
      powerNetwork: null,
    });

    addFiat(-spec.cost);
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-auto p-6 relative">
      <div
        className="grid gap-1 bg-slate-900 p-1 border border-slate-800 inline-grid"
        style={{
          gridTemplateColumns: `repeat(10, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(10, ${CELL_SIZE}px)`,
        }}
      >
        {Array.from({ length: 100 }).map((_, i) => {
          const x = i % 10;
          const y = Math.floor(i / 10);
          const entity = worldGrid.getEntity(x, y);

  const durabilityPercent = entity ? entity.durability / entity.maxDurability : 0;

          return (
            <div
              key={`${x},${y}`}
              onClick={() => handleCellClick(x, y)}
              className={`border relative overflow-hidden cursor-crosshair transition-colors duration-500 ${
                entity ? 'border-blue-500' : 'border-slate-800'
              }`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: entity ? getEntityColor(entity) : selectedEntityType ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                boxShadow: selectedEntityType && !entity ? 'inset 0 0 8px rgba(59, 130, 246, 0.15)' : 'none',
              }}
            >
              {entity && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-slate-100">
                  <span className="text-[10px] font-bold uppercase leading-none">{entity.type[0]}</span>
                  <span className={`text-[8px] leading-none mt-1 ${getStatusColor(entity.status)}`}>{entity.status}</span>

                  <span className="mt-1 text-[8px] text-slate-300">{Math.round(entity.voltage)}V</span>

                  <div className="absolute bottom-1 left-1 right-1 h-1 bg-slate-800">
                    <div
                      className="h-full bg-emerald-400"
                      style={{ width: `${durabilityPercent * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

function getEntityColor(entity: Entity) {
  switch (entity.type) {
    case 'GENERATOR':
      return 'rgba(34, 197, 94, 0.18)';
    case 'MINER':
      return 'rgba(249, 115, 22, 0.18)';
    case 'FAN':
      return 'rgba(59, 130, 246, 0.18)';
    case 'AC':
      return 'rgba(30, 64, 175, 0.18)';
    default:
      return 'rgba(148, 163, 184, 0.18)';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'text-emerald-400';
    case 'throttled':
      return 'text-amber-400';
    case 'failed':
      return 'text-red-500';
    case 'inactive':
      return 'text-slate-500';
    default:
      return 'text-slate-300';
  }
}
