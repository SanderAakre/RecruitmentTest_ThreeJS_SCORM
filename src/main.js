import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createIcon } from "./components/infoIcon.js";
import { createBox, handleInfoIcon } from "./components/geometryHandler.js";
import { createEnvironment } from "./components/environmentHandler.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("three-canvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);

// Add lighting and HDR environment
createEnvironment(scene, renderer);

// Set icon width and create the icon element
const iconWidth = 40;
const iconElement = createIcon(iconWidth);

// Create the cube (or later models) and handle info icons
const cube = createBox(scene); // This returns the cube object
const updateIconPosition = handleInfoIcon(camera, cube, iconElement, iconWidth); // This function updates icon position

// Set camera position
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Update the position of the icon based on cube and camera position
  updateIconPosition();

  // Render the scene
  renderer.render(scene, camera);
}

animate();
