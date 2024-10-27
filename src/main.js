// main.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { loadModel } from "./components/geometryHandler.js";
import { createEnvironment } from "./components/environmentHandler.js";
import { updateIcons } from "./components/iconUpdateHandler.js";

// Initialize SCORM
if (pipwerks.SCORM.init()) {
  console.log("SCORM initialized successfully.");
} else {
  console.error("SCORM initialization failed.");
}

// Example: Set the course status to "incomplete" when starting
pipwerks.SCORM.set("cmi.core.lesson_status", "incomplete");

function completeCourse() {
  pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
  pipwerks.SCORM.save(); // Save progress to the LMS
}

function trackIconView(iconName) {
  let data = pipwerks.SCORM.get("cmi.suspend_data") || "";
  data += `${iconName}; `;
  pipwerks.SCORM.set("cmi.suspend_data", data);
  pipwerks.SCORM.save();
}

window.addEventListener("beforeunload", () => {
  pipwerks.SCORM.quit();
});

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
renderer.outputEncoding = THREE.sRGBEncoding;

// Add camera controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 20;

// Add lighting and HDR environment
createEnvironment(scene, renderer, camera);

// Load the airplane model
const modelName = "airplane";
let model;

loadModel(scene, modelName).then((loadedModel) => {
  model = loadedModel;
  scene.add(model);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (model) {
    updateIcons(model, camera); // Call icon update handler
  }

  renderer.render(scene, camera);
}

animate();
