import { IGameComponent } from "@/interfaces/IGameComponent";
import * as pc from "playcanvas";

export interface CameraComponentProps {
  clearColor?: pc.Color;
  farClip?: 1000,
  nearClip?: 0.1,
}

export class CameraComponent extends IGameComponent<CameraComponentProps> {
  constructor(entity: pc.Entity, props: CameraComponentProps, id?: string) {
    super(entity, props, id);
  }

  protected start(): void {
    this.entity.addComponent("camera", {
      clearColor: this.props.clearColor ?? new pc.Color(0.1, 0.1, 0.1),
      farClip: this.props.farClip ?? 1000,
      nearClip: this.props.nearClip ?? 0.1,
    });
  }
}
