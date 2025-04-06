import { Logger } from "@/common/Logger";
import { GUI } from "./gui/GUI";
import { Renderer } from "./Renderer";

export class Graphics {
  private readonly logger: Logger;
  private readonly renderer: Renderer;
  private readonly gui: GUI;

  constructor() {
    this.logger = new Logger("driftzone::graphics");
    this.renderer = new Renderer(this);
    this.gui = new GUI(this);
  }

  public async start() {
    this.renderer.start();

    await this.gui.start();
  }

  public getGraphicsLogger() {
    return this.logger;
  }

  public getRendererScene() {
    return this.renderer.scene;
  }

  public getGUI() {
    return this.gui;
  }

  public getRenderer() {
    return this.renderer;
  }
}