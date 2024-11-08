import React, { useEffect, useState } from "react";
import { iconWidth } from "./GeometryHandler";
import { loadSCORMWrapper } from "../utils/loadScorm";

interface CompletionStatus {
  [key: number]: boolean;
}

const totalParts = 8;
let externalCompletePart: (partId: number) => void;

export const CourseTrackerComponent: React.FC = () => {
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
  });
  const [courseStatus, setCourseStatus] = useState<string>("0/8 parts viewed");

  // SCORM initialization (runs only once)
  useEffect(() => {
    loadSCORMWrapper()
      .then(() => {
        if (window.pipwerks?.SCORM) {
          const initialized = pipwerks.SCORM.init();
          if (initialized) {
            console.log("SCORM initialized successfully.");
          } else {
            console.error("SCORM initialization failed.");
          }
        } else {
          console.error("SCORM API not found.");
        }
      })
      .catch((error) => {
        console.error("Failed to load SCORM API Wrapper:", error);
      });

    // Cleanup function for SCORM
    return () => {
      if (window.pipwerks?.SCORM) {
        pipwerks.SCORM.quit();
      }
    };
  }, []);

  // Set up the external function (runs every render)
  useEffect(() => {
    externalCompletePart = (partId: number) => {
      completePart(partId);
    };
  });

  const completePart = (partId: number) => {
    if (completionStatus[partId]) return;

    const newCompletionStatus = { ...completionStatus, [partId]: true };
    setCompletionStatus(newCompletionStatus);
    applyCompletedStyling(partId);

    const partsViewed = Object.values(newCompletionStatus).filter((status) => status).length;
    updateProgressDisplay(partsViewed);
  };

  const updateProgressDisplay = (partsViewed: number) => {
    if (partsViewed === totalParts) {
      setCourseStatus("Course completed!");
      // Change the color of the div to indicate completion
      document.querySelector(".course-status")?.classList.replace("bg-gray-700", "bg-green-700");
      // Set SCORM course status to completed
      if (window.pipwerks?.SCORM) {
        pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
        pipwerks.SCORM.save();
      }
    } else {
      setCourseStatus(`${partsViewed}/${totalParts} parts viewed`);
    }
  };

  const applyCompletedStyling = (partId: number) => {
    const iconElements = document.querySelectorAll<HTMLDivElement>(`[data-scorm-id="${partId}"]`);
    if (!iconElements) {
      console.error("Could not find icon elements for part:", partId);
      return;
    }
    iconElements.forEach((iconElement) => {
      iconElement.style.width = `${iconWidth * 0.8}px`;
      iconElement.style.height = `${iconWidth * 0.8}px`;

      const overlay = iconElement.querySelector<HTMLDivElement>("div");
      if (overlay) {
        overlay.classList.remove("hidden");
        overlay.style.pointerEvents = "none";
      }
    });
  };

  return (
    <div className="course-status fixed top-4 right-4 bg-gray-700 text-white text-sm font-bold py-1 px-3 rounded-full shadow-lg transition-all duration-300 z-50">
      {courseStatus}
    </div>
  );
};

export function completePartExternally(partId: number) {
  if (externalCompletePart) {
    externalCompletePart(partId);
  } else {
    console.error("completePart function is not yet initialized.");
  }
}

/* import React, { useEffect, useState } from "react";
import { loadSCORMWrapper } from "../utils/loadScorm";
import { iconWidth } from "./GeometryHandler";

interface CompletionStatus {
  [key: number]: boolean;
}

const totalParts = 8;

let externalCompletePart: (partId: number) => void;

export const CourseTrackerComponent: React.FC = () => {
  const [viewedParts, setViewedParts] = useState(0);
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
  });
  const [courseStatus, setCourseStatus] = useState<string>("");

  useEffect(() => {
    // Load the SCORM API wrapper dynamically
    loadSCORMWrapper()
      .then(() => {
        if (window.pipwerks?.SCORM) {
          initCourse();
        } else {
          console.error("SCORM API not found.");
          updateProgressDisplay(); // Show progress even if SCORM fails
        }
      })
      .catch((error) => {
        console.error("Failed to load SCORM API Wrapper:", error);
        updateProgressDisplay(); // Show progress even if SCORM fails
      });

    // Set the externally accessible function
    externalCompletePart = (partId: number) => {
      completePart(partId);
    };
  }, []);

  const initCourse = () => {
    if (pipwerks.SCORM.init()) {
      console.log("SCORM initialized successfully.");
      loadProgress();
    } else {
      console.error("SCORM initialization failed.");
      updateProgressDisplay(); // Show progress even if SCORM initialization fails
    }

    window.addEventListener("beforeunload", () => {
      pipwerks.SCORM.quit();
    });
  };

  const loadProgress = () => {
    const progressData = pipwerks.SCORM.get("cmi.suspend_data");
    if (progressData) {
      try {
        const parsedData = JSON.parse(progressData);
        if (typeof parsedData === "object") {
          setCompletionStatus((prev) => ({ ...prev, ...parsedData }));
          console.log("Progress loaded:", parsedData);

          let partsViewed = 0;
          Object.keys(parsedData).forEach((partId) => {
            if (parsedData[Number(partId)]) {
              partsViewed++;
              applyCompletedStyling(Number(partId));
              console.log(`Part ${partId} loaded as completed.`);
            }
          });
          setViewedParts(partsViewed);
        }
      } catch (error) {
        console.error("Error parsing suspend_data:", error);
      }
    }

    if (viewedParts === totalParts) {
      completeCourse();
    } else {
      pipwerks.SCORM.set("cmi.core.lesson_status", "incomplete");
      updateProgressDisplay();
    }
  };

  const updateProgressDisplay = () => {
    if (viewedParts === totalParts) {
      setCourseStatus("Course completed");
    } else {
      setCourseStatus(`${viewedParts}/${totalParts} parts viewed`);
    }
  };

  const completePart = (partId: number) => {
    if (completionStatus[partId]) return;

    setCompletionStatus((prev) => ({ ...prev, [partId]: true }));
    saveProgress();
    applyCompletedStyling(partId);
    setViewedParts((prev) => prev + 1);
  };

  const saveProgress = () => {
    const progressData = JSON.stringify(completionStatus);
    pipwerks.SCORM.set("cmi.suspend_data", progressData);
    pipwerks.SCORM.save();
  };

  const completeCourse = () => {
    setCourseStatus("Course completed");
    pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
    pipwerks.SCORM.save();
  };

  const applyCompletedStyling = (partId: number) => {
    const iconElements = document.querySelectorAll<HTMLDivElement>(`[data-scorm-id="${partId}"]`);
    iconElements.forEach((iconElement) => {
      iconElement.style.width = `${iconWidth * 0.8}px`;
      iconElement.style.height = `${iconWidth * 0.8}px`;

      const overlay = iconElement.querySelector<HTMLDivElement>("div");
      if (overlay) {
        overlay.classList.remove("hidden");
        overlay.style.pointerEvents = "none";
      }
    });
  };

  return (
    <div className="fixed top-4 right-4 bg-gray-700 text-white text-sm font-bold py-1 px-3 rounded-full shadow-lg transition-all duration-300 z-50">
      {courseStatus}
    </div>
  );
};

export function completePartExternally(partId: number) {
  if (externalCompletePart) {
    externalCompletePart(partId);
  } else {
    console.error("completePart function is not yet initialized.");
  }
}
*/
