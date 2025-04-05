import * as THREE from "three";
import { SpawnPoint } from "./spawn-point";

export class Scenario {
  private readonly id: string;
  private readonly name!: string;
  private readonly default: boolean = false;
  private readonly spawnAlways: boolean = false;
  private readonly invisible: boolean = false;
  private readonly descriptionTitle!: string;
  private readonly descriptionContent!: string;

  private rootNode: THREE.Object3D;
  private spawnPoints: SpawnPoint[] = [];
  private initialCameraAngle!: number;

  constructor(root: THREE.Object3D) {
    this.rootNode = root;
    this.id = root.name;


    // Loading Scenario Data
    if (root.userData.hasOwnProperty('name')) {
      this.name = root.userData.name;
    }
    if (root.userData.hasOwnProperty('default') && root.userData.default === 'true') {
      this.default = true;
    }
    if (root.userData.hasOwnProperty('spawn_always') && root.userData.spawn_always === 'true') {
      this.spawnAlways = true;
    }
    if (root.userData.hasOwnProperty('invisible') && root.userData.invisible === 'true') {
      this.invisible = true;
    }
    if (root.userData.hasOwnProperty('desc_title')) {
      this.descriptionTitle = root.userData.desc_title;
    }
    if (root.userData.hasOwnProperty('desc_content')) {
      this.descriptionContent = root.userData.desc_content;
    }
    if (root.userData.hasOwnProperty('camera_angle')) {
      this.initialCameraAngle = root.userData.camera_angle;
    }

    root.traverse((child: THREE.Object3D<THREE.Object3DEventMap>) => {
      if (child.hasOwnProperty('userData') && child.userData.hasOwnProperty('data')) {
        if (child.userData.data === 'spawn') {
          if (child.userData.type === 'player') {
            const sp = new SpawnPoint(child);
            this.spawnPoints.push(sp);
          }
        }
      }
    })
  }

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getDefault() {
    return this.default;
  }

  public getSpawnAlways() {
    return this.spawnAlways;
  }

  public isInvisible() {
    return this.invisible;
  }

  public getDescriptionTitle() {
    return this.descriptionTitle;
  }

  public getDescriptionContent() {
    return this.descriptionContent;
  }

  public getRootNode() {
    return this.rootNode;
  }

  public getSpawnPoints() {
    return this.spawnPoints;
  }

  public getInitialCameraAngle() {
    return this.initialCameraAngle;
  }
}