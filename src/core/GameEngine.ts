import { Simulation } from './Simulation';

class GameEngine {
  private static instance: GameEngine;
  private isRunning: boolean = false;
  private lastTimestamp: number = 0;
  private accumulator: number = 0;
  private tickRate: number = 1000; // 1 second per tick

  private constructor() {}

  public static getInstance(): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine();
    }
    return GameEngine.instance;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    requestAnimationFrame(this.loop);
    console.log('Game Engine Started');
  }

  public stop(): void {
    this.isRunning = false;
    console.log('Game Engine Stopped');
  }

  private loop = (timestamp: number): void => {
    if (!this.isRunning) return;

    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Apply game speed multiplier from store (if we want speed-up)
    // We can fetch it here via Zustand getState()
    this.accumulator += deltaTime;

    while (this.accumulator >= this.tickRate) {
      Simulation.tick();
      this.accumulator -= this.tickRate;
    }

    requestAnimationFrame(this.loop);
  };
}

export const gameEngine = GameEngine.getInstance();
