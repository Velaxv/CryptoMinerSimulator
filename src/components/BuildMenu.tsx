import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { BUILDING_DATA } from '../core/BuildingData';
import type { EntityType } from '../core/WorldGrid';
import { Zap, Pickaxe, Wind, Snowflake, Search, X } from 'lucide-react';

type CategoryKey = 'POWER' | 'MINING' | 'COOLING' | 'HVAC';

const categoryIcons: Record<CategoryKey, React.JSX.Element> = {
  POWER: <Zap className="w-4 h-4" />,
  MINING: <Pickaxe className="w-4 h-4" />,
  COOLING: <Wind className="w-4 h-4" />,
  HVAC: <Snowflake className="w-4 h-4" />,
};

const getCategory = (type: EntityType): string => {
  switch (type) {
    case 'GENERATOR': return 'POWER';
    case 'MINER': return 'MINING';
    case 'FAN': return 'COOLING';
    case 'AC': return 'HVAC';
    default: return 'OTHER';
  }
};

export const BuildMenu: React.FC = () => {
  const { selectedEntityType, setSelectedEntityType, resources } = useGameStore();
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['ALL', 'POWER', 'MINING', 'COOLING'];

  const filteredTypes = (Object.keys(BUILDING_DATA) as EntityType[]).filter((type) => {
    const spec = BUILDING_DATA[type];
    const matchesTab = activeTab === 'ALL' || getCategory(type) === activeTab;
    const matchesSearch = spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          spec.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-72 bg-[#111A21] border-r border-[#263840] flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-[#263840]">
        <h2 className="text-[#F8FAFC] font-bold text-sm uppercase tracking-wider mb-3">Build Menu</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
          <input
            type="text"
            placeholder="Search blueprints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1E293B] border border-[#263840] rounded-md pl-9 pr-3 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#3B82F6] transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#F8FAFC]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#263840] px-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2.5 text-xs font-medium font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab 
                ? 'border-[#3B82F6] text-[#3B82F6]' 
                : 'border-transparent text-[#475569] hover:text-[#94A3B8]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredTypes.map((type) => {
          const spec = BUILDING_DATA[type];
          const canAfford = resources.fiat >= spec.cost;
          const isSelected = selectedEntityType === type;

          return (
            <button
              key={type}
              onClick={() => setSelectedEntityType(isSelected ? null : type)}
              className={`w-full flex flex-col p-3 rounded-lg border text-left transition-all duration-200 ${
                isSelected 
                  ? 'border-[#3B82F6] bg-[#3B82F6]/10 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                  : 'border-[#263840] bg-[#1E293B]/50 hover:bg-[#1E293B] hover:border-[#334155]'
              } ${!canAfford ? 'opacity-60 grayscale' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {(() => {
                    const cat = getCategory(type) as CategoryKey;
                    return categoryIcons[cat] || categoryIcons.POWER;
                  })()}
                  <span className="text-[#F8FAFC] font-bold text-sm">{spec.name}</span>
                </div>
                <span className={`text-xs font-mono font-bold ${canAfford ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                  ${spec.cost.toLocaleString()}
                </span>
              </div>
              
              <p className="text-[10px] text-[#94A3B8] leading-tight mb-2">
                {spec.description}
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-3 text-[10px] text-[#475569]">
                {spec.powerDraw > 0 && (
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {spec.powerDraw}W
                  </span>
                )}
                {spec.hashrate > 0 && (
                  <span className="flex items-center gap-1">
                    <Pickaxe className="w-3 h-3" />
                    {spec.hashrate} H/s
                  </span>
                )}
                {spec.coolingPower > 0 && (
                  <span className="flex items-center gap-1">
                    <Wind className="w-3 h-3" />
                    {spec.coolingPower} CFM
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {selectedEntityType && (
        <div className="p-3 border-t border-[#263840]">
          <button 
            onClick={() => setSelectedEntityType(null)}
            className="w-full py-2 text-xs uppercase text-[#475569] hover:text-[#F8FAFC] transition-colors flex items-center justify-center gap-1"
          >
            <X className="w-3 h-3" />
            Cancel Selection
          </button>
        </div>
      )}
    </div>
  );
};
