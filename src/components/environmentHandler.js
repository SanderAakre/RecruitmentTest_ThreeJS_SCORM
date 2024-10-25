import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export function createEnvironment(scene, renderer) {

  // Add a directional light to simulate sunlight
  const directionalLight = new THREE.DirectionalLight(0xffffff, 100);
  directionalLight.position.set(0.2, 1, 0.2);
  scene.add(directionalLight);

  // Load HDR skybox
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const hdriLoader = new RGBELoader();
  hdriLoader.load("/textures/hdr/Skybox1D_Tex.HDR", function (texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    texture.dispose();
    scene.background = envMap;
    scene.environment = envMap;
  });
}
