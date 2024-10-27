import * as THREE from "three";

export class CustomControls {
  constructor(camera, renderer, scene, minZoom = 5, maxZoom = 10) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;

    this.rotationSpeed = 0.005;
    this.zoomSpeed = 0.01;
    this.minZoom = minZoom;
    this.maxZoom = maxZoom;

    this.isDragging = false;
    this.isRotatingCamera = false;
    this.startX = 0;
    this.startY = 0;

    this.cameraDistance = camera.position.length(); // Set initial distance of camera from the scene center

    // Add event listeners for mouse events
    this.renderer.domElement.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.renderer.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.renderer.domElement.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.renderer.domElement.addEventListener("wheel", this.onMouseWheel.bind(this));
  }

  // Mouse down event
  onMouseDown(event) {
    if (event.button === 0) {
      this.isDragging = true; // Left mouse button: rotate object
    } else if (event.button === 2) {
      this.isRotatingCamera = true; // Right mouse button: rotate camera
    }
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  // Mouse move event
  onMouseMove(event) {
    if (this.isDragging) {
      // Rotate object around the center of the scene
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;

      const rotationSpeed = this.rotationSpeed;

      // Apply rotation to the object (rotate the whole scene for now)
      this.scene.rotation.y += deltaX * rotationSpeed;
      this.scene.rotation.x += deltaY * rotationSpeed;

      this.startX = event.clientX;
      this.startY = event.clientY;
    }

    if (this.isRotatingCamera) {
      // Rotate the camera around the center of the scene
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;

      const rotationSpeed = this.rotationSpeed;

      const spherical = new THREE.Spherical().setFromVector3(this.camera.position);
      spherical.theta -= deltaX * rotationSpeed;
      spherical.phi -= deltaY * rotationSpeed;
      spherical.phi = Math.max(0.01, Math.min(Math.PI - 0.01, spherical.phi)); // Prevent flipping

      this.camera.position.setFromSpherical(spherical);
      this.camera.lookAt(0, 0, 0); // Always look at the center of the scene

      this.startX = event.clientX;
      this.startY = event.clientY;
    }
  }

  // Mouse up event
  onMouseUp() {
    this.isDragging = false;
    this.isRotatingCamera = false;
  }

  // Mouse wheel event for zooming
  onMouseWheel(event) {
    const zoomChange = event.deltaY * this.zoomSpeed;
    this.cameraDistance = THREE.MathUtils.clamp(this.cameraDistance + zoomChange, this.minZoom, this.maxZoom);

    // Move the camera along its local Z-axis
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);
    this.camera.position.addScaledVector(cameraDirection, zoomChange);
    this.camera.position.setLength(this.cameraDistance);

    this.camera.lookAt(0, 0, 0); // Always look at the center of the scene
  }
}
