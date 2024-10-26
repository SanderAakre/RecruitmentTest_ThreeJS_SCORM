// iconUpdateHandler.js
import * as THREE from "three";

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

function updateIconVisibility(icon, camera) {
  const iconPosition = icon.getWorldPosition(new THREE.Vector3());
  const cameraDirection = new THREE.Vector3()
    .subVectors(camera.position, iconPosition)
    .normalize();
  const iconDirection = icon.userData.direction;
  const iconElement = icon.userData.iconElement; // Access icon element from userData

  if (iconElement) {
    // Ensure iconElement exists
    const dot = iconDirection.dot(cameraDirection);

    if (dot > 0) {
      const screenPosition = iconPosition.clone().project(camera);
      const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth;
      const y = -(screenPosition.y * 0.5 - 0.5) * window.innerHeight;

      iconElement.style.left = `${x}px`;
      iconElement.style.top = `${y}px`;
      iconElement.style.display = "block"; // Show icon
    } else {
      iconElement.style.display = "none"; // Hide icon
    }
  }
}
