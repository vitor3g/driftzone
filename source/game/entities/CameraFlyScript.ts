import { IGameScript } from "@/interfaces/IGameScript";
import * as pc from "playcanvas";

export interface CameraFlyScriptProps {
  speed: number;
  lookSpeed: number;
  yaw: number;
  pitch: number;
  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
}

export class CameraFlyScript extends IGameScript<CameraFlyScriptProps> {
  constructor(entity: pc.Entity, props: CameraFlyScriptProps, id?: string) {
    props = {
      ...props,
      speed: 10,
      lookSpeed: 0.02,
      yaw: 0,
      pitch: 0,
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false
    };

    super(entity, props, id);


    g_core.getTickManager().add(this.update.bind(this));
  }

  protected start(): void {
    if (!this.app.mouse || !this.app.keyboard) return;

    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this._onMouseMove, this);
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, () => {
      if (!this.app.mouse) return;
      this.app.mouse.enablePointerLock();
    });

    this.app.keyboard.on(pc.EVENT_KEYDOWN, this._onKeyDown, this);
    this.app.keyboard.on(pc.EVENT_KEYUP, this._onKeyUp, this);

    const angles = this.entity.getEulerAngles();
    this.props.pitch = angles.x;
    this.props.yaw = angles.y;
  }

  public update(dt: number): void {
    const forward = this.entity.forward.clone();
    const right = this.entity.right.clone();
    const direction = new pc.Vec3();

    if (this.props.moveForward) direction.add(forward);
    if (this.props.moveBackward) direction.sub(forward);
    if (this.props.moveRight) direction.add(right);
    if (this.props.moveLeft) direction.sub(right);

    if (direction.lengthSq() > 0) {
      direction.normalize().mulScalar(this.props.speed * dt);
      this.entity.translate(direction);
    }
  }


  private _onMouseMove(event: pc.MouseEvent) {
    if (!document.pointerLockElement) return;

    this.props.yaw -= event.dx * this.props.lookSpeed;
    this.props.pitch -= event.dy * this.props.lookSpeed;
    this.props.pitch = pc.math.clamp(this.props.pitch, -89, 89);

    this.entity.setEulerAngles(this.props.pitch, this.props.yaw, 0);
  }

  private _onKeyDown(event: pc.KeyboardEvent) {
    switch (event.key) {
      case pc.KEY_W: this.props.moveForward = true; break;
      case pc.KEY_S: this.props.moveBackward = true; break;
      case pc.KEY_A: this.props.moveLeft = true; break;
      case pc.KEY_D: this.props.moveRight = true; break;
    }
  }

  private _onKeyUp(event: pc.KeyboardEvent) {
    switch (event.key) {
      case pc.KEY_W: this.props.moveForward = false; break;
      case pc.KEY_S: this.props.moveBackward = false; break;
      case pc.KEY_A: this.props.moveLeft = false; break;
      case pc.KEY_D: this.props.moveRight = false; break;
    }
  }
}
