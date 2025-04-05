import { Logger } from "@/common/logger";
import * as CANNON from "cannon-es";

export class Physics {
  private readonly physicsWorld: CANNON.World;
  private readonly logger: Logger;
  private readonly parallelPairs: []
  private readonly physicsFrameRate: number;
  private readonly physicsFrameTime: number;
  private readonly physicsMaxPrediction: number;

  constructor() {
    this.logger = new Logger("driftzone::physics-engine");

    // Physics
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.gravity.set(0, -9.81, 0);
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    (this.physicsWorld.solver as CANNON.GSSolver).iterations = 10;
    this.physicsWorld.allowSleep = true;

    this.parallelPairs = [];
    this.physicsFrameRate = 60;
    this.physicsFrameTime = 1 / this.physicsFrameRate;
    this.physicsMaxPrediction = this.physicsFrameRate;
  }

  public update(dt: number): void {
    const fixedTimeStep = this.physicsFrameTime / 60.0;

    // Step the physics world
    this.physicsWorld.step(fixedTimeStep, dt)
  }


  public getPhysicsLogger() {
    return this.logger;
  }

  public getParallelPairs() {
    return this.parallelPairs;
  }

  public getPhysicsFrameRate() {
    return this.physicsFrameRate;
  }

  public getPhysicsFrameTime() {
    return this.physicsFrameTime;
  }

  public getPhysicsMaxPrediction() {
    return this.physicsMaxPrediction;
  }
}
