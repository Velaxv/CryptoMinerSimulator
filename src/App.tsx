import { useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ControlPanel } from './components/ControlPanel';
import { BuildMenu } from './components/BuildMenu';
import { GameGrid } from './components/GameGrid';
import { gameEngine } from './core/GameEngine';
import { worldGrid } from './core/WorldGrid';

// Função para criar o cenário inicial para teste
const seedWorld = () => {
  worldGrid.clear();
  
  // Gerador de Energia
  worldGrid.setEntity(0, 0, {
    id: 'gen-1',
    type: 'GENERATOR',
    level: 1,
    powerDraw: 0,
    powerSupply: 5000,
    heatGen: 10,
    coolingPower: 0,
    hashrate: 0,
    status: 'active',
    position: { x: 0, y: 0 },
    connections: [],
    durability: 5000,
    maxDurability: 5000,
    wearRate: 0.02,
    voltage: 240,
    voltageClass: 240,
    thermalInsulation: 0.2,
    sectorId: null,
    powerNetwork: null
  });

  // Mineradores
  worldGrid.setEntity(1, 0, {
    id: 'miner-1',
    type: 'MINER',
    level: 1,
    powerDraw: 1200,
    powerSupply: 0,
    heatGen: 50,
    coolingPower: 0,
    hashrate: 100,
    status: 'active',
    position: { x: 1, y: 0 },
    connections: ['gen-1'],
    durability: 3000,
    maxDurability: 3000,
    wearRate: 0.05,
    voltage: 240,
    voltageClass: 240,
    thermalInsulation: 0.1,
    sectorId: null,
    powerNetwork: null
  });

  worldGrid.setEntity(1, 1, {
    id: 'miner-2',
    type: 'MINER',
    level: 1,
    powerDraw: 1200,
    powerSupply: 0,
    heatGen: 50,
    coolingPower: 0,
    hashrate: 100,
    status: 'active',
    position: { x: 1, y: 1 },
    connections: ['gen-1'],
    durability: 3000,
    maxDurability: 3000,
    wearRate: 0.05,
    voltage: 240,
    voltageClass: 240,
    thermalInsulation: 0.1,
    sectorId: null,
    powerNetwork: null
  });

  // Ventoinha
  worldGrid.setEntity(0, 1, {
    id: 'fan-1',
    type: 'FAN',
    level: 1,
    powerDraw: 100,
    powerSupply: 0,
    heatGen: 2,
    coolingPower: 60,
    hashrate: 0,
    status: 'active',
    position: { x: 0, y: 1 },
    connections: ['gen-1'],
    durability: 2000,
    maxDurability: 2000,
    wearRate: 0.03,
    voltage: 12,
    voltageClass: 12,
    thermalInsulation: 0,
    sectorId: null,
    powerNetwork: null
  });
};

function App() {
  useEffect(() => {
    seedWorld();
    gameEngine.start();
    
    return () => {
      gameEngine.stop();
    };
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-950 text-slate-100">
      <Dashboard />
      <div className="flex flex-1 overflow-hidden">
        <ControlPanel />
        <BuildMenu />
        <GameGrid />
      </div>
    </div>
  );
}

export default App;
