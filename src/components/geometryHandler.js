import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TextureLoader } from "three/src/loaders/TextureLoader";

export function createBox(scene) {
  // Create the cube with a material that reacts to light
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  return cube;
}

export function loadModel(scene, modelName) {
  const loader = new GLTFLoader();
  const textureLoader = new TextureLoader();

  const baseColorMap = textureLoader.load(
    "models/" + modelName + "/" + modelName + "_BaseColor.png"
  );
  const normalMap = textureLoader.load(
    "models/" + modelName + "/" + modelName + "_Normal.png"
  );
  const ormMap = textureLoader.load(
    "models/" + modelName + "/" + modelName + "_ORM.png"
  );
  baseColorMap.flipY = false;
  normalMap.flipY = false;
  ormMap.flipY = false;

  loader.load("models/" + modelName + "/" + modelName + ".glb", (gltf) => {
    const model = gltf.scene;
    model.rotation.y = Math.PI;
    model.traverse(function (node) {
      if (node.isMesh) {
        node.material = new THREE.MeshPhysicalMaterial({
          map: baseColorMap,
          normalMap: normalMap,
          // aoMap: ormMap,
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

    scene.add(model);
  });
}

export function handleInfoIcon(camera, cube, iconElement, iconwidth) {
  const backFaceNormal = new THREE.Vector3(0, 0, -1); // Assuming negative Z is the back face
  backFaceNormal.applyQuaternion(cube.quaternion); // Adjust to cube's rotation

  return function () {
    const cubeToCamera = new THREE.Vector3();
    cubeToCamera.subVectors(camera.position, cube.position).normalize();

    const rotatedBackFaceNormal = backFaceNormal.clone();
    rotatedBackFaceNormal.applyQuaternion(cube.quaternion);

    const dot = rotatedBackFaceNormal.dot(cubeToCamera);

    if (dot > 0) {
      const backFaceCenter = new THREE.Vector3(0, 0, -0.5);
      backFaceCenter.applyMatrix4(cube.matrixWorld);

      const vector = backFaceCenter.project(camera);
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;

      iconElement.style.left = `${x - iconwidth / 2}px`;
      iconElement.style.top = `${y - iconwidth / 2}px`;
      iconElement.style.display = "block";
    } else {
      iconElement.style.display = "none";
    }
  };
}
