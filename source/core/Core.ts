import { Game } from "@/game/Game";
import { Application } from "./Application";
import { TickManager } from "./TickManager";

export class Core {
  private readonly application: Application;
  private readonly tickManager: TickManager;
  private readonly game: Game;

  constructor() {
    window.g_core = this;

    this.application = new Application();
    this.tickManager = new TickManager();
    this.game = new Game();
  }

  public getApplication() {
    return this.application;
  }

  public getTickManager() {
    return this.tickManager;
  }

  public getGame() {
    return this.game;
  }
}
