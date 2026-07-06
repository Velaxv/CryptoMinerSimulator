import { useGameStore } from '../store/useGameStore';
import type { Entity, HeatCell } from './WorldGrid';
import { worldGrid } from './WorldGrid';

export class Simulation {
  public static tick(): void {
    const store = useGameStore.getState();

    // 1. Power Distribution & Voltage Modeling
    this.processPowerGrid();

    // 2. Thermodynamics & Spatial Heat Diffusion
    this.processThermodynamics();

    // 3. Maintenance & Wear & Tear
    this.processMaintenance();

    // increment tick
    store.incrementTick();
  }

  private static processPowerGrid(): void {
    const entities = worldGrid.getAllEntities() as Entity[];
    const generators = entities.filter((e): e is Entity => e.type === 'GENERATOR');
    const consumers = entities.filter((e): e is Entity => e.type !== 'GENERATOR' && e.type !== 'CABLE');

    consumers.forEach((consumer) => {
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
        consumer.status = consumer.status === 'inactive' || consumer.status === 'failed' ? consumer.status : 'active';
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

    // 1. Clear and reset heat map sources/sinks
    allHeatCells.forEach((cell: HeatCell, key: string) => {
      newTemperatures.set(key, cell.temperature);
    });

    // 2. Apply heat generation and cooling to the map
    entities.forEach(entity => {
      if (entity.status === 'inactive' && entity.type !== 'GENERATOR') return;

      const key = `${entity.position.x},${entity.position.y}`;
      let cellTemp = newTemperatures.get(key) || 0;

      if (entity.type === 'FAN' || entity.type === 'AC') {
        cellTemp = Math.max(0, cellTemp - entity.coolingPower);
      } else {
        // Apply insulation to reduce heat impact
        const effectiveHeat = entity.heatGen * (1 - entity.thermalInsulation * 0.8);
        cellTemp += effectiveHeat;
      }

      newTemperatures.set(key, cellTemp);
    });

    // 3. Convection: heat rises (affects cells above)
    newTemperatures.forEach((temp, key) => {
      const [xStr, yStr] = key.split(',');
      const x = parseInt(xStr);
      const y = parseInt(yStr);
      
      // Heat rises to the cell above
      if (y > 0) {
        const aboveKey = `${x},${y - 1}`;
        const aboveTemp = newTemperatures.get(aboveKey) || 0;
        newTemperatures.set(aboveKey, aboveTemp + (temp * 0.1)); // 10% convection upward
      }
    });

    // 4. Apply calculated temperatures back and check thresholds
    newTemperatures.forEach((temp, key) => {
      const entity = worldGrid.getEntity(
        parseInt(key.split(',')[0]),
        parseInt(key.split(',')[1])
      );

      if (entity) {
        const effectiveTemp = temp * (1 - entity.thermalInsulation * 0.5);
        
        // Thermal Throttling at 80 degrees
        if (effectiveTemp > 80 && entity.status === 'active') {
          entity.status = 'throttled';
        }
        // Critical failure at 150 degrees
        if (effectiveTemp > 150) {
          entity.status = 'failed';
          entity.durability = Math.max(0, entity.durability - 10);
        }
      }
    });

    // Update heat map in WorldGrid
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
        // Cables degrade based on heat
        const cell = worldGrid.getHeatCell(entity.position.x, entity.position.y);
        const heatFactor = cell ? Math.max(1, cell.temperature / 50) : 1;
        entity.durability -= entity.wearRate * heatFactor;
      } else if (entity.type !== 'GENERATOR') {
        // Miners, Fans, AC degrade faster if throttled or high heat
        let degradation = entity.wearRate;
        
        if (entity.status === 'throttled') {
          degradation *= 1.5;
        }
        if (entity.status === 'active') {
          degradation *= 1.2;
        }

        const cell = worldGrid.getHeatCell(entity.position.x, entity.position.y);
        const heatFactor = cell ? Math.max(1, cell.temperature / 80) : 1;
        
        entity.durability -= degradation * heatFactor;
      }

      // Critical failure if durability depletes
      if (entity.durability <= 0) {
        entity.durability = 0;
        entity.status = 'failed';
        useGameStore.getState().addFiat(-entity.durability); // Cost of damage
      }
    });
  }
}
