import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createIcon } from "./components/infoIcon.js";
import { loadModel } from "./components/geometryHandler.js";
import { createEnvironment } from "./components/environmentHandler.js";

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Create the renderer and its settings
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("three-canvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Tone mapping for more stylish rendering
renderer.toneMappingExposure = 0.8;


// Add camera controls
const controls = new OrbitControls(camera, renderer.domElement);

// Add lighting and HDR environment
createEnvironment(scene, renderer, camera);

// Set icon width and create the icon element
const iconWidth = 40;
const iconElement = createIcon(iconWidth);

// Create the aircraft model
const modelName = "airplane";
loadModel(scene, modelName);
// const updateIconPosition = handleInfoIcon(camera, model, iconElement, iconWidth); // This function updates icon position

// Set camera position
camera.position.z = 20;

function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Update the position of the icon based on cube and camera position
  // updateIconPosition();

  // Render the scene
  renderer.render(scene, camera);
}

animate();
