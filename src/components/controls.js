export function configureControls(controls, model) {
  // Set minimum and maximum zoom distances for camera
  controls.minDistance = 14;
  controls.maxDistance = 60;

  controls.enablePan = false; // Disable panning to keep the orbit point fixed
  controls.enableDamping = true; // Add damping for smoother controls

  // Variables to track dragging for rotating the model
  let isDragging = false;
  let previousMousePosition = null;

  // Event listener for the "mousemove" event to rotate the model
  window.addEventListener("mousedown", (event) => {
    // Right-click or Ctrl/Shift + click will enable isDragging
    if (event.button === 2 || event.ctrlKey || event.shiftKey) {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    }
  });

  // Rotate the model based on mouse movement if isDragging is true
  window.addEventListener("mousemove", (event) => {
    if (isDragging && previousMousePosition) {
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };

      // Rotate the model based on mouse movement
      const rotationSpeed = 0.005;
      model.rotation.y += deltaMove.x * rotationSpeed;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  });

  // Stop dragging when the mouse button is released
  window.addEventListener("mouseup", () => {
    isDragging = false;
    previousMousePosition = null; // Reset to prevent unintended rotation on next drag start
  });
}
