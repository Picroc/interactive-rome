import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import EventEmitter from "./EventEmitter";
import * as THREE from "three";

export type Resource = CubeTextureResource | RegularResource;

export interface CubeTextureResource {
  type: "cubeTexture",
  path: string[];
  name: string;
}

export interface RegularResource {
  type: "gltfModel" | "texture";
  path: string;
  name: string;
}

export type ImageMetadata = {
  file: THREE.Texture,
  type: "texture",
  scale: {
    x: number,
    y: number
  }
}

export type ModelMetadata = {
  type: "model",
  file: GLTF
}

export type CubeTextureMetadata = {
  type: "cubeTexture",
  file: THREE.CubeTexture
}

export type FileMetadata = ImageMetadata | ModelMetadata | CubeTextureMetadata;

export default class Resources extends EventEmitter {
  sources: Resource[];
  items: Record<string, FileMetadata>;

  toLoad: number;
  loaded: number;

  loaders: {
    gltfLoader: GLTFLoader;
    textureLoader: THREE.TextureLoader;
    cubeTextureLoader: THREE.CubeTextureLoader;
  };

  constructor(sources: Resource[]) {
    super();

    this.sources = sources;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader()
    };
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source: Resource, file: THREE.Texture | THREE.CubeTexture | GLTF) {
    if (file instanceof THREE.Texture) {
      this.items[source.name] = {
        file,
        type: "texture",
        scale: {
          x: file.image.width / 1200.0,
          y: file.image.height / 1200.0
        }
      }
    } else if (file instanceof THREE.CubeTexture) {
      this.items[source.name] = {
        type: "cubeTexture",
        file
      };
    } else {
      this.items[source.name] = {
        type: "model",
        file
      };
    }

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }

  getTexture(name: string) {
    console.log(name, this.items)
    const item = this.items[name];

    if (item?.type === "texture") { 
      return item;
     }
  }
}
