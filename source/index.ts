import "@/styles/global.css";
import '@playcanvas/pcui/styles';

import { Core } from "./core/Core";


async function bootstrap() {
  const core = new Core();
  core.start();
}

bootstrap();
