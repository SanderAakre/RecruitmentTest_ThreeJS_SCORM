// main.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { loadModel } from "./components/geometryHandler.js";
import { createEnvironment } from "./components/environmentHandler.js";
import { updateIcons } from "./components/iconUpdater.js";
import { initCourse } from "./components/courseTracker.js";

// Create the scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("three-canvas") });

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (model) {
    updateIcons(model, camera);
  }

  renderer.render(scene, camera);
}

// load the environment
createEnvironment(scene, renderer, camera);

// Load the choosen model
let model;
const modelName = "airplane"; // Hardcoded now, but could be dynamic if more models are added
loadModel(scene, modelName).then((loadedModel) => {
  model = loadedModel;
  scene.add(model);
});

// Initialize the scorm course
initCourse();

// Start the animation loop
animate();
