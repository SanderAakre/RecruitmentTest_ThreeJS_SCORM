import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// Creates the environment for the scene and sets up the renderer
export function createEnvironment(scene, renderer) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; // Tone mapping for more stylish rendering
  renderer.toneMappingExposure = 0.8;
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Sunlight (Directional Light) with Shadows
  const directionalLight = new THREE.DirectionalLight(0xfff2e6, 7);
  directionalLight.position.set(2.2, 6, 3);
  directionalLight.castShadow = true; // Enable shadow casting 

  // Shadow map settings resolution
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0;
  directionalLight.shadow.camera.far = 12;
  directionalLight.shadow.camera.left = -12;
  directionalLight.shadow.camera.right = 12;
  directionalLight.shadow.camera.top = 12;
  directionalLight.shadow.camera.bottom = -12;

  // add helper to visualize the light shadow
  // const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
  // scene.add(helper);

  scene.add(directionalLight);

  // Soft ambient light
  const ambientLight = new THREE.AmbientLight(0xfff2e6, 0.1);
  scene.add(ambientLight);

  // HDRI as background and environment map
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const hdriLoader = new RGBELoader();
  hdriLoader.load("./textures/Skybox1D_Tex.HDR", function (texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    texture.dispose();
    scene.background = envMap;
    scene.environment = envMap;
  });
}
