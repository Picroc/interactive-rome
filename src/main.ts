import Experience from './experience/Experience';

const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl');

if (canvas) {
  new Experience(canvas);
}
