import { Label } from "@playcanvas/pcui";
import * as pc from "playcanvas";


export class Application {
  public readonly app: pc.Application;
  public readonly canvas: HTMLCanvasElement;
  private camera!: pc.Entity;
  private label!: Label;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'root';
    document.body.appendChild(this.canvas);

    this.app = new pc.Application(this.canvas, {
      mouse: new pc.Mouse(this.canvas),
      keyboard: new pc.Keyboard(window),
      graphicsDeviceOptions: {
        antialias: true,
        preferWebGpu: true,
      }
    });

    this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
    this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);

    this.label = new Label();
    this.label.dom.style.fontSize = '14px';

    document.body.appendChild(this.label.dom);

    pc.WasmModule.setConfig('Ammo', {
      glueUrl: `/data/libs/ammo/ammo.wasm.js`,
      wasmUrl: `/data/libs/ammo/ammo.wasm.wasm`,
      fallbackUrl: `/data/libs/ammo/ammo.js`
    });
  }

  public async start() {
    await new Promise((resolve) => {
      pc.WasmModule.getInstance('Ammo', () => resolve(true));
    });


    this.app.start();


    this.app.systems.rigidbody?.gravity.set(0, -9.81, 0);


    window.addEventListener('resize', this._onWindowResize.bind(this));
    this.app.on('update', this.update.bind(this));
  }

  public update(dt: number) {
    g_core.getTickManager().update(dt);
    g_core.getTickManager().update(dt);
    const fps = Math.round(1 / dt);

    this.label.text = String(fps);
  }


  private _onWindowResize() {
    this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
    this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    this.app.resizeCanvas();
  }

  public getApplication() {
    return this.app;
  }

  public getCanvas() {
    return this.canvas;
  }

  public getCamera() {
    return this.camera;
  }
}
