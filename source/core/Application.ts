import * as pc from "playcanvas";


export class Application {
  public readonly app: pc.Application;
  public readonly canvas: HTMLCanvasElement;
  private camera!: pc.Entity;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'root';
    document.body.appendChild(this.canvas);

    this.app = new pc.Application(this.canvas, {
      mouse: new pc.Mouse(this.canvas),
      keyboard: new pc.Keyboard(window),
    });


    this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
    this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);


    this.app.start();

    window.addEventListener('resize', this._onWindowResize.bind(this));
    this.app.on('update', this.update.bind(this));
  }

  public update(dt: number) {
    g_core.getTickManager().update(dt);
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
