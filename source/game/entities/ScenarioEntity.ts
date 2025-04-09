import { IGameEntity } from "@/interfaces/IGameEntity";
import * as pc from "playcanvas";

export interface ScenarioEntityProps {
  source: string;
}

export class ScenarioEntity extends IGameEntity<ScenarioEntityProps> {
  constructor(props: ScenarioEntityProps, id?: string) {
    super(props, id)
  }

  protected start(): void {
    const sourceUrl = this.props.source;

    this.app.assets.loadFromUrl(sourceUrl, "container", (err, asset) => {
      if (err || !asset) {
        return;
      }

      const container = asset.resource as pc.ContainerResource;

      const entity = container.instantiateRenderEntity();

      this.entity.addChild(entity);
    });
  }
}