// courseTracker.js

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

function loadProgress() {
  const progressData = pipwerks.SCORM.get("cmi.suspend_data");
  if (progressData) {
    try {
      completionStatus = JSON.parse(progressData);
      console.log("Progress loaded:", completionStatus);
    } catch (error) {
      console.error("Error parsing suspend_data:", error);
    }
  }
}

export function completePart(partName) {
  if (completionStatus[partName]) return; // Return if part already completed
  completionStatus[partName] = true;
  saveProgress(); // Save to SCORM
  logProgress(); // Log progress to console for debugging

  // Get the icon element and update styles for completion
  const iconElement = document.querySelector(`[data-id="${partName}"]`);
  if (iconElement) {
    iconElement.classList.add("opacity-50", "scale-75"); // Tailwind classes to gray out and shrink
  }

  // Check if all parts are completed
  if (Object.values(completionStatus).every((status) => status)) {
    completeCourse(); // Mark the course as fully completed if all parts are done
  }
}

function saveProgress() {
  const progressData = JSON.stringify(completionStatus);
  pipwerks.SCORM.set("cmi.suspend_data", progressData);
  pipwerks.SCORM.save();
}

// Call updateProgressDisplay when a part is completed
function logProgress() {
  const completedParts = Object.values(completionStatus).filter(Boolean).length;
  console.log(`${completedParts}/8 parts completed`);
}

function completeCourse() {
  pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
  pipwerks.SCORM.save();
}
