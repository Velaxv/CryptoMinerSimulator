import React from 'react';
import type { Entity } from '../core/WorldGrid';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Zap, Thermometer, Hash, DollarSign, ArrowUp, Trash2, Wrench } from 'lucide-react';

interface InspectorProps {
  entity: Entity | null;
  onClose: () => void;
}

export const Inspector: React.FC<InspectorProps> = ({ entity, onClose }) => {
  if (!entity) {
    return (
      <div className="w-80 bg-[#111A21] border-l border-[#263840] flex flex-col">
        <div className="p-4 border-b border-[#263840]">
          <h2 className="text-[#F8FAFC] font-bold text-sm uppercase tracking-wider">Inspector</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-[#475569] text-sm text-center">Select an entity on the grid to inspect</p>
        </div>
      </div>
    );
  }

  const durabilityPercent = (entity.durability / entity.maxDurability) * 100;

  return (
    <div className="w-80 bg-[#111A21] border-l border-[#263840] flex flex-col">
      <div className="p-4 border-b border-[#263840] flex items-center justify-between">
        <h2 className="text-[#F8FAFC] font-bold text-sm uppercase tracking-wider">Inspector</h2>
        <button onClick={onClose} className="text-[#475569] hover:text-[#F8FAFC] transition-colors">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Header Info */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[#F8FAFC] font-bold">{entity.type} #{entity.id.split('-')[1]}</h3>
            <p className="text-[#475569] text-xs">ID: {entity.id}</p>
          </div>
          <Badge variant={entity.status === 'active' ? 'green' : entity.status === 'throttled' ? 'orange' : 'red'}>
            {entity.status}
          </Badge>
        </div>

        {/* Stats Grid */}
        <Card className="p-3 space-y-3">
          <h4 className="text-[#475569] text-xs uppercase font-medium">Technical Data</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#60A5FA]" />
              <div>
                <p className="text-[10px] text-[#475569] uppercase">Voltage</p>
                <p className="text-sm text-[#F8FAFC] font-mono">{Math.round(entity.voltage)}V</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-[#FB923C]" />
              <div>
                <p className="text-[10px] text-[#475569] uppercase">Heat Gen</p>
                <p className="text-sm text-[#F8FAFC] font-mono">{entity.heatGen}W</p>
              </div>
            </div>
            {entity.hashrate > 0 && (
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#22D3EE]" />
                <div>
                  <p className="text-[10px] text-[#475569] uppercase">Hashrate</p>
                  <p className="text-sm text-[#F8FAFC] font-mono">{entity.hashrate} H/s</p>
                </div>
              </div>
            )}
            {entity.powerDraw > 0 && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#4ADE80]" />
                <div>
                  <p className="text-[10px] text-[#475569] uppercase">Power Draw</p>
                  <p className="text-sm text-[#F8FAFC] font-mono">{entity.powerDraw}W</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Durability */}
        <Card className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[#475569] text-xs uppercase font-medium">Durability</h4>
            <span className={`text-xs font-mono ${durabilityPercent < 20 ? 'text-[#F87171]' : durabilityPercent < 50 ? 'text-[#FB923C]' : 'text-[#4ADE80]'}`}>
              {Math.round(durabilityPercent)}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#263840] rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                durabilityPercent < 20 ? 'bg-[#F87171]' : durabilityPercent < 50 ? 'bg-[#FB923C]' : 'bg-[#4ADE80]'
              }`}
              style={{ width: `${durabilityPercent}%` }}
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="secondary" size="sm" className="w-full">
            <ArrowUp className="w-4 h-4" />
            Upgrade
          </Button>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" className="flex-1">
              <Wrench className="w-4 h-4" />
              Repair
            </Button>
            <Button variant="danger" size="sm" className="flex-1">
              <Trash2 className="w-4 h-4" />
              Demolish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
