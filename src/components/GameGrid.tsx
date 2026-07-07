import { useState, useEffect } from 'react';
import type { Entity } from '../core/WorldGrid';
import { worldGrid } from '../core/WorldGrid';
import { useGameStore } from '../store/useGameStore';
import { BUILDING_DATA } from '../core/BuildingData';
import { Zap, Flame, Wind, Snowflake, Pickaxe } from 'lucide-react';

const CELL_SIZE = 64;

interface GameGridProps {
  onEntitySelect: (entity: Entity) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({ onEntitySelect }) => {
  const { selectedEntityType, resources, addFiat } = useGameStore();
  const [, setTick] = useState(0);
  const [placedCells, setPlacedCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCellClick = (x: number, y: number) => {
    const entity = worldGrid.getEntity(x, y);
    if (entity) {
      onEntitySelect(entity);
      return;
    }

    if (!selectedEntityType) return;

    const spec = BUILDING_DATA[selectedEntityType];
    if (resources.fiat < spec.cost) {
      alert('Fundos insuficientes!');
      return;
    }

    const newEntity: Entity = {
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
    };

    worldGrid.setEntity(x, y, newEntity);
    addFiat(-spec.cost);
    
    // Track newly placed cells for animation
    const cellKey = `${x}-${y}`;
    setPlacedCells(prev => new Set(prev).add(cellKey));
    setTimeout(() => {
      setPlacedCells(prev => {
        const next = new Set(prev);
        next.delete(cellKey);
        return next;
      });
    }, 500);
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'GENERATOR': return <Zap className="w-5 h-5 text-[#4ADE80] animate-pulse-subtle" />;
      case 'MINER': return <Pickaxe className="w-5 h-5 text-[#FB923C]" />;
      case 'FAN': return <Wind className="w-5 h-5 text-[#60A5FA] animate-spin-slow" />;
      case 'AC': return <Snowflake className="w-5 h-5 text-[#22D3EE] animate-spin-slow" />;
      default: return <Flame className="w-5 h-5 text-[#94A3B8]" />;
    }
  };

  const getStatusDot = (status: 'active' | 'throttled' | 'failed' | 'inactive' | string) => {
    const colors: Record<string, string> = {
      active: 'bg-[#4ADE80] shadow-[0_0_6px_rgba(74,222,128,0.6)]',
      throttled: 'bg-[#FB923C] shadow-[0_0_6px_rgba(251,146,60,0.6)]',
      failed: 'bg-[#F87171] shadow-[0_0_6px_rgba(248,113,113,0.6)]',
      inactive: 'bg-[#475569]'
    };
    return colors[status] || colors.inactive;
  };

  const getStatusGlow = (status: string) => {
    switch (status) {
      case 'active': return 'shadow-[0_0_15px_rgba(74,222,128,0.15)]';
      case 'throttled': return 'shadow-[0_0_15px_rgba(251,146,60,0.15)]';
      case 'failed': return 'shadow-[0_0_15px_rgba(248,113,113,0.15)] animate-pulse-critical';
      default: return '';
    }
  };

  return (
    <div className="flex-1 bg-[#0B1215] overflow-auto p-4 lg:p-8 relative bg-grid-blueprint">
      {/* Zoom Controls */}
      <div className="fixed bottom-16 right-4 z-10 flex flex-col gap-2">
        <button 
          className="w-8 h-8 rounded bg-[#1E293B] border border-[#263840] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          title="Zoom Out"
        >
          −
        </button>
        <button 
          className="w-8 h-8 rounded bg-[#1E293B] border border-[#263840] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          title="Zoom In"
        >
          +
        </button>
      </div>

      <div
        className="grid gap-1 bg-[#111A21] p-2 border border-[#263840] rounded-lg inline-grid shadow-[0_0_20px_rgba(0,0,0,0.3)] animate-pop-in"
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
          const cellKey = `${x}-${y}`;
          const isNewlyPlaced = placedCells.has(cellKey);

          return (
            <div
              key={`${x},${y}`}
              onClick={() => handleCellClick(x, y)}
              className={`border relative overflow-hidden cursor-crosshair transition-all duration-300 hover:border-[#3B82F6]/50 ${
                entity ? 'border-[#263840]' : 'border-[#263840]/50'
              } ${isNewlyPlaced ? 'animate-pop-in' : ''} ${entity ? getStatusGlow(entity.status) : ''}`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: entity ? getEntityColor(entity) : selectedEntityType ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                boxShadow: selectedEntityType && !entity ? 'inset 0 0 12px rgba(59, 130, 246, 0.2)' : 'none',
              }}
            >
              {entity && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-1.5">
                  {/* Status Dot */}
                  <div className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${getStatusDot(entity.status)}`} />
                  
                  {/* Icon */}
                  {getEntityIcon(entity.type)}
                  
                  {/* Type Label */}
                  <span className="text-[9px] font-bold uppercase text-[#F8FAFC] mt-1 leading-none">
                    {entity.type[0]}
                  </span>
                  
                  {/* Voltage */}
                  <span className="text-[8px] text-[#94A3B8] mt-0.5 font-mono">
                    {Math.round(entity.voltage)}V
                  </span>

                  {/* Durability Bar */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 h-1 bg-[#263840] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        durabilityPercent < 0.2 ? 'bg-[#F87171]' : durabilityPercent < 0.5 ? 'bg-[#FB923C]' : 'bg-[#4ADE80]'
                      }`}
                      style={{ width: `${durabilityPercent * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Empty cell hover effect */}
              {!entity && selectedEntityType && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <div className="w-8 h-8 border-2 border-dashed border-[#3B82F6]/30 rounded animate-pulse-subtle" />
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
      return 'rgba(74, 222, 128, 0.1)';
    case 'MINER':
      return 'rgba(251, 146, 60, 0.1)';
    case 'FAN':
      return 'rgba(96, 165, 250, 0.1)';
    case 'AC':
      return 'rgba(34, 211, 238, 0.1)';
    default:
      return 'rgba(148, 163, 184, 0.1)';
  }
}
