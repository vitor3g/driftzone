import { IGameComponent } from "@/interfaces/IGameComponent";
import type { IBaseProps } from "@/interfaces/IGameEntity";
import * as pc from "playcanvas";

interface VehicleProps extends IBaseProps {
  chassisModel: string;
  wheelModel: string;
  wheelCount: number;
  wheelRadius: number;
  vehicleWidth: number;
  vehicleLength: number;
  vehicleMass: number;
}

interface ChassisPhysicsProps extends IBaseProps {
  mass: number;
}

export class ChassisPhysicsComponent extends IGameComponent<ChassisPhysicsProps> {
  private rigidBody: any = null;
  private collision: any = null;

  protected start(): void {
    this.rigidBody = this.parent.addComponent('rigidbody', {
      type: 'dynamic',
      mass: this.props.mass,
      restitution: 0.1,
      friction: 0.5,
      linearDamping: 0.2,
      angularDamping: 0.5
    });

    this.collision = this.parent.addComponent('collision', {
      type: 'box',
      halfExtents: new pc.Vec3(1, 0.5, 2)
    });
  }

  public getCollision() {
    return this.collision
  }

  public getPhysicsBody(): pc.RigidBodyComponent | null {
    return this.rigidBody;
  }
}