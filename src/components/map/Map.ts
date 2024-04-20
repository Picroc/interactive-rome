import * as THREE from 'three';
import Experience from '../../experience/Experience';
import { ImageMetadata } from '../../experience/utils/Resources';

export default class Map {
  scene: Experience['scene'];
  resources: Experience['resources'];
  texture: ImageMetadata;

  geometry: THREE.PlaneGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;

  constructor() {
    const { scene, resources } = Experience.getInstance();

    this.scene = scene;
    this.resources = resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1);
  }

  setTextures() {
    const texture = this.resources.getTexture('mapTexture');

    if (texture) {
      this.texture = texture;
      this.texture.file.colorSpace = THREE.SRGBColorSpace;
    }
  }

  setMaterial() {
    this.texture.file.colorSpace = THREE.SRGBColorSpace;
    this.material = new THREE.MeshBasicMaterial({
      color: 'white',
      map: this.texture.file
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.scale.x = this.texture.scale.x;
    this.mesh.scale.y = this.texture.scale.y;

    this.mesh.position.y = -1;
    this.mesh.rotation.x = -Math.PI / 2;

    this.scene.add(this.mesh);
  }
}
