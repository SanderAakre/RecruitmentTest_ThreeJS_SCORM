import React, { useEffect, useState } from "react";
import { iconWidth } from "./GeometryHandler";

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
    let retryCount = 0;
    const maxRetries = 10;
    const initScorm = () => {
      if (window.pipwerks?.SCORM) {
        console.log("SCORM API found, attempting to initialize connection.");
        const initialized = pipwerks.SCORM.init();
        if (initialized) {
          console.log("SCORM initialized successfully.");
        } else {
          console.error("SCORM initialization failed.");
        }
      } else {
        console.error("SCORM API not found.");
        // Retry counter to avoid infinite loop
        const retryInitScorm = () => {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying SCORM initialization (${retryCount}/${maxRetries})...`);
            setTimeout(initScorm, 1000);
          } else {
            console.error("Max retries reached. SCORM initialization failed.");
          }
        };

        retryInitScorm();
      }
    };
    initScorm();

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
      console.log("All parts viewed! Attempting to set SCORM status to completed.");
      setCourseStatus("Course completed!");
      document.querySelector(".course-status")?.classList.replace("bg-gray-700", "bg-green-500");

      if (window.pipwerks?.SCORM) {
        console.log("SCORM API found, checking connection activation status.");
        if (!pipwerks.SCORM.connection.isActive) {
          console.log("SCORM connection is not active. Reinitializing connection.");
          const reinitialized = pipwerks.SCORM.init();
          if (!reinitialized) {
            console.error("Failed to reinitialize SCORM connection.");
            return;
          }
        } else {
          console.log("SCORM connection is active.");
        }
        pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
        pipwerks.SCORM.save();
      } else {
        console.error("SCORM API not found.");
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
