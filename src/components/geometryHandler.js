import * as THREE from "three";

export function createBox(scene) {
  // Create the cube with a material that reacts to light
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Solid green color that reacts to light
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  return cube;
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
