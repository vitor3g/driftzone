import { SkyShader } from '@/shaders/env/sky-shader';
import * as THREE from 'three';
import { default as CSM } from 'three-csm';
import type { IUpdatable } from '../interfaces/updatable';

export class Sky extends THREE.Object3D implements IUpdatable {
  public updateOrder = 5;

  public sunPosition: THREE.Vector3 = new THREE.Vector3();
  public csm: CSM;

  set theta(value: number) {
    this._theta = value;
    this.refreshSunPosition();
  }

  set phi(value: number) {
    this._phi = value;
    this.refreshSunPosition();
    this.refreshHemiIntensity();
  }

  private _phi = 50;
  private _theta = 145;

  private hemiLight: THREE.HemisphereLight;
  private maxHemiIntensity = 0.9;
  private minHemiIntensity = 0.3;

  private skyMesh: THREE.Mesh;
  private skyMaterial: THREE.ShaderMaterial;


  constructor() {
    super();


    // Sky material
    this.skyMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(SkyShader.uniforms),
      fragmentShader: SkyShader.fragmentShader,
      vertexShader: SkyShader.vertexShader,
      side: THREE.BackSide
    });

    // Mesh
    this.skyMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1000, 24, 12),
      this.skyMaterial
    );
    this.attach(this.skyMesh);

    // Ambient light
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0);
    this.refreshHemiIntensity();
    this.hemiLight.color.setHSL(0.59, 0.4, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 0.2, 0.75);
    this.hemiLight.position.set(0, 50, 0);

    g_core.getGraphics().getRendererScene().add(this.hemiLight);

    // CSM
    // New version
    // let splitsCallback = (amount, near, far, target) =>
    // {
    // 	for (let i = amount - 1; i >= 0; i--)
    // 	{
    // 		target.push(Math.pow(1 / 3, i));
    // 	}
    // };

    // Legacy
    const splitsCallback = (amount: number) => {
      const arr = [];

      for (let i = amount - 1; i >= 0; i--) {
        arr.push(Math.pow(1 / 4, i));
      }

      return arr;
    };

    this.csm = new CSM({
      // @ts-ignore
      fov: 80,
      far: 250,	// maxFar
      lightIntensity: 2.5,
      cascades: 3,
      shadowMapSize: 2048,
      camera: g_core.getGraphics().getRenderer().camera,
      parent: g_core.getGraphics().getRendererScene(),
      mode: 'custom',
      customSplitsCallback: splitsCallback
    });
    this.csm.fade = true;

    this.refreshSunPosition();

    g_core.getGraphics().getRendererScene().add(this);
    g_core.getTickManager().subscribe("sky-update", this.update.bind(this))
  }

  public update(): void {
    this.position.copy(g_core.getGraphics().getRenderer().camera.position);
    this.refreshSunPosition();

    this.csm.update();
    this.csm.lightDirection = new THREE.Vector3(-this.sunPosition.x, -this.sunPosition.y, -this.sunPosition.z).normalize();
  }

  public refreshSunPosition(): void {
    const sunDistance = 10;

    this.sunPosition.x = sunDistance * Math.sin(this._theta * Math.PI / 180) * Math.cos(this._phi * Math.PI / 180);
    this.sunPosition.y = sunDistance * Math.sin(this._phi * Math.PI / 180);
    this.sunPosition.z = sunDistance * Math.cos(this._theta * Math.PI / 180) * Math.cos(this._phi * Math.PI / 180);

    this.skyMaterial.uniforms.sunPosition.value.copy(this.sunPosition);
    this.skyMaterial.uniforms.cameraPos.value.copy(g_core.getGraphics().getRenderer().camera.position);
  }

  public refreshHemiIntensity(): void {
    this.hemiLight.intensity = this.minHemiIntensity + Math.pow(1 - (Math.abs(this._phi - 90) / 90), 0.25) * (this.maxHemiIntensity - this.minHemiIntensity);
  }
}