import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Clouds } from './components/clouds/Clouds';

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

const iconTexture = textureLoader.load('/textures/icon.png');

// gltfLoader.load("/RomeMapScene.glb", (data) => {
//   const map = data.scene.children[0].material.map;
//   data.scene.children[0].material = new THREE.MeshBasicMaterial({ map });
//   scene.add(data.scene);
//   console.log(data);
// });

// iconTexture.offset = new THREE.Vector2(0.5, 0.5);

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 500 });
gui.close();
const global = {
  cameraTop: 3.0,
  iconScale: 0.1
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const updateCamera = () => {
  camera.rotation.set(global.cameraRotX, global.cameraRotY, global.cameraRotZ);
};

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight;

  // if (aspect > 1.8) {
  //   return;
  // }

  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = aspect;
  camera.left = -1 * camera.aspect;
  camera.right = 1 * camera.aspect;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

/**
 * Camera
 */
// Base camera
const aspectRatio = sizes.width / sizes.height;

// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );

const camera = new THREE.PerspectiveCamera(70, aspectRatio, 0.1, 100);

const controls = new OrbitControls(camera, canvas);

camera.position.set(0, global.cameraTop, 0);
camera.rotation.set(global.cameraRotX, 0, 0);
scene.add(camera);

gui
  .add(global, 'cameraTop')
  .min(0.0)
  .max(3.0)
  .step(0.0001)
  .onChange(() => {
    camera.position.set(camera.position.x, global.cameraTop, camera.position.z);
  });

const mapPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({ color: 'white' })
);

mapPlane.rotation.x = -Math.PI / 2;

mapPlane.position.y = -1;

scene.add(mapPlane);

textureLoader.load('/textures/map_texture.png', (data) => {
  const aspect = data.image.height / data.image.width;
  const aspectMultiplier = 1200.0;

  mapPlane.material.map = data;
  mapPlane.material.needsUpdate = true;

  mapPlane.scale.x = data.image.width / aspectMultiplier;
  mapPlane.scale.y = data.image.height / aspectMultiplier;
});

/**
 * Object
 */
// const testBox = new THREE.Sprite(
//   new THREE.SpriteMaterial({
//     map: iconTexture,
//     // sizeAttenuation: false,
//     // alphaMap: iconTexture,
//     // transparent: true,
//   })
// );
// testBox.position.y = 0.001;
// testBox.position.x = 0.56;
// testBox.position.z = 0.2;

// testBox.rotation.x = -Math.PI / 2;

// const testScaleMask = new THREE.Vector3(1.6, 1.2, 1);

// const updateTestObjectScale = (value) => {
//   testBox.scale.set(value, value, value);
//   testBox.scale.multiplyVectors(testBox.scale, testScaleMask);
// };

// updateTestObjectScale(global.iconScale);

// scene.add(testBox);

// gui.add(testBox.position, "x").min(-5).max(5).step(0.0001).name("circleX");
// gui.add(testBox.position, "z").min(-5).max(5).step(0.0001).name("circleY");

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('pointermove', onPointerMove);

let intersected;

const clock = new THREE.Clock();

const clouds = new Clouds(scene, camera);

let isAnimating = false;
let isUp = true;

const animateUp = (callback) => {
  if (isAnimating) {
    return;
  }

  isAnimating = true;
  isUp = true;
  const tween = new TWEEN.Tween(camera.position);
  tween.easing(TWEEN.Easing.Quadratic.Out);
  tween.to({ y: 3.0 }, 1000);
  tween.onComplete(() => {
    isAnimating = false;
    if (callback) {
      callback();
    }
  });
  tween.start();
};

const animateDown = (callback) => {
  if (isAnimating) {
    return;
  }

  isAnimating = true;
  isUp = false;
  const tween = new TWEEN.Tween(camera.position);
  tween.easing(TWEEN.Easing.Quadratic.In);
  tween.to({ y: 1.35 }, 1000);
  tween.onComplete(() => {
    isAnimating = false;
    if (callback) {
      callback();
    }
  });
  tween.start();
};

global.cloudsAnimation = () => {
  if (isUp) {
    animateDown();
  } else {
    animateUp();
  }
};

gui.add(global, 'cloudsAnimation').name('Clouds Animation');

let video, videoTexture, animationPlane;

const animate = () => {
  mapPlane.visible = false;

  if (!videoTexture) {
    video = document.getElementById('video');

    videoTexture = new THREE.VideoTexture(video);
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.colorSpace = THREE.SRGBColorSpace;

    const { videoWidth, videoHeight } = video;

    animationPlane = new THREE.Sprite(
      new THREE.SpriteMaterial({ color: 'white', map: videoTexture })
    );

    animationPlane.scale.x = videoWidth / 800.0;
    animationPlane.scale.y = videoHeight / 800.0;

    animationPlane.position.y = -1;

    scene.add(animationPlane);

    video.addEventListener('timeupdate', () => {
      if (video.currentTime >= 5.1) {
        video.pause();
        animateUp(() => {
          animationPlane.visible = false;
          mapPlane.visible = true;

          animateDown();
        });
      }
    });
  }

  if (animationPlane) {
    animationPlane.visible = true;
  }

  video.currentTime = 0;

  animateDown(() => {
    video.play();
  });
};

global.skullAnimation = () => {
  animate();
};

gui.add(global, 'skullAnimation').name('Skull Animation');

/**
 * Animate
 */
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Update controls
  //   controls.update();

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // calculate objects intersecting the picking ray
  // const intersects = raycaster.intersectObjects(scene.children, false);

  // if (intersects.length) {
  //   if (intersected != intersects[0].object) {
  //     console.log(intersected, intersects[0].object);
  //     if (intersected) {
  //       updateTestObjectScale(global.iconScale);
  //     }

  //     intersected = intersects[0].object;
  //   }
  // } else {
  //   if (intersected) {
  //     updateTestObjectScale(global.iconScale);

  //     intersected = null;
  //   }
  // }

  // if (intersected) {
  //   updateTestObjectScale(global.iconScale);
  // }

  TWEEN.update();

  controls.update();

  if (isUp) {
    clouds.updateCloudsAnimation(elapsedTime);
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
