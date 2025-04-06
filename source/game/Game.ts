import * as pc from "playcanvas";
import { CameraComponent, CameraComponentProps } from "./entities/CameraComponent";
import { CameraEntity } from "./entities/CameraEntity";
import { CameraFlyScript, type CameraFlyScriptProps } from "./entities/CameraFlyScript";

export class Game {
  constructor() {
    this._createDefaultLight();
    this._createWhiteFloor();

    const defaultCamera = new CameraEntity({});

    defaultCamera.setPosition(new pc.Vec3(0, 5, 10));
    defaultCamera.lookAt(new pc.Vec3(0, 0, 0));


    defaultCamera.addComponent<CameraComponentProps>(CameraComponent, {
      clearColor: new pc.Color(0.1, 0.1, 0.1),
      farClip: 1000,
      nearClip: 0.1
    });


    defaultCamera.addScript<CameraFlyScriptProps>(CameraFlyScript, {
      speed: 10,
      lookSpeed: 0.02,
      yaw: 0,
      pitch: 0,
      moveForward: true,
      moveBackward: true,
      moveLeft: true,
      moveRight: true
    });

    defaultCamera.addToRoot();
  }

  public update() {
  }

  private _createDefaultLight() {
    const light = new pc.Entity("DirectionalLight");
    light.addComponent("light", {
      type: "directional",
      color: new pc.Color(1, 1, 1),
      intensity: 1.2,
      castShadows: true,
      shadowBias: 0.2,
      shadowDistance: 50,
    });

    light.setEulerAngles(45, 45, 0);
    g_core.getApplication().getApplication().root.addChild(light);
  }


  private _createWhiteFloor() {
    const floor = new pc.Entity('WhiteFloor');

    floor.addComponent('model', {
      type: 'plane',
    });

    const material = new pc.StandardMaterial();
    material.diffuse = new pc.Color(1, 1, 1);
    material.update();

    floor.model!.material = material;

    floor.setLocalScale(10, 1, 10);
    floor.setPosition(0, 0, 0);

    g_core.getApplication().getApplication().root.addChild(floor);
  }
}
