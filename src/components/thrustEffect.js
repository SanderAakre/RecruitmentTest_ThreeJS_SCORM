// thrustEffect.js
import * as THREE from "three";

// Particle system for engine thrust
export class ThrustParticleSystem {
  constructor(enginePosition, direction) {
    this.particles = new THREE.Group();
    this.enginePosition = enginePosition;
    this.direction = direction;
    this.throttle = 0;

    // Material for particles
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.2,
    });

    // Initialize particle array
    this.particleArray = [];

    for (let i = 0; i < 20; i++) {
      const particle = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), particleMaterial);
      particle.position.copy(enginePosition);
      this.particles.add(particle);
      this.particleArray.push(particle);
    }
  }

  updateParticles(deltaTime) {
    this.particleArray.forEach((particle) => {
      if (particle.position.distanceTo(this.enginePosition) > 3 || this.throttle < 0.1) {
        particle.position.copy(this.enginePosition);
        // Add random offset for dispersion
        particle.position.x += (Math.random() - 0.5) * 0.1;
        particle.position.y += (Math.random() - 0.5) * 0.1;
        particle.position.z += (Math.random() - 0.5) * 0.1;
      } else {
        particle.position.add(this.direction.clone().multiplyScalar(this.throttle * deltaTime * 500)); // Increase speed
      }

      // Adjust opacity and visibility
      particle.material.opacity = Math.min(this.throttle, 1);
      particle.visible = this.throttle > 0.1;
    });
  }

  setThrottle(value) {
    this.throttle = value;
  }
}
