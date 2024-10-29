// main.js
import * as THREE from "three";
import { loadModel } from "./components/geometryHandler.js";
import { createEnvironment } from "./components/environmentHandler.js";
import { updateIcons } from "./components/iconUpdater.js";
import { initCourse } from "./components/courseTracker.js";
import { configureControls } from "./components/controls.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { configureMixer } from "./components/animationMixer.js";

// Create the scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("three-canvas") });
const controls = new OrbitControls(camera, renderer.domElement);

let mixer;

let model;

const modelName = "airplane"; // Hardcoded now, but could be dynamic if more models are added

// Resize the renderer when the window is resized
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (model) {
    updateIcons(model, camera);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
  }

  renderer.render(scene, camera);
}

// load the environment
createEnvironment(scene, renderer, camera);

// Load the model
loadModel(scene, modelName).then(({ loadedModel, animations }) => {
  model = loadedModel;
  scene.add(model);
  // Add controls for the camera and model
  configureControls(controls, model);
  mixer = configureMixer(model, animations); // Pass animations to configureMixer
});

// Initialize the SCORM course
initCourse();

// Start the animation loop
animate();
