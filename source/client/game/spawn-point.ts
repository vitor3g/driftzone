import * as THREE from "three";
import type { ISpawnPoint } from "../interfaces/spawn-point";

export class SpawnPoint implements ISpawnPoint {
  private object: THREE.Object3D;

  constructor(object: THREE.Object3D) {
    this.object = object;
  }

  public getSpawnChild(): THREE.Object3D<THREE.Object3DEventMap> {
    return this.object;
  }
}