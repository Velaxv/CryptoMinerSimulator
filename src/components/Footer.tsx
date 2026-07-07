import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  const logs = [
    'System initialized successfully',
    'Generator gen-1 started',
    'Grid powered: 240V nominal',
    'Simulation running at 1x speed'
  ];

  return (
    <footer className="h-10 bg-[#111A21] border-t border-[#263840] flex items-center px-4 gap-4 flex-shrink-0">
      {/* Event Log */}
      <div className="flex-1 flex items-center gap-2 overflow-hidden">
        <span className="text-[10px] text-[#475569] uppercase font-medium whitespace-nowrap">Log:</span>
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          {logs.map((log, index) => (
            <span key={index} className="text-xs text-[#94A3B8] whitespace-nowrap">
              [{new Date().toLocaleTimeString()}] {log}
            </span>
          ))}
        </div>
      </div>

      {/* Global Warnings */}
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-[#FB923C]" />
        <span className="text-xs text-[#FB923C]">System nominal</span>
      </div>

      {/* Mini Status */}
      <div className="flex items-center gap-2 text-[#475569] text-xs">
        <span>Grid: 10×10</span>
        <span>•</span>
        <span>Entities: 4</span>
      </div>
    </footer>
  );
};
