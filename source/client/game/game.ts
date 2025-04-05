import { CameraOperator } from "../core/camera-operator";
import { InputManager } from "../core/input-manager";
import { Physics } from "../physics/physics";
import { Sky } from "./sky";

export class Game {
  private readonly inputManager: InputManager;
  private readonly physics: Physics;
  private readonly cameraOperator: CameraOperator;
  private readonly sky: Sky;


  constructor() {
    this.inputManager = new InputManager();
    this.physics = new Physics();
    this.cameraOperator = new CameraOperator(g_core.getGraphics().getRenderer().camera, 1, 1);
    this.sky = new Sky();

    g_core.getTickManager().subscribe('game-loop', this.update.bind(this));
  }


  public getCameraOperator() {
    return this.cameraOperator;
  }

  public getSky() {
    return this.sky;
  }

  public update(dt: number) {
    this.physics.update(dt);
  }

  public getInputManager() {
    return this.inputManager;
  }


  public getPhysics() {
    return this.physics;
  }
}
