import Experience from '../experience/Experience';
import Map from '../components/map/Map';

export default class MapScene {
  mapComponent: Map;
  scene: Experience['scene'];

  time: Experience['time'];

  constructor() {
    const { scene, time } = Experience.getInstance();

    this.time = time;
    this.scene = scene;

    this.mapComponent = new Map();
    this.hide();
  }

  update = () => {};

  destroy = () => {
    this.scene.remove(this.mapComponent.mesh);
  };

  hide = () => {
    this.mapComponent.mesh.visible = false;
  };

  show = () => {
    this.mapComponent.mesh.visible = true;
  };
}
