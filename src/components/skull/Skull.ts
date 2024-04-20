import * as THREE from 'three';
import Experience from '../../experience/Experience';
import { Easing, Tween } from '@tweenjs/tween.js';
import AnimatedSprite from '../../experience/utils/AnimatedSprite';

export default class Skull extends AnimatedSprite {
  static INITIAL_POSITION = new THREE.Vector3(-1.1957, -1.999, 1.2134);

  debug: Experience['debug'];

  constructor() {
    super();

    const { debug } = Experience.getInstance();

    this.debug = debug;

    this.setTileset({
      tileName: 'skullTileset',
      tilesNumber: 6
    });
    this.setSprite();
    this.setSpriteInitialPosition();
    this.setDebug();
  }

  setDebug() {
    if (this.debug.active) {
      const functions = {
        wakeUp: () => {
          this.playWakeUpAnimation();
        },
        goHome: () => {
          this.playMovingAnimation();
        }
      };

      const folder = this.debug.ui.addFolder('skull');

      folder.add(this.sprite.position, 'x').min(-2).max(2).step(0.0001);
      folder
        .add(this.sprite.position, 'y')
        .min(-2)
        .max(2)
        .step(0.0001)
        .name('height');
      folder
        .add(this.sprite.position, 'z')
        .min(-2)
        .max(2)
        .step(0.0001)
        .name('y');

      folder.add(functions, 'wakeUp');
      folder.add(functions, 'goHome');
    }
  }

  setSpriteInitialPosition() {
    this.sprite.position.copy(Skull.INITIAL_POSITION);
  }

  playWakeUpAnimation() {
    const initialPosition = new THREE.Vector2(-1.1957, 1.2134);
    const finalPosition = new THREE.Vector2(-1.1957, -0.3107);

    this.sprite.position.set(
      initialPosition.x,
      this.sprite.position.y,
      initialPosition.y
    );

    const tween = new Tween(this.sprite.position);
    tween.easing(Easing.Quadratic.InOut);
    tween.to({ x: finalPosition.x, z: finalPosition.y }, 1500);
    tween.start();
    tween.onComplete(() => {
      this.playAnimation(1000, [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0]);
    });
  }

  private playMovingPrepareAnimation() {
    this.sprite.material.rotation = 0;

    const tween = new Tween(this.sprite.material);
    tween.easing(Easing.Quadratic.InOut);
    tween.to({ rotation: Math.PI / 5 }, 500);
    tween.to({ rotation: Math.PI / 10 }, 400);
    return tween;
  }

  private playMovingOutAnimation() {
    const tween = this.playMovingPrepareAnimation();
    tween.start();
    tween.onComplete(() => {
      const tweenPos = new Tween(this.sprite.position);
      const tweenRot = new Tween(this.sprite.material);

      tweenPos.easing(Easing.Quadratic.In);
      tweenRot.easing(Easing.Quadratic.InOut);

      tweenPos.to({ x: 10 }, 1000);
      tweenRot.to({ rotation: -Math.PI / 5 }, 300);

      tweenPos.start();
      tweenRot.start();
    });
  }

  playMovingAnimation() {
    this.playMovingOutAnimation();
  }

  update() {}
}
