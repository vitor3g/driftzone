import * as pc from "playcanvas";
import { ulid } from "ulid";
import type { IGameComponent } from "./IGameComponent";
import type { IGameScript } from "./IGameScript";

export abstract class IGameEntity<T> {
  protected readonly _id: string;
  public readonly props: T;
  public readonly entity: pc.Entity;
  protected readonly app: pc.Application;
  protected components = new Map<string, IGameComponent<any>>();
  protected scripts = new Map<string, IGameScript<any>>();

  get id(): string {
    return this._id;
  }

  constructor(props: T, id?: string) {
    this._id = id ?? ulid();
    this.props = props;

    this.app = g_core.getApplication().getApplication();
    this.entity = new pc.Entity();

    if (this.update) {
      g_core.getTickManager().add(this.update.bind(this));
    }

    this.start();
  }

  protected abstract start(): void;

  public update?(dt: number): void;

  public addToRoot(): void {
    this.app.root.addChild(this.entity);
  }

  public remove(): void {
    if (this.entity.parent) {
      this.entity.parent.removeChild(this.entity);
    }
  }

  public destroy(): void {
    this.remove();
    this.entity.destroy();
  }

  public setEnabled(enabled: boolean): void {
    this.entity.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.entity.enabled;
  }


  public setPosition(pos: pc.Vec3): void {
    this.entity.setPosition(pos);
  }

  public getPosition(): pc.Vec3 {
    return this.entity.getPosition().clone();
  }

  public setRotation(rot: pc.Quat): void {
    this.entity.setRotation(rot);
  }

  public getRotation(): pc.Quat {
    return this.entity.getRotation().clone();
  }

  public lookAt(target: pc.Vec3): void {
    this.entity.lookAt(target);
  }

  public getComponent<T>(id: string): IGameComponent<T> | undefined {
    return this.components.get(id);
  }

  public addComponent<T>(
    ComponentClass: new (entity: pc.Entity, props: T) => IGameComponent<T>,
    props: T
  ): IGameComponent<T> {
    const component = new ComponentClass(this.entity, props);
    this.components.set(component.id, component);
    return component;
  }

  public addScript<T>(
    ScriptClass: new (entity: pc.Entity, props: T) => IGameScript<T>,
    props: T
  ): IGameScript<T> {
    const script = new ScriptClass(this.entity, props);
    this.scripts.set(script.id, script);
    return script;
  }


  public findChild?(name: string): pc.Entity | null {
    const node = this.entity.findByName(name);
    return node instanceof pc.Entity ? node : null;
  }

  public findByTag?(tag: string): pc.Entity[] {
    return this.app.root.findByTag(tag).filter((e): e is pc.Entity => e instanceof pc.Entity);
  }

  public equals(object?: IGameEntity<T>): boolean {
    if (!object) return false;
    if (this === object) return true;
    if (!(object instanceof IGameEntity)) return false;
    return this._id === object._id;
  }
}
