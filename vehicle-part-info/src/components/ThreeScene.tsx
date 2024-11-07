import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import { createEnvironment } from "./environmentHandler";

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      // **** NEW CODE ****

      // ** Setup class instances and variables **

      // Create the scene, camera and renderer and controls
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 20;
      const canvas = document.getElementById("three-canvas") as HTMLCanvasElement | null;
      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }
      const renderer = new THREE.WebGLRenderer({ canvas });
      const controls = new OrbitControls(camera, renderer.domElement);

      // Create a clock used for animation timing
      const clock = new THREE.Clock();

      // Variables for the model and animation mixer
      const model = new THREE.Group();
      const mixer = new THREE.AnimationMixer(model);
      const modelName = "airplane"; // Hardcoded now, but could be dynamic if more models are added

      // ** Functions **

      // Animation loop
      function animate() {
        requestAnimationFrame(animate);
        controls.update();

        if (model) {
          updateIcons(model, camera);
          const delta = clock.getDelta();
          if (mixer) mixer.update(delta);
        }

        renderer.render(scene, camera);
      }

      // ** Event listeners **

      // Event listener for resizing the Three.js canvas when the window is resized
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // load the HDR environment map and lighting
      createEnvironment(scene, renderer, camera);

      // Load the model and animations
      loadModel(scene, modelName).then(({ loadedModel, animations }) => {
        model = loadedModel;
        scene.add(model);
        // Add controls for the camera and model
        configureControls(controls, model);
        mixer = configureMixer(model, animations); // Pass animations to configureMixer
        // Initialize the SCORM course
        initCourse();
      });

      // Start the animation loop
      animate();

      // **** OLD CODE ****
      /*
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current?.appendChild(renderer.domElement);
      camera.position.z = 5;
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      // Render the scene and camera
      renderer.render(scene, camera);
      // Add this function inside the useEffect hook
      const renderScene = () => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(renderScene);
      };

      // Call the renderScene function to start the animation loop
      renderScene();
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
      };

      window.addEventListener("resize", handleResize);

      // Clean up the event listener when the component is unmounted
      return () => {
        window.removeEventListener("resize", handleResize);
      };
      */
    }
  }, []);
  return <div ref={containerRef} />;
};
export default ThreeScene;
