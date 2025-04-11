import { IGameEntity } from "@/interfaces/IGameEntity";


export type CameraEntityProps = object;

export class CameraEntity extends IGameEntity<CameraEntityProps> {
  constructor(props: CameraEntityProps, id?: string) {
    super(props, id);
  }

  protected start(): void {
  }
}