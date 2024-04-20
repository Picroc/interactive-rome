import Experience from "./experience";

const canvas = document.querySelector<HTMLCanvasElement>("canvas.webgl");

if (canvas) {
    new Experience(canvas);
}
