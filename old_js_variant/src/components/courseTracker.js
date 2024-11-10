import { iconWidth } from "./geometryHandler.js";

// Object to store the completion status of each part
let completionStatus = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
  7: false,
  8: false,
};

// Initialize the counter for viewed parts
let viewedParts = 0;
const totalParts = 8;
let progressDisplay;

// Initialize SCORM and load progress
export function initCourse() {
  createProgressDisplay();

  if (pipwerks.SCORM.init()) {
    console.log("SCORM initialized successfully.");
    loadProgress();
  } else {
    console.error("SCORM initialization failed.");
  }

  window.addEventListener("beforeunload", () => {
    pipwerks.SCORM.quit();
  });
}

// Load saved progress from SCORM and update `completionStatus`
function loadProgress() {
  const progressData = pipwerks.SCORM.get("cmi.suspend_data");

  if (progressData) {
    try {
      completionStatus = JSON.parse(progressData);
      console.log("Progress loaded:", completionStatus);

      // Apply completed styling for each completed part
      Object.keys(completionStatus).forEach((partId) => {
        if (completionStatus[partId]) {
          viewedParts++;
          applyCompletedStyling(partId);
          console.log(`Part ${partId} loaded as completed.`);
        }
      });
    } catch (error) {
      console.error("Error parsing suspend_data:", error);
    }
  }

  if (viewedParts === totalParts) {
    console.log("Course already completed.");
    completeCourse();
  } else {
    console.log("Course not yet completed.");
    pipwerks.SCORM.set("cmi.core.lesson_status", "incomplete");
    progressDisplay.innerText = `${viewedParts}/${totalParts} parts viewed`;
  }
}

// Creates the progress display element
function createProgressDisplay() {
  progressDisplay = document.createElement("div");
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

  progressDisplay.innerText = `${viewedParts}/${totalParts} parts viewed`;
  document.body.appendChild(progressDisplay);
}

// Update `completionStatus` when a part is completed and save to SCORM
export function completePart(partId) {
  if (completionStatus[partId]) return; // Skip if already completed

  completionStatus[partId] = true;
  saveProgress(); // Save updated progress to SCORM

  applyCompletedStyling(partId); // Update icon styling

  viewedParts++;
  progressDisplay.innerText = `${viewedParts}/${totalParts} parts viewed`;

  if (viewedParts === totalParts) {
    completeCourse();
  }
}

// Apply completed styling to specified icons based on partId
function applyCompletedStyling(partId) {
  const iconElements = document.querySelectorAll(`[data-scorm-id="${partId}"]`);

  iconElements.forEach((iconElement) => {
    iconElement.style.width = iconWidth * 0.8 + "px";
    iconElement.style.height = iconWidth * 0.8 + "px";

    const overlay = iconElement.querySelector("div");
    if (overlay) {
      overlay.classList.remove("hidden");
      overlay.style.pointerEvents = "none";
    }
  });
}

// Save `completionStatus` to SCORM API
function saveProgress() {
  const progressData = JSON.stringify(completionStatus);
  pipwerks.SCORM.set("cmi.suspend_data", progressData);
  pipwerks.SCORM.save();
}

// Mark course as completed in SCORM and update progress display
function completeCourse() {
  progressDisplay.innerText = "Course completed!";
  progressDisplay.classList.replace("bg-gray-700", "bg-green-500");
  pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
  pipwerks.SCORM.save();
}
