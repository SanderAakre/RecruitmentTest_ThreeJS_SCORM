// main.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { loadModel } from "./components/geometryHandler.js";
import { createEnvironment } from "./components/environmentHandler.js";
import { updateIcons } from "./components/iconUpdater.js";
import { initCourse } from "./components/courseTracker.js";
import { ThrustParticleSystem } from "./components/thrustEffect.js";

// Create the scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("three-canvas") });

const controls = new OrbitControls(camera, renderer.domElement);

// Engine thrust particle system
let throttle = 1;
let previousTime = performance.now();
// Right and left engine positions and directions
const rightEnginePosition = new THREE.Vector3(5, 1.9, 0);
const leftEnginePosition = new THREE.Vector3(-5, 1.9, 0);
const thrustDirection = new THREE.Vector3(0, 0, 1); // Direction of the thrust
// Create particle systems for each engine
const rightEngineThrust = new ThrustParticleSystem(rightEnginePosition, thrustDirection);
const leftEngineThrust = new ThrustParticleSystem(leftEnginePosition, thrustDirection);
// Add particle systems to the scene
scene.add(rightEngineThrust.particles);
scene.add(leftEngineThrust.particles);

function setThrottle(value) {
  throttle = THREE.MathUtils.clamp(value, 0, 1);
  rightEngineThrust.setThrottle(throttle);
  leftEngineThrust.setThrottle(throttle);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Calculate deltaTime
  const currentTime = performance.now();
  const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds
  previousTime = currentTime;

  // Update particle systems based on the current throttle
  rightEngineThrust.updateParticles(deltaTime);
  leftEngineThrust.updateParticles(deltaTime);

  controls.update();

  if (model) {
    updateIcons(model, camera);
  }

  renderer.render(scene, camera);
}

// load the environment
createEnvironment(scene, renderer, camera);

// Load the model
let model;
const modelName = "airplane"; // Hardcoded now, but could be dynamic if more models are added
loadModel(scene, modelName).then((loadedModel) => {
  model = loadedModel;
  scene.add(model);
});

// Initialize the scorm course
initCourse();

setThrottle(throttle); // Set initial throttle value

// Start the animation loop
animate();
