import { iconWidth } from "./geometryHandler.js";

// Object to store the completion status of the course parts
let completionStatus = {
  part1: false,
  part2: false,
  part3: false,
  part4: false,
  part5: false,
  part6: false,
  part7: false,
  part8: false,
};

// Initialize the viewed parts counter and the total parts
let viewedParts = 0;
const totalParts = 8;

// Returns the progress display
function createProgressDisplay() {
  const progressDisplay = document.createElement("div");

  // Tailwind classes for styling
  progressDisplay.classList.add(
    "fixed",
    "top-4",
    "right-4",
    "bg-gray-700",
    "text-white",
    "text-sm",
    "font-bold",
    "py-1",
    "px-3",
    "rounded-full",
    "shadow-lg",
    "transition-all",
    "duration-300",
    "z-50"
  );

  // Set the initial text content
  progressDisplay.innerText = `${viewedParts}/${totalParts} parts viewed`;

  // Attach it to the body
  document.body.appendChild(progressDisplay);

  return progressDisplay;
}

// Initialize SCORM, load progress if it exists, and set the course status
export function initCourse() {
  if (pipwerks.SCORM.init()) {
    console.log("SCORM initialized successfully.");
    loadProgress();
    pipwerks.SCORM.set("cmi.core.lesson_status", "incomplete");
  } else {
    console.error("SCORM initialization failed.");
  }
  window.addEventListener("beforeunload", () => {
    pipwerks.SCORM.quit();
  });
}

// Loads the course progress from the SCORM API if it exists
function loadProgress() {
  const progressData = pipwerks.SCORM.get("cmi.suspend_data");
  if (progressData) {
    try {
      completionStatus = JSON.parse(progressData);
      console.log("Progress loaded:", completionStatus);

      // Apply completed styling for parts that are already completed
      Object.keys(completionStatus).forEach((partName) => {
        if (completionStatus[partName]) {
          viewedParts++;
          applyCompletedStyling(partName);
        }
      });
    } catch (error) {
      console.error("Error parsing suspend_data:", error);
    }
  }
}

// Updates completion status, display and icon styling for the part it is called with
export function completePart(partName) {
  if (completionStatus[partName]) return; // Return if part already completed
  completionStatus[partName] = true;
  saveProgress(); // Save to SCORM

  applyCompletedStyling(partName);

  // Increment viewed parts and update the display
  viewedParts++;
  progressDisplay.innerText = `${viewedParts}/${totalParts} parts viewed`;

  // Check if all parts are completed and mark course as completed
  if (Object.values(completionStatus).every((status) => status)) {
    completeCourse();
  }
}

// Applies completed styling to all icons with the specified part name
function applyCompletedStyling(partName) {
  const iconElements = document.querySelectorAll(`[data-scorm-id="${partName}"]`);
  iconElements.forEach((iconElement) => {
    iconElement.style.width = iconWidth * 0.8 + "px"; // Shrink icon width
    iconElement.style.height = iconWidth * 0.8 + "px"; // Shrink icon height
    const overlay = iconElement.querySelector("div"); // Select overlay
    if (overlay) {
      overlay.classList.remove("hidden"); // Show overlay for grayed-out effect
      overlay.style.pointerEvents = "none"; // Make overlay click-through
    }
  });
}

// Saves the completion status to the SCORM API
function saveProgress() {
  const progressData = JSON.stringify(completionStatus);
  pipwerks.SCORM.set("cmi.suspend_data", progressData);
  pipwerks.SCORM.save();
}

// Marks the course as completed in the SCORM API and updates the display
function completeCourse() {
  progressDisplay.innerText = "Course completed!";
  progressDisplay.classList.remove("bg-gray-700");
  progressDisplay.classList.add("bg-green-500");
  pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
  pipwerks.SCORM.save();
}

// Create and add the progress display element
const progressDisplay = createProgressDisplay();
