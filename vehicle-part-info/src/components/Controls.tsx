import { OrbitControls } from "three-stdlib";
import * as THREE from "three";

// Configures custom controls for rotating the model and managing camera zoom restrictions
export function configureControls(controls: OrbitControls, model: THREE.Object3D) {
  // Configure zoom limits for camera
  controls.minDistance = 14;
  controls.maxDistance = 60;
  controls.enablePan = false; // Disable panning
  controls.enableDamping = true; // Enable damping for smoother experience
  controls.dampingFactor = 0.05;

  // Variables to track dragging state
  let isDragging = false;
  let previousMousePosition: { x: number; y: number } | null = null;

  // Event listener for mouse down to initiate drag behavior
  function handleMouseDown(event: MouseEvent) {
    if (event.button === 2 || event.ctrlKey || event.shiftKey) {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    }
  }

  // Event listener for mouse move to rotate model if dragging is active
  function handleMouseMove(event: MouseEvent) {
    if (isDragging && previousMousePosition) {
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };

      // Adjust rotation based on mouse movement
      const rotationSpeed = 0.005;
      model.rotation.y += deltaMove.x * rotationSpeed;
      model.rotation.x += deltaMove.y * rotationSpeed; // Optionally rotate around x-axis

      // Update previous mouse position
      previousMousePosition = { x: event.clientX, y: event.clientY };
    }
  }

  // Event listener to stop dragging behavior
  function handleMouseUp() {
    isDragging = false;
    previousMousePosition = null;
  }

  // Register event listeners
  window.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);

  // Clean up event listeners on disposal (useful in React components)
  return () => {
    window.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };
}
