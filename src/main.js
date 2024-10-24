import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { showModal } from './components/infoModal.js';
import { createBox, addLights, handleInfoIcon } from './components/geometryHandler.js'; // Import the lighting function

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);

// Add lights to the scene
addLights(scene);

// Add the icon as an HTML element with Tailwind classes
const iconwidth = 40;
const iconElement = document.createElement('div');
iconElement.classList.add(
  'absolute',
  'bg-cover',
  'cursor-pointer',
  'rounded-full'
);
iconElement.style.width = `${iconwidth}px`;
iconElement.style.height = `${iconwidth}px`;
iconElement.style.backgroundImage = 'url("/icon.png")';
document.body.appendChild(iconElement);

// Add event listener for click
iconElement.addEventListener('click', () => {
  showModal();
});

// Create the cube (or later models) and handle info icons
const cube = createBox(scene);  // This returns the cube object
const updateIconPosition = handleInfoIcon(camera, cube, iconElement, iconwidth); // This function updates icon position

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
