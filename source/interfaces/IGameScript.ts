import * as pc from "playcanvas";
import { ulid } from "ulid";

export abstract class IGameScript<T> {
  protected readonly _id: string;
  public readonly props: T;
  public readonly entity: pc.Entity;
  protected readonly app: pc.Application;

  get id() {
    return this._id;
  }

  constructor(entity: pc.Entity, props: T, id?: string) {
    this._id = id ?? ulid();
    this.entity = entity;
    this.props = props;
    this.app = g_core.getApplication().getApplication();

    this.start();
  }

  /** Called once when the script starts */
  protected abstract start(): void;

  /** Called every frame */
  public update?(dt: number): void;

  /** Called when the script is destroyed */
  public destroy?(): void;

  /** Called when the script is enabled */
  public onEnable?(): void;

  /** Called when the script is disabled */
  public onDisable?(): void;

  /** Called when a collision starts */
  public onCollisionEnter?(result: pc.ContactResult): void;

  /** Called every frame while colliding */
  public onCollisionStay?(result: pc.ContactResult): void;

  /** Called when a collision ends */
  public onCollisionExit?(result: pc.ContactResult): void;

  /** Called when a trigger volume is entered */
  public onTriggerEnter?(otherEntity: pc.Entity): void;

  /** Called every frame inside a trigger */
  public onTriggerStay?(otherEntity: pc.Entity): void;

  /** Called when exiting a trigger volume */
  public onTriggerExit?(otherEntity: pc.Entity): void;

  /** Compares two scripts by their ID */
  public equals(object?: IGameScript<T>): boolean {
    if (!object) return false;
    if (this === object) return true;
    if (!(object instanceof IGameScript)) return false;
    return this._id === object._id;
  }
}
