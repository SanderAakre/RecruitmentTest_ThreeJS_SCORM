import * as THREE from "three";
import { RGBELoader } from "three-stdlib";

// Creates the environment for the scene and sets up the renderer
export function createEnvironment(scene: THREE.Scene, renderer: THREE.WebGLRenderer): void {
  // Renderer settings
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Directional light with shadows
  const directionalLight = new THREE.DirectionalLight(0xfff2e6, 7);
  directionalLight.position.set(2.2, 6, 3);
  directionalLight.castShadow = true;

  // Shadow map settings
  directionalLight.shadow.mapSize.set(2048, 2048);
  directionalLight.shadow.camera.near = 0;
  directionalLight.shadow.camera.far = 12;
  directionalLight.shadow.camera.left = -12;
  directionalLight.shadow.camera.right = 12;
  directionalLight.shadow.camera.top = 12;
  directionalLight.shadow.camera.bottom = -12;

  // Optionally add a helper for debugging shadow camera
  // const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
  // scene.add(helper);

  scene.add(directionalLight);

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xfff2e6, 0.1);
  scene.add(ambientLight);

  // HDRI for background and environment
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const hdriLoader = new RGBELoader();

  hdriLoader.load(
    "./textures/Skybox1D_Tex.HDR",
    (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.background = envMap;
      scene.environment = envMap;
      texture.dispose(); // Dispose of the original texture to free memory
    },
    undefined,
    (error) => {
      console.error("Error loading HDR texture:", error);
    }
  );
}
