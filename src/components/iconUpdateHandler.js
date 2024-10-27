// iconUpdateHandler.js
import * as THREE from "three";

const iconWidth = 40;

// Track previous positions for performance optimization
const previousCameraPosition = new THREE.Vector3();
const previousModelPosition = new THREE.Vector3();

export function updateIcons(model, camera) {
  const cameraMoved = !camera.position.equals(previousCameraPosition);
  const modelMoved = !model.position.equals(previousModelPosition);

  // Only update icons if camera or model has moved
  if (cameraMoved || modelMoved) {
    model.traverse((node) => {
      if (node.isObject3D && node.userData.wordpressLink) {
        // Check if it's an icon
        updateIconVisibility(node, camera);
      }
    });

    // Update previous positions for the next frame
    previousCameraPosition.copy(camera.position);
    previousModelPosition.copy(model.position);
  }
}

// Updates the visibility of an icon based on its orientation to the camera, also handles fading
function updateIconVisibility(icon, camera) {
  const iconPosition = icon.getWorldPosition(new THREE.Vector3());
  const cameraDirection = new THREE.Vector3()
    .subVectors(camera.position, iconPosition)
    .normalize();
  const iconDirection = icon.userData.direction;
  const iconElement = icon.userData.iconElement;

  if (iconElement) {
    const dot = iconDirection.dot(cameraDirection);

    if (dot > 0) {
      // Icon is facing the camera - position it and fade in
      const screenPosition = iconPosition.clone().project(camera);
      const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth;
      const y = -(screenPosition.y * 0.5 - 0.5) * window.innerHeight;

      iconElement.style.left = `${x-iconWidth/2}px`;
      iconElement.style.top = `${y-iconWidth/2}px`;

      iconElement.classList.remove("opacity-0");
      iconElement.classList.add("opacity-100");

      // Reset fading state
      icon.isFadingOut = false;
    } else {
      // Icon is not facing the camera - begin fade-out if not already fading
      if (!icon.isFadingOut) {
        icon.isFadingOut = true; // Set fade-out state

        // Keep updating position during fade-out
        const fadeOutInterval = setInterval(() => {
          if (parseFloat(window.getComputedStyle(iconElement).opacity) <= 0) {
            clearInterval(fadeOutInterval); // Stop updating position when fully faded out
            icon.isFadingOut = false; // Reset fading state
          } else {
            // Continue updating position until fully faded out
            const screenPosition = iconPosition.clone().project(camera);
            const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth;
            const y = -(screenPosition.y * 0.5 - 0.5) * window.innerHeight;
            iconElement.style.left = `${x-iconWidth/2}px`;
            iconElement.style.top = `${y-iconWidth/2}px`;
          }
        }, 16); // Update at ~60fps
      }

      // Apply fade-out classes
      iconElement.classList.remove("opacity-100");
      iconElement.classList.add("opacity-0");
    }
  }
}
