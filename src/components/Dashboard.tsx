import { useGameStore } from '../store/useGameStore';

export const Dashboard = () => {
  const { resources, tick } = useGameStore();

  return (
    <div className="bg-slate-900 text-slate-100 p-4 border-b border-slate-700 flex justify-between items-center font-mono text-sm">
      <div className="flex gap-8">
        <div className="flex flex-col">
          <span className="text-slate-400 uppercase text-xs">Cash (FIAT)</span>
          <span className="text-green-400 text-lg font-bold">
            ${resources.fiat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 uppercase text-xs">Bitcoin (BTC)</span>
          <span className="text-orange-400 text-lg font-bold">{resources.crypto.BTC.toFixed(6)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 uppercase text-xs">Research</span>
          <span className="text-purple-400 text-lg font-bold">{resources.researchData.toFixed(0)}</span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-slate-400 uppercase text-xs">System Tick</span>
        <div className="text-xl font-bold text-slate-100">{tick}</div>
      </div>
    </div>
  );
};
