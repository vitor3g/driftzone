import * as pc from "playcanvas";
import { CameraComponent, type CameraComponentProps } from "./components/shared/CameraComponent";
import { CameraEntity } from "./entities/CameraEntity";
import { FollowCameraScript, type FollowCameraProps } from "./scripts/shared/FollowCameraScript";

export class Game {
  private box!: pc.Entity;

  constructor() {}

  public async start() {
    this._createDefaultLight();
    this._createWhiteFloor();
    this._createBoxesAround();

    this.box = this._createBox();

    const defaultCamera = new CameraEntity({});

    defaultCamera.addScript<FollowCameraProps>(FollowCameraScript, {
      target: this.box,
      height: 1.5,
      distance: 10,
      sensitivity: 0.15,
    });

    defaultCamera.addComponent<CameraComponentProps>(CameraComponent, {
      clearColor: new pc.Color(0.1, 0.1, 0.1),
      farClip: 1000,
      nearClip: 0.1
    });

    defaultCamera.addToRoot();
  }

  public update() {}

  private _createBox(): pc.Entity {
    const app = g_core.getApplication().getApplication();

    const box = new pc.Entity("PlayerBox");

    box.addComponent("model", { type: "box" });

    box.addComponent("rigidbody", {
      type: "dynamic",
      mass: 1,
      friction: 0.5,
      restitution: 0.1,
    });

    box.addComponent("collision", {
      type: "box",
      halfExtents: new pc.Vec3(0.5, 0.5, 0.5),
    });

    box.setLocalScale(1, 1, 1);
    box.setPosition(0, 5, 0);

    app.root.addChild(box);

    return box;
  }

  private _createDefaultLight() {
    const light = new pc.Entity("DirectionalLight");
    light.addComponent("light", {
      type: "directional",
      color: new pc.Color(1, 1, 1),
      intensity: 1.2,
      castShadows: false,
      shadowBias: 0.2,
      shadowDistance: 50,
    });

    light.setEulerAngles(45, 45, 0);
    g_core.getApplication().getApplication().root.addChild(light);
  }

  private _createBoxesAround() {
    const app = g_core.getApplication().getApplication();

    const textureAsset = new pc.Asset("generic_dev04", "texture", {
      url: "/data/materials/generic_dev04.png",
    });

    textureAsset.ready(() => {
      const material = new pc.StandardMaterial();
      material.diffuseMap = textureAsset.resource as pc.Texture;
      material.update();

      const boxCount = 10;
      const radius = 20;

      for (let i = 0; i < boxCount; i++) {
        const angle = (i / boxCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const box = new pc.Entity(`Box_${i}`);
        box.addComponent("model", { type: "box" });

        box.addComponent("rigidbody", {
          type: "dynamic",
          mass: 1,
          friction: 0.5,
          restitution: 0.1,
        });

        box.addComponent("collision", {
          type: "box",
          halfExtents: new pc.Vec3(0.5, 0.5, 0.5),
        });

        box.model!.material = material;
        box.setLocalScale(1, 1, 1);
        box.setPosition(x, 2 + Math.random() * 2, z);

        app.root.addChild(box);
      }
    });

    app.assets.add(textureAsset);
    app.assets.load(textureAsset);
  }

  private _createWhiteFloor() {
    const floor = new pc.Entity("WhiteFloor");

    floor.addComponent("model", { type: "plane" });

    const material = new pc.StandardMaterial();
    const textureAsset = new pc.Asset("generic_dev", "texture", {
      url: "/data/materials/generic_dev.png",
    });

    textureAsset.ready(() => {
      material.diffuseMap = textureAsset.resource as pc.Texture;
      material.diffuseMapTiling.set(100, 100);
      material.update();
      floor.model!.material = material;
    });

    floor.addComponent("collision", {
      type: "box",
      halfExtents: new pc.Vec3(50, 0.01, 50),
    });

    floor.addComponent("rigidbody", { type: "static" });

    g_core.getApplication().getApplication().assets.add(textureAsset);
    g_core.getApplication().getApplication().assets.load(textureAsset);

    floor.setLocalScale(100, 1, 100);
    floor.setPosition(0, 0, 0);
    g_core.getApplication().getApplication().root.addChild(floor);
  }
}