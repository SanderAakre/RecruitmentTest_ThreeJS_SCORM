import * as THREE from "three";
import { iconWidth } from "./geometryHandler.js";

// Track previous positions for performance optimization
const previousCameraPosition = new THREE.Vector3();
const previousModelPosition = new THREE.Vector3();

// Updates the visibility of all icons in the model based on their orientation to the camera
export function updateIcons(model, camera) {
  const cameraMoved = !camera.position.equals(previousCameraPosition);
  const modelMoved = !model.position.equals(previousModelPosition);

  // Only update icons if camera or model has moved
  if (cameraMoved || modelMoved) {
    model.traverse((node) => {
      if (node.isObject3D && node.userData.wordpressLink) {
        updateIconVisibility(node, camera, model);
      }
    });

    // Update previous positions for the next frame
    previousCameraPosition.copy(camera.position);
    previousModelPosition.copy(model.position);
  }
}

// Updates the position and visibility of an icon based on its orientation to the camera
function updateIconVisibility(icon, camera, model) {
  // Get the world position of the icon and the direction it's facing
  const iconPosition = icon.getWorldPosition(new THREE.Vector3());
  const cameraDirection = new THREE.Vector3().subVectors(camera.position, iconPosition).normalize();

  // Transform the icon's original direction by the model's rotation
  const iconDirection = icon.userData.direction.clone().applyQuaternion(model.quaternion);
  const iconElement = icon.userData.iconElement;

  if (iconElement) {
    // Check if the icon direction is facing the camera
    const dot = iconDirection.dot(cameraDirection);
    if (dot > 0) {
      // Convert the 3D position of the icon object to 2D screen coordinates
      const screenPosition = iconPosition.clone().project(camera);
      const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth;
      const y = -(screenPosition.y * 0.5 - 0.5) * window.innerHeight;

      // Position the icon at the 2D screen coordinates, offset by half its width to center it
      iconElement.style.left = `${x - iconWidth / 2}px`;
      iconElement.style.top = `${y - iconWidth / 2}px`;

      // Make the icon visible and clickable
      iconElement.classList.remove("opacity-0");
      iconElement.classList.add("opacity-100");
      iconElement.style.pointerEvents = "auto";

      icon.isFadingOut = false;
    } else {
      // Icon is not facing the camera - begin fade-out if not already fading
      if (!icon.isFadingOut) {
        icon.isFadingOut = true; 

        // Keep updating position during fade-out so it moves with the model
        const fadeOutInterval = setInterval(() => {
          // Stop fading out if the icon is fully transparent
          if (parseFloat(window.getComputedStyle(iconElement).opacity) <= 0) {
            clearInterval(fadeOutInterval); // Stop updating position when fully faded out
            icon.isFadingOut = false;
            iconElement.style.pointerEvents = "none";
          } else {
            // Continue updating position until fully faded out
            const screenPosition = iconPosition.clone().project(camera);
            const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth;
            const y = -(screenPosition.y * 0.5 - 0.5) * window.innerHeight;
            iconElement.style.left = `${x - iconWidth / 2}px`;
            iconElement.style.top = `${y - iconWidth / 2}px`;
          }
        }, 16); // Update at ~60fps
      }

      // Apply fade-out classes
      iconElement.classList.remove("opacity-100");
      iconElement.classList.add("opacity-0");
    }
  }
}
