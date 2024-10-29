// animationMixer.js
import { AnimationMixer, LoopOnce } from "three";

let mixer, landingGearAnimation;
let isRetracting = true;
let button; // Declare button at a broader scope

export function configureMixer(model, animations) {
  if (!animations || animations.length === 0) {
    console.error("No animations found in the model.");
    return null;
  }

  // Initialize the mixer and set up the single animation action
  mixer = new AnimationMixer(model);
  landingGearAnimation = mixer.clipAction(animations[0]); // Use the first animation, assuming it’s the combined one
  landingGearAnimation.clampWhenFinished = true;
  landingGearAnimation.setLoop(LoopOnce);

  // Add the button for toggling the animation
  button = document.createElement("button");
  button.textContent = "Retract Landing Gear"; // Initial text
  button.classList.add("fixed", "bottom-4", "right-4", "bg-gray-700", "text-white", "py-2", "px-4", "rounded", "shadow-lg", "hover:bg-gray-900");
  button.addEventListener("click", toggleLandingGear);
  document.body.appendChild(button);

  return mixer;
}

function toggleLandingGear() {
  if (landingGearAnimation) {
    landingGearAnimation.timeScale = isRetracting ? 1 : -1; // Forward for retract, reverse for extend
    landingGearAnimation.paused = false; // Ensure it plays
    landingGearAnimation.play();

    // Update button text based on the new state
    button.textContent = isRetracting ? "Extend Landing Gear" : "Retract Landing Gear";

    isRetracting = !isRetracting; // Toggle state
  }
}

export { mixer };
