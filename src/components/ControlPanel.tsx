import React from 'react';
import { gameEngine } from '../core/GameEngine';
import { useGameStore } from '../store/useGameStore';

export const ControlPanel: React.FC = () => {
  const setGameSpeed = useGameStore((state) => state.setGameSpeed);
  const gameSpeed = useGameStore((state) => state.gameSpeed);

  return (
    <div className="bg-slate-800 p-4 border-r border-slate-700 w-64 flex flex-col gap-6 font-mono">
      <h2 className="text-slate-300 uppercase text-xs font-bold tracking-widest">System Control</h2>
      
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => gameEngine.start()}
          className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded transition-colors text-sm font-bold uppercase"
        >
          Start Engine
        </button>
        <button 
          onClick={() => gameEngine.stop()}
          className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded transition-colors text-sm font-bold uppercase"
        >
          Stop Engine
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-slate-400 text-xs uppercase">Simulation Speed</label>
        <div className="flex gap-2">
          {[1, 2, 5].map(speed => (
            <button 
              key={speed}
              onClick={() => setGameSpeed(speed)}
              className={`py-1 px-3 rounded text-xs font-bold transition-all ${gameSpeed === speed ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
