import * as THREE from 'three';
import Debug from './utils/Debug';
import Sizes from './utils/Sizes';
import Time from './utils/Time';
import Resources from './utils/Resources';
import Camera from './Camera';
import Renderer from './Renderer';
import resources from '../resources/Resources';
import { Clouds } from '../components/clouds/Clouds';
import IntroScene from '../scenes/intro';
import MapScene from '../scenes/map';
import UI from './UI';

export interface InteractiveScene {
  update: () => void;
  destroy: () => void;
  hide: () => void;
  show: () => void;
}

export default class Experience {
  private static instance: Experience;

  canvas: HTMLCanvasElement;
  debug: Debug;
  sizes: Sizes;
  time: Time;
  scene: THREE.Scene;
  resources: Resources;
  camera: Camera;
  renderer: Renderer;

  ui: UI;

  currentScene?: InteractiveScene;
  clouds?: Clouds;

  scenes: {
    map: MapScene;
    intro: IntroScene;
  };

  constructor(canvas: HTMLCanvasElement) {
    if (Experience.instance) {
      return Experience.instance;
    }

    Experience.instance = this;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.experience = this;

    this.canvas = canvas;

    // Setup
    this.debug = new Debug();

    this.sizes = new Sizes();
    this.sizes.on('resize', this.resize);

    this.time = new Time();
    this.time.on('tick', this.update);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    const ambientLight = new THREE.AmbientLight();
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.scene.add(directionalLight);

    this.resources = new Resources(resources);

    this.camera = new Camera();

    this.renderer = new Renderer();

    this.resources.on('ready', () => {
      this.scenes = {
        map: new MapScene(),
        intro: new IntroScene()
      };

      this.setWorld();
      this.setDebug();

      this.ui = new UI();
    });
  }

  static getInstance = (): Experience => Experience.instance;

  setDebug() {
    if (this.debug.active) {
      const functions = {
        goToMap: () => {
          this.transitionToScene(this.scenes.map);
        },
        goToIntro: () => {
          this.transitionToScene(this.scenes.intro);
        }
      };
      const folder = this.debug.ui.addFolder('general');

      folder.add(functions, 'goToMap');
      folder.add(functions, 'goToIntro');
    }
  }

  transitionToScene(scene: InteractiveScene, onDone?: () => void) {
    this.camera.animate('up', () => {
      this.setScene(scene);
      this.camera.animate('down', onDone);
    });
  }

  setScene = (scene: InteractiveScene) => {
    this.currentScene?.hide();

    this.currentScene = scene;
    this.currentScene.show();
  };

  setWorld() {
    this.clouds = new Clouds();
    this.clouds.spawnClouds();

    this.setScene(this.scenes.intro);
  }

  resize = () => {
    this.camera.resize();
    this.renderer.resize();
  };

  update = () => {
    this.camera.update();

    this.currentScene?.update();
    this.clouds?.update();

    this.renderer.update();
  };

  destroy() {
    this.sizes.off('resize');
    this.sizes.off('tick');

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        for (const key in child.material) {
          if (child.material[key].dispose) {
            child.material[key].dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();

    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }
}
