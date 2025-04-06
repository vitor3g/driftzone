import { Logger } from "@/common/Logger";
import { CoreModule } from "./core/Core";

export class dzFactoryStatic {
  private readonly logger!: Logger;

  constructor() {
    this.logger = new Logger("driftzone::factory");
  }

  public async create() {
    const module = CoreModule();

    await module.start();

    this.logger.log("drift zone module initialized");

    return 0;
  }
}

export const DriftZone = new dzFactoryStatic();
