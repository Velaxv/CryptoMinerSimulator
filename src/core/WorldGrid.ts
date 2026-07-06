export type EntityType = 'GENERATOR' | 'MINER' | 'FAN' | 'AC' | 'CABLE';

export interface Entity {
  id: string;
  type: EntityType;
  level: number;
  powerDraw: number;
  powerSupply: number;
  heatGen: number;
  coolingPower: number;
  hashrate: number;
  status: 'active' | 'throttled' | 'failed' | 'inactive';
  position: { x: number; y: number };
  connections: string[];
  
  // New fields for Improvement 1
  durability: number;
  maxDurability: number;
  wearRate: number;
  voltage: number;     // Actual volts received
  voltageClass: number;
  thermalInsulation: number;
  sectorId: number | null; // Power sector identifier
  powerNetwork: string | null; // connected power network id
}

export interface HeatCell {
  temperature: number;
  sources: string[];
  sinks: string[];
}

export interface PowerSector {
  id: number;
  generators: string[];
  consumers: string[];
  totalLoad: number;
  totalCapacity: number;
  averageVoltage: number;
}

export class WorldGrid {
  private cells: Map<string, Entity> = new Map();
  private heatMap: Map<string, HeatCell> = new Map();
  private sectors: Map<number, PowerSector> = new Map();
  private nextSectorId: number = 0;

  private getCoordKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  public setEntity(x: number, y: number, entity: Entity): void {
    this.cells.set(this.getCoordKey(x, y), entity);
    this.heatMap.set(this.getCoordKey(x, y), {
      temperature: 0,
      sources: [],
      sinks: []
    });
  }

  public getEntity(x: number, y: number): Entity | undefined {
    return this.cells.get(this.getCoordKey(x, y));
  }

  public removeEntity(x: number, y: number): void {
    const key = this.getCoordKey(x, y);
    this.cells.delete(key);
    this.heatMap.delete(key);
  }

  public getAllEntities(): Entity[] {
    return Array.from(this.cells.values());
  }

  public getHeatCell(x: number, y: number): HeatCell | undefined {
    return this.heatMap.get(this.getCoordKey(x, y));
  }

  public getAllHeatCells(): Map<string, HeatCell> {
    return this.heatMap;
  }

  public createSector(generatorId: string): number {
    const sectorId = this.nextSectorId++;
    this.sectors.set(sectorId, {
      id: sectorId,
      generators: [generatorId],
      consumers: [],
      totalLoad: 0,
      totalCapacity: 0,
      averageVoltage: 240
    });
    return sectorId;
  }

  public getSector(sectorId: number): PowerSector | undefined {
    return this.sectors.get(sectorId);
  }

  public getAllSectors(): PowerSector[] {
    return Array.from(this.sectors.values());
  }

  public assignToSector(entityId: string, sectorId: number, isGenerator: boolean): void {
    const sector = this.sectors.get(sectorId);
    if (!sector) return;

    if (isGenerator) {
      if (!sector.generators.includes(entityId)) {
        sector.generators.push(entityId);
      }
    } else {
      if (!sector.consumers.includes(entityId)) {
        sector.consumers.push(entityId);
      }
    }
  }

  public getNeighbors(x: number, y: number): Entity[] {
    const neighbors: Entity[] = [];
    const coords = [
      { x: x - 1, y }, { x: x + 1, y },
      { x, y: y - 1 }, { x, y: y + 1 }
    ];

    for (const coord of coords) {
      const entity = this.getEntity(coord.x, coord.y);
      if (entity) neighbors.push(entity);
    }

    return neighbors;
  }

  public clear(): void {
    this.cells.clear();
    this.heatMap.clear();
    this.sectors.clear();
    this.nextSectorId = 0;
  }
}

export const worldGrid = new WorldGrid();
