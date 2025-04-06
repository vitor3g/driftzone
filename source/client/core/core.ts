import { Logger } from "@/common/Logger";
import { Game } from "../game/Game";
import { Graphics } from "../graphics/Graphics";
import { TickManager } from "./TickManager";

export class Core {
  private readonly logger: Logger;
  private readonly graphics: Graphics;
  private readonly tickManager: TickManager;
  private readonly game: Game;

  constructor() {
    window.g_core = this;


    this.logger = new Logger("driftzone::core");
    this.graphics = new Graphics();
    this.tickManager = new TickManager();

    this.logger.log("Core");

    this.game = new Game();

  }

  public async start() {
    this.graphics.start();
  }


  public _createGame() {

  }


  public getGame() {
    return this.game;
  }

  public getTickManager() {
    return this.tickManager;
  }

  public getGraphics() {
    return this.graphics;
  }

  public getCoreLogger() {
    return this.logger;
  }
}

export const CoreModule = () => new Core();