import { Logger } from "@/common/logger";
import { ImGui, ImGui_Impl } from "@zhobo63/imgui-ts";
import type { Graphics } from "../graphics";
import { Primitives } from "./primitives";

export class Gui {
  private readonly logger: Logger;
  private io!: ImGui.IO;
  private readonly primitives: Primitives;

  constructor(private readonly g_graphics: Graphics) {
    this.logger = new Logger("driftzone::gui");
    this.primitives = new Primitives();

    this.logger.log("gui");
  }

  public async start() {
    await ImGui.default();

    ImGui.CHECKVERSION();
    ImGui.CreateContext();
    this.io = ImGui.GetIO();
    ImGui.StyleColorsDark();
    this.io.Fonts.AddFontDefault();

    ImGui_Impl.Init(this.g_graphics.getRenderer().renderer.domElement);

    g_core.getTickManager().subscribe("gui-update", this.update.bind(this));
  }

  public update(dt: number) {
    ImGui_Impl.NewFrame(dt);
    ImGui.NewFrame();

    // Painel de FPS
    ImGui.Begin("Performance");
    ImGui.Text(`FPS: ${this.io.Framerate.toFixed(1)}`);
    ImGui.End();

    this.primitives.update();


    ImGui.EndFrame();
    ImGui.Render();

    this.g_graphics.getRenderer().renderer.resetState();

    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
  }

  public getPrimitiveList() {
    return this.primitives;
  }

  public getIO() {
    return this.io;
  }
}