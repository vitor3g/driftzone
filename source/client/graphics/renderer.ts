import { SString } from "@/shared/shared.utils";
import { Detector } from "@/shared/utils/detector";
import * as THREE from "three";
import { EffectComposer, FXAAShader, RenderPass, ShaderPass } from "three/examples/jsm/Addons.js";
import { Graphics } from "./graphics";

export class Renderer {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public composer: EffectComposer;
  public clock: THREE.Clock;
  public renderDelta: number;
  public logicDelta: number;
  public sinceLastFrame: number;
  public justRendered: boolean;
  public requestDelta: number;

  constructor(private readonly g_graphics: Graphics) {
    if (!Detector.webgl) {
      alert("This browser doesn't seem to have the required WebGL capabilities. The application may not work correctly.")
    }

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Default Scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1010);

    // Passes
    const renderPass = new RenderPass(this.scene, this.camera);
    const fxaaPass = new ShaderPass(FXAAShader);

    // FXAA
    const pixelRatio = this.renderer.getPixelRatio();
    fxaaPass.material.uniforms.resolution.value.x = 1 / (window.innerWidth * pixelRatio);
    fxaaPass.material.uniforms.resolution.value.y = 1 / (window.innerHeight * pixelRatio);

    // Composer
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(fxaaPass);


    // Render Loop
    this.clock = new THREE.Clock();
    this.renderDelta = 0;
    this.logicDelta = 0;
    this.sinceLastFrame = 0;
    this.justRendered = false;
    this.requestDelta = 0;
  }

  public start() {
    this.renderer.setAnimationLoop(this.render.bind(this));

    document.body.appendChild(this.renderer.domElement);

    window.addEventListener("resize", this.onWindowResize);
  }

  private update(dt: number): void {
    g_core.getTickManager().update(dt);
  }


  private render(dt: number) {
    this.requestDelta = this.clock.getDelta();

    // Measuring logic time
    this.logicDelta = this.clock.getDelta();


    // Frame limiting
    const interval = 1 / 60;
    this.sinceLastFrame += this.requestDelta + this.renderDelta + this.logicDelta;
    this.sinceLastFrame %= interval;


    this.composer.render();
    this.renderer.render(this.scene, this.camera)
    this.update(dt);
  }

  private onWindowResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.g_graphics
      .getGraphicsLogger()
      .warn(
        SString("Game Viewport has resized with aspect %s", this.camera.aspect),
      );
  };
}
