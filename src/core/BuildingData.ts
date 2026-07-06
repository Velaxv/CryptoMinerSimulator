import type { EntityType } from './WorldGrid.ts';

export interface BuildingSpec {
  name: string;
  cost: number;
  powerDraw: number;
  powerSupply: number;
  heatGen: number;
  coolingPower: number;
  hashrate: number;
  description: string;
  durability: number;
  wearRate: number;
  maintenanceCost: number;
  voltageClass: 12 | 24 | 48 | 120 | 240; // Volts classes
  thermalInsulation: number; // 0=bare metal, 1=max insulation
}

export const BUILDING_DATA: Record<EntityType, BuildingSpec> = {
  GENERATOR: {
    name: 'Power Generator',
    cost: 2000,
    powerDraw: 0,
    powerSupply: 5000,
    heatGen: 10,
    coolingPower: 0,
    hashrate: 0,
    description: 'Provides electricity to the grid.',
    durability: 5000,
    wearRate: 0.02,
    maintenanceCost: 50,
    voltageClass: 240,
    thermalInsulation: 0.2
  },
  MINER: {
    name: 'ASIC Miner',
    cost: 500,
    powerDraw: 1200,
    powerSupply: 0,
    heatGen: 50,
    coolingPower: 0,
    hashrate: 100,
    description: 'Generates BTC using high power.',
    durability: 3000,
    wearRate: 0.05,
    maintenanceCost: 20,
    voltageClass: 240,
    thermalInsulation: 0.1
  },
  FAN: {
    name: 'Cooling Fan',
    cost: 100,
    powerDraw: 100,
    powerSupply: 0,
    heatGen: 2,
    coolingPower: 60,
    hashrate: 0,
    description: 'Lowers heat in the cell.',
    durability: 2000,
    wearRate: 0.03,
    maintenanceCost: 5,
    voltageClass: 12,
    thermalInsulation: 0
  },
  AC: {
    name: 'Industrial AC',
    cost: 1500,
    powerDraw: 800,
    powerSupply: 0,
    heatGen: 20,
    coolingPower: 300,
    hashrate: 0,
    description: 'Heavy duty cooling for large racks.',
    durability: 4000,
    wearRate: 0.04,
    maintenanceCost: 35,
    voltageClass: 240,
    thermalInsulation: 0.3
  },
  CABLE: {
    name: 'Power Cable',
    cost: 10,
    powerDraw: 0,
    powerSupply: 0,
    heatGen: 0,
    coolingPower: 0,
    hashrate: 0,
    description: 'Connects power sources to machines.',
    durability: 1000,
    wearRate: 0.01,
    maintenanceCost: 1,
    voltageClass: 24,
    thermalInsulation: 0.5
  }
};
