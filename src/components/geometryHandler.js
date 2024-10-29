import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { showModal } from "./infoModal.js";
import { completePart } from "./courseTracker.js";
import iconPath from "../public/textures/icon.png?url";

export const iconWidth = 32;

// Loads the model and its associated JSON data for icons
export function loadModel(scene, modelName) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    const textureLoader = new TextureLoader();

    // Load the texture maps for the model
    const baseColorMap = textureLoader.load(`models/${modelName}/${modelName}_BaseColor.png`);
    baseColorMap.flipY = false;
    baseColorMap.encoding = THREE.sRGBEncoding;
    const normalMap = textureLoader.load(`models/${modelName}/${modelName}_Normal.png`);
    normalMap.flipY = false;
    const ormMap = textureLoader.load(`models/${modelName}/${modelName}_ORM.png`);
    ormMap.flipY = false;

    // Create a physical material with the texture maps
    const airplaneMaterial = new THREE.MeshPhysicalMaterial({
      map: baseColorMap,
      normalMap: normalMap,
      // Ambient occlusion map isn't used in this model beacuse it looks bad with the current textures
      // aoMap: ormMap,
      roughnessMap: ormMap,
      roughness: 1.2,
      metalnessMap: ormMap,
      metalness: 1,
    });

    // Load the model based on the modelName
    loader.load(
      `models/${modelName}/${modelName}.glb`,
      (gltf) => {
        const model = gltf.scene;
        const animations = gltf.animations;

        // Apply material settings to all meshes in the model
        model.traverse(function (node) {
          if (node.isMesh) {
            node.material = airplaneMaterial;
            node.castShadow = true;
            node.receiveShadow = true;
            node.material.needsUpdate = true;
          }
        });

        // Fetch the JSON file of the model (Where the icon data is stored)
        fetch(`models/${modelName}/${modelName}_info.json`)
          .then((response) => {
            if (!response.ok) throw new Error(`Failed to load JSON: ${response.status}`);
            return response.json();
          })
          // Create icon objects from the JSON data and add them as children of the model
          .then((iconData) => {
            iconData.forEach((icon) => {
              const iconObject = createIconObject(icon);
              model.add(iconObject);
            });
            // Resolve the promise with the model and animations
            resolve({ loadedModel: model, animations });
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

const debugHelpers = false; // Debug option to help with positioning and orientation of icons

// Returns an icon object with the position and direction specified in the JSON data as data attributes
function createIconObject(icon) {
  const iconObject = new THREE.Object3D();
  iconObject.name = icon.id;
  iconObject.position.set(icon.position.x, icon.position.y, icon.position.z);

  // Add debug helpers (arrow and name label) if debugHelpers is true
  if (debugHelpers) {
    const direction = new THREE.Vector3(icon.direction.x, icon.direction.y, icon.direction.z);
    createDebugHelper(iconObject, direction, icon.id);
  }

  // Default styling for the HTML icon element
  const iconElement = document.createElement("div");
  iconElement.classList.add("absolute", "bg-cover", "cursor-pointer", "rounded-full", "opacity-0", "transition-opacity", "duration-200");
  iconElement.style.width = `${iconWidth}px`;
  iconElement.style.height = `${iconWidth}px`;
  iconElement.style.backgroundImage = `url(${iconPath})`;

  // Create overlay for grayed-out effect after completion
  const overlay = document.createElement("div");
  overlay.classList.add("absolute", "inset-0", "bg-gray-500", "bg-opacity-50", "rounded-full", "hidden");
  iconElement.appendChild(overlay);

  iconElement.dataset.id = icon.id;
  iconElement.dataset.wordpressLink = icon.wordpressLink;
  iconElement.dataset.scormId = icon.scormId;

  iconElement.addEventListener("click", (event) => {
    const wordpressLink = event.target.dataset.wordpressLink;
    if (wordpressLink) {
      showModal(wordpressLink);
    }
    const scormId = event.target.dataset.scormId;
    if (scormId) {
      completePart(scormId);
    }
  });

  document.body.appendChild(iconElement);

  // Attach the HTML element and other data to the icon's userData
  iconObject.userData.iconElement = iconElement;
  iconObject.userData.wordpressLink = icon.wordpressLink;
  iconObject.userData.direction = new THREE.Vector3(icon.direction.x, icon.direction.y, icon.direction.z);

  return iconObject;
}

// Creates a debug arrow and name label for the icon object
function createDebugHelper(iconObject, direction, name) {
  // Create an arrow helper to show the direction
  const arrowHelper = new THREE.ArrowHelper(direction.clone().normalize(), new THREE.Vector3(0, 0, 0), 0.5, 0xff0000);
  iconObject.add(arrowHelper);

  // Create a text sprite for the name label
  const nameSprite = createTextSprite(name);
  nameSprite.position.set(0, 0.4, 0); // Position label slightly above the icon
  iconObject.add(nameSprite);
}

// Returnes a text sprite with the specified text
function createTextSprite(text) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "Bold 36px Arial";
  context.fillStyle = "white";
  context.fillText(text, 0, 24); // Draw text at top-left corner

  // Create texture from canvas and set up the sprite
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(1, 0.5, 1); // Scale sprite for better visibility

  return sprite;
}
