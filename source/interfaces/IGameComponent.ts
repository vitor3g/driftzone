import * as pc from "playcanvas";
import { ulid } from "ulid";

export abstract class IGameComponent<T> {
  protected readonly _id: string;
  public readonly props: T;
  public readonly app: pc.Application;
  public readonly entity: pc.Entity;

  get id(): string {
    return this._id;
  }

  constructor(entity: pc.Entity, props: T, id?: string) {
    this._id = id ?? ulid();
    this.props = props;
    this.entity = entity;
    this.app = g_core.getApplication().getApplication();

    this.start();
  }

  /** Called once when the component is initialized */
  protected abstract start(): void;

  /** Optional: called every frame */
  public update?(dt: number): void;

  /** Optional: called when the component is destroyed or detached */
  public destroy?(): void;

  /** Optional: called when component is enabled */
  public onEnable?(): void;

  /** Optional: called when component is disabled */
  public onDisable?(): void;

  /** Compares two components by ID */
  public equals(object?: IGameComponent<T>): boolean {
    if (!object) return false;
    if (this === object) return true;
    if (!(object instanceof IGameComponent)) return false;
    return this._id === object._id;
  }
}
