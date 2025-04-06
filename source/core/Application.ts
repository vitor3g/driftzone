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

    // Cria o elemento de texto de FPS
    const fpsDisplay = document.createElement('div');
    fpsDisplay.style.position = 'absolute';
    fpsDisplay.style.top = '10px';
    fpsDisplay.style.left = '10px';
    fpsDisplay.style.color = 'white';
    fpsDisplay.style.fontFamily = 'monospace';
    fpsDisplay.style.fontSize = '10px';
    fpsDisplay.style.zIndex = '1000';
    fpsDisplay.textContent = 'FPS: 0';
    document.body.appendChild(fpsDisplay);

    // Armazena para usar no update
    (this as any)._fpsDisplay = fpsDisplay;
    (this as any)._frameTime = 0;


    window.addEventListener('resize', this._onWindowResize.bind(this));
    this.app.on('update', this.update.bind(this));
  }

  public update(dt: number) {
    g_core.getTickManager().update(dt);


    const fps = Math.round(1 / dt);

    // Atualiza o texto de FPS
    (this as any)._fpsDisplay.textContent = `FPS: ${fps}`;
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
