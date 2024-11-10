import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import { createEnvironment } from "./EnvironmentHandler";
import { loadModel } from "./GeometryHandler";
import { configureMixer } from "./CustomAnimationMixer";
import { configureControls } from "./Controls";
import { updateIcons } from "./IconUpdater";
import { CourseTrackerComponent } from "./CourseTracker";

const ThreeScene: React.FC = () => {
  // Refs for the container, mixer, and model
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      console.error("Window object not found");
      return;
    }
    if (!canvasRef.current) {
      console.error("Canvas element not found");
      return;
    }

    // Create the scene, camera, renderer, and controls
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, renderer.domElement);
    const clock = new THREE.Clock();

    // Load the HDR environment map and lighting
    createEnvironment(scene, renderer);

    // Load the model and animations
    const modelName = "airplane"; // Hardcoded now, but could be dynamic if more models are added
    loadModel(scene, modelName).then(({ loadedModel, animations }) => {
      modelRef.current = loadedModel;
      scene.add(loadedModel);

      // Configure controls and mixer
      configureControls(controls, loadedModel);
      mixerRef.current = configureMixer(loadedModel, animations);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      if (modelRef.current) {
        updateIcons(modelRef.current, camera);
        const delta = clock.getDelta();
        mixerRef.current?.update(delta);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize event listener
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen">
      <canvas ref={canvasRef} className="w-full h-full" />
      <CourseTrackerComponent />
    </div>
  );
};

export default ThreeScene;
