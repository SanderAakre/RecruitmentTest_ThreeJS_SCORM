// geometryHandler.js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { showModal } from "./infoModal.js";

const iconWidth = 40;

export function loadModel(scene, modelName) {
  // Return a promise to handle the asynchronous loading
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    const textureLoader = new TextureLoader();

    const baseColorMap = textureLoader.load(
      "models/" + modelName + "/" + modelName + "_BaseColor.png"
    );
    baseColorMap.flipY = false;
    const normalMap = textureLoader.load(
      "models/" + modelName + "/" + modelName + "_Normal.png"
    );
    normalMap.flipY = false;
    const ormMap = textureLoader.load(
      "models/" + modelName + "/" + modelName + "_ORM.png"
    );
    ormMap.flipY = false;

    loader.load(
      "models/" + modelName + "/" + modelName + ".glb",
      (gltf) => {
        const model = gltf.scene;
        model.rotation.y = Math.PI;
        model.traverse(function (node) {
          if (node.isMesh) {
            node.material = new THREE.MeshPhysicalMaterial({
              map: baseColorMap,
              normalMap: normalMap,
              // aoMap: ormMap, // Not used because it looks bad. Update textures to fix
              // aoMapIntensity: 1,
              roughnessMap: ormMap,
              roughness: 1,
              metalnessMap: ormMap,
              metalness: 1,
              reflectivity: 0.5,
              clearcoat: 0.2,
              clearcoatRoughness: 0.3,
            });
            // Enable shadows
            node.castShadow = true;
            node.receiveShadow = true;
            // Update the material
            node.material.needsUpdate = true;
          }
        });

        // Attempt to fetch the JSON file of the current model
        fetch(`models/${modelName}/${modelName}_info.json`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to load JSON: ${response.status}`);
            }
            return response.json();
          })
          // Create icon objects from the JSON data and add them as children of the model
          .then((iconData) => {
            iconData.forEach((icon) => {
              const iconObject = createIconObject(icon);
              model.add(iconObject);
            });
            resolve(model);
          })
          .catch((error) => {
            console.error("Error loading JSON:", error);
            reject(error);
          });
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
        reject(error);
      }
    );
  });
}

function createIconObject(icon) {
  const iconObject = new THREE.Object3D(); // Acts as a placeholder for the icon
  iconObject.name = icon.id;
  iconObject.position.set(icon.position.x, icon.position.y, icon.position.z);

  // Create the icon element and its style
  const iconElement = document.createElement("div");
  iconElement.classList.add(
    "absolute",
    "bg-cover",
    "cursor-pointer",
    "rounded-full"
  );
  iconElement.style.width = `${iconWidth}px`;
  iconElement.style.height = `${iconWidth}px`;
  iconElement.style.backgroundImage = 'url("/icon.png")';

  // Set data-id for consistency with icon id
  iconElement.dataset.id = icon.id;
  iconElement.dataset.wordpressLink = icon.wordpressLink;

  // Add event listener to display modal when the icon is clicked
  iconElement.addEventListener("click", (event) => {
    const wordpressLink = event.target.dataset.wordpressLink;
    if (wordpressLink) {
      showModal(wordpressLink); // Open modal with the WordPress link
    }
  });

  document.body.appendChild(iconElement);

  // Attach the icon element to the THREE.Object3D's userData for later reference
  iconObject.userData.iconElement = iconElement;
  iconObject.userData.wordpressLink = icon.wordpressLink;
  iconObject.userData.direction = new THREE.Vector3(
    icon.direction.x,
    icon.direction.y,
    icon.direction.z
  );

  return iconObject;
}
