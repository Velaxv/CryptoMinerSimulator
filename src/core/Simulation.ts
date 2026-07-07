import { useGameStore } from '../store/useGameStore';
import type { Entity, HeatCell } from './WorldGrid';
import { worldGrid } from './WorldGrid';

export class Simulation {
  public static tick(): void {
    const store = useGameStore.getState();

    this.processPowerGrid();
    this.processThermodynamics();
    this.processMaintenance();
    this.processMining();
    this.processOperatingCost();

    store.incrementTick();
  }

  private static processPowerGrid(): void {
    const entities = worldGrid.getAllEntities() as Entity[];
    const generators = entities.filter((e): e is Entity => e.type === 'GENERATOR');
    const consumers = entities.filter((e): e is Entity => e.type !== 'GENERATOR' && e.type !== 'CABLE');

    consumers.forEach((consumer) => {
      if (consumer.status === 'failed') {
        consumer.voltage = 0;
        return;
      }

      const cx = consumer.position.x;
      const cy = consumer.position.y;

      let nearestGen: Entity | undefined;
      let minDist = Infinity;

      for (const gen of generators) {
        const d = Math.abs(gen.position.x - cx) + Math.abs(gen.position.y - cy);
        if (d < minDist) {
          minDist = d;
          nearestGen = gen;
        }
      }

      if (!nearestGen) {
        consumer.voltage = 0;
        consumer.status = 'inactive';
        return;
      }

      let voltage = nearestGen.voltageClass - minDist * 1.5;
      if (voltage < 0) voltage = 0;
      consumer.voltage = voltage;

      if (voltage >= consumer.voltageClass * 0.9) {
        consumer.status = 'active';
      } else if (voltage >= consumer.voltageClass * 0.5) {
        consumer.status = 'throttled';
      } else {
        consumer.status = 'inactive';
      }
    });
  }

  private static processThermodynamics(): void {
    const allHeatCells = worldGrid.getAllHeatCells();
    const entities = worldGrid.getAllEntities() as Entity[];
    const newTemperatures = new Map<string, number>();

    allHeatCells.forEach((cell: HeatCell, key: string) => {
      newTemperatures.set(key, cell.temperature);
    });

    entities.forEach(entity => {
      if (entity.status === 'inactive' && entity.type !== 'GENERATOR') return;
      if (entity.status === 'failed') return;

      const key = `${entity.position.x},${entity.position.y}`;
      let cellTemp = newTemperatures.get(key) || 0;

      if (entity.type === 'FAN' || entity.type === 'AC') {
        cellTemp = Math.max(0, cellTemp - entity.coolingPower);
      } else {
        const effectiveHeat = entity.heatGen * (1 - entity.thermalInsulation * 0.8);
        cellTemp += effectiveHeat;
      }

      newTemperatures.set(key, cellTemp);
    });

    newTemperatures.forEach((temp, key) => {
      const [xStr, yStr] = key.split(',');
      const x = parseInt(xStr);
      const y = parseInt(yStr);

      if (y > 0) {
        const aboveKey = `${x},${y - 1}`;
        const aboveTemp = newTemperatures.get(aboveKey) || 0;
        newTemperatures.set(aboveKey, aboveTemp + (temp * 0.1));
      }
    });

    newTemperatures.forEach((temp, key) => {
      const [xStr, yStr] = key.split(',');
      const x = parseInt(xStr);
      const y = parseInt(yStr);
      const entity = worldGrid.getEntity(x, y);

      if (!entity) return;
      if (entity.status === 'failed') return;

      const effectiveTemp = temp * (1 - entity.thermalInsulation * 0.5);

      if (effectiveTemp > 80 && entity.status === 'active') {
        entity.status = 'throttled';
      }
      if (effectiveTemp > 150) {
        entity.status = 'failed';
        entity.durability = Math.max(0, entity.durability - 10);
      }
    });

    newTemperatures.forEach((temp, key) => {
      const [xStr, yStr] = key.split(',');
      const x = parseInt(xStr);
      const y = parseInt(yStr);
      const cell = worldGrid.getHeatCell(x, y);
      if (cell) {
        cell.temperature = temp;
      }
    });
  }

  private static processMaintenance(): void {
    const entities = worldGrid.getAllEntities() as Entity[];

    entities.forEach((entity) => {
      if (entity.type === 'CABLE') {
        const cell = worldGrid.getHeatCell(entity.position.x, entity.position.y);
        const heatFactor = cell ? Math.max(1, cell.temperature / 50) : 1;
        entity.durability -= entity.wearRate * heatFactor;
      } else if (entity.type !== 'GENERATOR') {
        let degradation = entity.wearRate;

        if (entity.status === 'throttled') {
          degradation *= 1.5;
        } else if (entity.status === 'active') {
          degradation *= 1.2;
        }

        const cell = worldGrid.getHeatCell(entity.position.x, entity.position.y);
        const heatFactor = cell ? Math.max(1, cell.temperature / 80) : 1;

        entity.durability -= degradation * heatFactor;
      }

      if (entity.durability <= 0) {
        entity.durability = 0;
        entity.status = 'failed';
        console.warn(`Entity ${entity.id} failed (durability depleted)`);
      }
    });
  }

  private static processMining(): void {
    const store = useGameStore.getState();
    const entities = worldGrid.getAllEntities() as Entity[];

    entities.forEach((entity) => {
      if (entity.type !== 'MINER') return;
      if (entity.hashrate <= 0) return;

      const statusMul =
        entity.status === 'active' ? 1.0 :
        entity.status === 'throttled' ? 0.4 :
        0;

      if (statusMul > 0) {
        const mined = entity.hashrate * statusMul * 0.000001;
        store.addCrypto('BTC', mined);
      }
    });
  }

  private static processOperatingCost(): void {
    const store = useGameStore.getState();
    const entities = worldGrid.getAllEntities() as Entity[];
    let totalCost = 0;

    entities.forEach((entity) => {
      if (entity.type === 'GENERATOR' || entity.type === 'CABLE') return;
      if (entity.status === 'active') totalCost += 0.05;
      else if (entity.status === 'throttled') totalCost += 0.02;
    });

    if (totalCost > 0) store.addFiat(-totalCost);
  }
}
