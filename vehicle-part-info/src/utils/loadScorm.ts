export const loadSCORMWrapper = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById("scorm-api-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "../libs/SCORM_API_wrapper.js"; // Ensure this matches the correct path
      script.id = "scorm-api-script";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load SCORM API Wrapper"));
      document.body.appendChild(script);
    } else {
      resolve(); // Script already loaded
    }
  });
};
