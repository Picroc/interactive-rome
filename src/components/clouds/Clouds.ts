import * as THREE from 'three';
import Experience from '../../experience/Experience';
import { randFloat, randInt } from 'three/src/math/MathUtils.js';

const CLOUDS_COUNT = 120;
const SCALING_FACTOR = 0.75;
const MapBoundingBox = {
  min: { x: -1.9, z: -1.1 },
  max: { x: 1.9, z: 1.1 }
};

export class Clouds {
  static availableSprites = Array(10)
    .fill(0)
    .map((_, idx) => `cloud${idx + 1}`);

  scene: Experience['scene'];
  camera: Experience['camera'];
  time: Experience['time'];

  isFadedIn = false;
  loadedTextures: {
    material: THREE.SpriteMaterial;
    aspect: { x: number; y: number };
  }[] = [];
  spawnedClouds: {
    sprite: THREE.Sprite;
    updateSprite: (delta: number) => void;
  }[] = [];

  constructor() {
    const { scene, camera, resources, time } = Experience.getInstance();
    this.scene = scene;
    this.camera = camera;
    this.time = time;

    Clouds.availableSprites.forEach((name, idx) => {
      const data = resources.getTexture(name);
      if (data) {
        this.loadedTextures[idx] = {
          material: new THREE.SpriteMaterial({
            map: data.file,
            sizeAttenuation: false
          }),
          aspect: {
            x: data.scale.x * SCALING_FACTOR,
            y: data.scale.y * SCALING_FACTOR
          }
        };
      }
    });
  }

  public spawnClouds = () => {
    if (this.loadedTextures.length) {
      let spriteHeight = 1.4;
      for (let i = 0; i < CLOUDS_COUNT; i++) {
        const textureMaterial =
          this.loadedTextures[randInt(0, this.loadedTextures.length - 1)];

        const sprite = new THREE.Sprite(textureMaterial.material);
        sprite.position.x =
          Math.random() > 0.5 ? MapBoundingBox.min.x : MapBoundingBox.max.x;
        sprite.position.y = spriteHeight;
        sprite.position.z = randFloat(-1.0, 1.0);

        sprite.scale.x = textureMaterial.aspect.x;
        sprite.scale.y = textureMaterial.aspect.y;

        this.scene.add(sprite);

        const random_screen_pos =
          sprite.position.x > 0
            ? randFloat(0.0, MapBoundingBox.max.x)
            : randFloat(MapBoundingBox.min.x, 0.0);

        sprite.position.x = random_screen_pos;

        spriteHeight += 0.001;

        const randomFrequency = randFloat(0.0, 0.002);
        const randomMagnitude = randFloat(0.015, 0.02);
        const initialPos = sprite.position.z;

        const updateSprite = (elapsedTime: number) => {
          sprite.position.z =
            initialPos +
            Math.sin(elapsedTime * randomFrequency) * randomMagnitude;
        };

        this.spawnedClouds.push({ sprite, updateSprite });
      }
    }
  };

  update = () => {
    for (const sprite of this.spawnedClouds) {
      sprite.updateSprite(this.time.elapsed);
    }
  };
}
