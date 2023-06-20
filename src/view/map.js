
import { Layout, Point, LAYOUT_POINTY, pixel_to_hex } from "../lib/hexlib.js";

const hexWidth = 76.4;
const hexHeight = 77.4;

export const MAP_WIDTH = 1800;
export const MAP_HEIGHT = 1200;

let canvasScale = 1;

export const layout = new Layout(LAYOUT_POINTY, new Point(hexWidth, hexHeight), new Point(110, 140));

// scale canvas to fit window
export function resizeCanvas(canvas) {
    let newHeight = window.innerHeight - 100;
    canvas.style.height = newHeight + 'px' ;
    canvasScale = newHeight / canvas.height;
}

export function findHexFromPixel(canvas, screenX, screenY) {
    let x = (screenX - canvas.offsetLeft + window.scrollX) / canvasScale;
    let y = (screenY - canvas.offsetTop + window.scrollY) / canvasScale;
    return pixel_to_hex(layout, new Point(x, y));
}
