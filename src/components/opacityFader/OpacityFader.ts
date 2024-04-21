import * as THREE from 'three';
import Experience from '../../experience/Experience';

export default class OpacityFader {
  static fadeDistance = 2.0;

  scene: Experience['scene'];
  camera: Experience['camera'];

  material: THREE.SpriteMaterial;
  sprite: THREE.Sprite;

  color: THREE.Color;

  constructor(color: THREE.Color = new THREE.Color(0xffffff)) {
    const { scene, camera } = Experience.getInstance();

    this.scene = scene;
    this.camera = camera;

    this.color = color;

    this.setMaterial();
    this.setSprite();
  }

  setMaterial() {
    this.material = new THREE.SpriteMaterial({ color: this.color, opacity: 0 });
    this.material.sizeAttenuation = false;
  }

  setSprite() {
    this.sprite = new THREE.Sprite(this.material);
    this.sprite.scale.set(20, 20, 20);

    this.scene.add(this.sprite);
  }

  update() {
    const distance =
      this.camera.instance.position.distanceTo(this.sprite.position) - 1.35;

    const scale =
      Math.min(distance, OpacityFader.fadeDistance - 1.35) /
      (OpacityFader.fadeDistance - 1.35);

    if (scale === this.material.opacity) return;

    this.material.opacity = scale;
    this.material.needsUpdate = true;
  }
}
