import * as THREE from "three";

export interface ISpawnPoint {
  getSpawnChild(): THREE.Object3D<THREE.Object3DEventMap>
}