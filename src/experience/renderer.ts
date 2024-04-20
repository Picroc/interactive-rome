import * as THREE from 'three';
import Experience from '.';
import Sizes from './utils/Sizes';
import Camera from './camera';

export default class Renderer {
  sizes: Sizes;
  scene: THREE.Scene;
  camera: Camera;
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;

  constructor() {
    const { sizes, scene, camera, canvas } = Experience.getInstance();

    this.sizes = sizes;
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvas;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    this.setInstance();
  }

  setInstance() {
    const { renderer, sizes } = this;

    // renderer.toneMapping = THREE.ReinhardToneMapping;
    // renderer.toneMappingExposure = 1.75;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor('#ffffff');
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);
  }

  resize = () => {
    const { renderer, sizes } = this;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);
  };

  update = () => {
    this.renderer.render(this.scene, this.camera.instance);
  };
}
