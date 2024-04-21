import { Scene, Color } from 'three';
import { gui } from '../system/gui.js';

function createScene() {
  const scene = new Scene();

  scene.background = new Color(0x000000);
  scene.background.setRGB(0.01, 0.005, 0.05)
  scene.backgroundBlurriness = 0.5

  // debug
  gui.addColor(scene, 'background')

  return scene;
}

export { createScene };