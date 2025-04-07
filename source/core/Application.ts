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
      graphicsDeviceOptions: {
        antialias: true,
        preferWebGpu: true,
      }
    });

    this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
    this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);


    this._setupEnvironment(this.app);

    this.app.start();

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

    (this as any)._fpsDisplay = fpsDisplay;
    (this as any)._frameTime = 0;

    this.app.scene.lightmapFilterEnabled = true;
    this.app.scene.lightmapSizeMultiplier = 16;
    this.app.scene.lightmapMode = pc.LIGHTTYPE_DIRECTIONAL;
    this.app.scene.lightmapFilterRange = 1.0;
    this.app.scene.lightmapFilterSmoothness = 0.2;

    window.addEventListener('resize', this._onWindowResize.bind(this));
    this.app.on('update', this.update.bind(this));
  }

  public update(dt: number) {
    g_core.getTickManager().update(dt);
    const fps = Math.round(1 / dt);

    (this as any)._fpsDisplay.textContent = `FPS: ${fps}`;
  }

  private _setupEnvironment(app: pc.Application) {
    const faces = ['posx', 'negx', 'posy', 'negy', 'posz', 'negz'];
    const urls = faces.map(face => `/data/sky/${face}.png`);

    const imageFaces: HTMLImageElement[] = [];
    let loaded = 0;

    urls.forEach((url, index) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;

      img.onload = function () {
        imageFaces[index] = img;

        loaded++;
        if (loaded === 6) {
          const cubemap = new pc.Texture(app.graphicsDevice, {
            cubemap: true,
            format: pc.PIXELFORMAT_RGBA16F,
            width: img.width,
            height: img.height,
            mipmaps: true,
            minFilter: pc.FILTER_LINEAR_MIPMAP_LINEAR,
            type: pc.SKYTYPE_INFINITE,
            magFilter: pc.FILTER_LINEAR,
            addressU: pc.ADDRESS_CLAMP_TO_EDGE,
            addressV: pc.ADDRESS_CLAMP_TO_EDGE,
            anisotropy: 16
          });

          cubemap.name = 'skybox';

          app.scene.envAtlas = cubemap;
          app.scene.skybox = cubemap;
          app.scene.skyboxMip = 1;

          app.scene.skyboxIntensity = 1;
          cubemap.setSource(imageFaces);

        }
      };
    });

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
