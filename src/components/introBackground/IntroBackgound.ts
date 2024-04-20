import * as THREE from 'three';
import Experience from '../../experience/Experience';
import { ImageMetadata } from '../../experience/utils/Resources';

export default class IntroBackground {
  static GRASS_COLOR = new THREE.Color('rgb(217, 227, 219)');

  scene: Experience['scene'];
  resources: Experience['resources'];
  debug: Experience['debug'];

  geometry: THREE.PlaneGeometry;
  texture: ImageMetadata;
  mesh: THREE.Mesh;

  hiderPlane: THREE.Sprite;

  constructor() {
    const { scene, resources, debug } = Experience.getInstance();

    this.scene = scene;
    this.resources = resources;
    this.debug = debug;

    this.setGeometry();
    this.setTextures();
    this.setMesh();

    this.setHiderPlane();

    this.setDebug();
  }

  setDebug() {
    if (this.debug.active) {
      const folder = this.debug.ui.addFolder('introBackground');

      folder.add(this.hiderPlane.position, 'x').min(-2).max(2).step(0.00001);
      folder.add(this.hiderPlane.position, 'z').min(-2).max(2).step(0.00001);

      folder
        .add(this.hiderPlane.scale, 'x')
        .min(0.01)
        .max(10)
        .step(0.00001)
        .name('scaleX');
      folder
        .add(this.hiderPlane.scale, 'y')
        .min(0.01)
        .max(2)
        .step(0.00001)
        .name('scaleY');
    }
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1);
  }

  setTextures() {
    const texture = this.resources.getTexture('introBackground');

    if (texture) {
      texture.file.colorSpace = THREE.SRGBColorSpace;
      this.texture = texture;
    }
  }

  setMesh() {
    this.mesh = new THREE.Mesh(
      this.geometry,
      new THREE.MeshBasicMaterial({
        map: this.texture.file
      })
    );

    this.mesh.scale.x = this.texture.scale.x;
    this.mesh.scale.y = this.texture.scale.y;

    this.mesh.position.y = -2;
    this.mesh.rotation.x = -Math.PI / 2;

    this.scene.add(this.mesh);
  }

  setHiderPlane() {
    this.hiderPlane = new THREE.Sprite(
      new THREE.SpriteMaterial({ color: IntroBackground.GRASS_COLOR })
    );
    this.hiderPlane.position.y = -1.995;

    // this.hiderPlane.position.x = -1.16119;
    this.hiderPlane.position.z = 1.59368;

    this.hiderPlane.scale.x = 4.93;

    this.scene.add(this.hiderPlane);
  }
}
