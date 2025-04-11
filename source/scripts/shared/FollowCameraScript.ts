import { IGameScript } from "@/interfaces/IGameScript";
import * as pc from "playcanvas";

export interface FollowCameraProps {
  target: pc.Entity;
  distance: number;
  height: number;
  sensitivity: number;
  smoothing?: number;
}

export class FollowCameraScript extends IGameScript<FollowCameraProps> {
  private yaw = 0;
  private pitch = 15;
  private isPointerLocked = false;
  private targetPosition = new pc.Vec3();
  private cameraPosition = new pc.Vec3();

  protected start(): void {
    if (!this.app.mouse) return;

    const eulers = this.entity.getEulerAngles();
    this.yaw = eulers.y;

    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this._onMouseDown, this);
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this._onMouseMove, this);

    document.addEventListener('pointerlockchange', this._onPointerLockChange.bind(this));
  }

  public update(dt: number): void {
    const { target, distance, height, smoothing = 0.2 } = this.props;

    const targetPos = target.getPosition();
    this.targetPosition.set(targetPos.x, targetPos.y + height, targetPos.z);

    const pitchRad = pc.math.DEG_TO_RAD * this.pitch;
    const yawRad = pc.math.DEG_TO_RAD * this.yaw;

    const offsetX = distance * Math.sin(yawRad) * Math.cos(pitchRad);
    const offsetY = distance * Math.sin(pitchRad);
    const offsetZ = distance * Math.cos(yawRad) * Math.cos(pitchRad);

    const desiredPos = new pc.Vec3(
      targetPos.x + offsetX,
      targetPos.y + height + offsetY,
      targetPos.z + offsetZ
    );

    // Raycast de target para desiredPos
    const result = this.app.systems.rigidbody?.raycastFirst(this.targetPosition, desiredPos);

    let finalPos = desiredPos.clone();
    if (result) {
      const contactOffset = 0.3; // distância da parede para evitar clipping
      finalPos = result.point.clone().sub(this.targetPosition).normalize().mulScalar(-contactOffset).add(result.point);
    }

    if (smoothing > 0) {
      this.cameraPosition.lerp(this.entity.getPosition(), finalPos, Math.min(smoothing, 1));
      this.entity.setPosition(this.cameraPosition);
    } else {
      this.entity.setPosition(finalPos);
    }

    this.entity.lookAt(this.targetPosition);
  }


  private _onMouseDown(e: pc.MouseEvent): void {
    if (!this.app.mouse) return;

    if (!this.isPointerLocked) {
      this.app.mouse.enablePointerLock();
    }
  }

  private _onMouseMove(e: pc.MouseEvent): void {
    if (!this.isPointerLocked) return;

    const { sensitivity } = this.props;


    this.yaw -= e.dx * sensitivity;
    this.pitch += e.dy * sensitivity;

    this.pitch = pc.math.clamp(this.pitch, -45, 60);

    this.yaw %= 360;
    if (this.yaw < 0) this.yaw += 360;
  }

  private _onPointerLockChange(): void {
    this.isPointerLocked = document.pointerLockElement !== null;
  }
}