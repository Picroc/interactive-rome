import * as THREE from 'three';
import Experience from '..';
import { ImageMetadata } from './Resources';

export interface TileOptions {
  tileName: string;
  tilesNumber: number;
}

export default class AnimatedSprite {
  scene: Experience['scene'];
  resources: Experience['resources'];

  tilesNumber: number;
  tileWidth: number;

  tileset: ImageMetadata;
  sprite: THREE.Sprite;

  animationTimer: ReturnType<typeof setTimeout>;

  currentTile: number;

  constructor() {
    const { scene, resources } = Experience.getInstance();

    this.scene = scene;
    this.resources = resources;
  }

  setTileset(options: TileOptions) {
    const texture = this.resources.getTexture(options.tileName);

    if (texture) {
      this.tileset = texture;
      this.tilesNumber = options.tilesNumber;

      this.tileWidth = Math.floor((texture.scale.x * 1200) / this.tilesNumber);

      this.tileset.file.wrapS = THREE.RepeatWrapping;
      this.tileset.file.wrapT = THREE.RepeatWrapping;
      this.tileset.file.repeat.set(1 / this.tilesNumber, 1);

      this.currentTile = 0;
    }
  }

  setSprite() {
    this.sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: this.tileset.file })
    );

    this.sprite.scale.x = Math.floor(this.tileset.scale.x / this.tilesNumber);
    this.sprite.scale.y = this.tileset.scale.y;

    this.scene.add(this.sprite);
  }

  setCurrentSprite(idx: number) {
    if (this.currentTile >= this.tilesNumber) {
      return;
    }

    this.currentTile = idx;

    if (this.sprite.material.map) {
      this.sprite.material.map.offset.x =
        (1 / this.tilesNumber) * this.currentTile;
      this.sprite.material.needsUpdate = true;
    }
  }

  playAnimation(duration: number, spritesOrder?: number[]) {
    const framesNumber = spritesOrder ? spritesOrder.length : this.tilesNumber;
    const frameDuration = duration / framesNumber;

    let currentFrame = 0;
    let onComplete = () => {};

    const onTimeout = () => {
      if (currentFrame < framesNumber) {
        this.setCurrentSprite(
          spritesOrder ? spritesOrder[currentFrame] : currentFrame
        );
        currentFrame++;
        this.animationTimer = setTimeout(onTimeout, frameDuration);
      } else {
        onComplete();
      }
    };

    onTimeout();

    return {
      onComplete: (cb: () => void) => {
        onComplete = cb;
      }
    };
  }

  stopAnimation() {
    clearTimeout(this.animationTimer);
  }
}
