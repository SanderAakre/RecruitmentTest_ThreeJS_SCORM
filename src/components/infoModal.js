export function showModal(url) {
  const modal = document.createElement("div");
  modal.classList.add(
    "fixed",
    "inset-0",
    "bg-gray-800",
    "bg-opacity-75",
    "flex",
    "items-center",
    "justify-center",
    "z-50"
  );

  const modalContent = document.createElement("div");
  modalContent.classList.add(
    "bg-white",
    "p-6",
    "rounded",
    "shadow-lg",
    "max-w-lg",
    "relative",
    "text-center"
  );

  // Close modal if clicking outside content
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });

  document.body.appendChild(modal);

  // Fetch the WordPress page content
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      // Create a temporary DOM element to parse the HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      // Extract and set the content in the modal (e.g., main content div)
      const wordpressContent = tempDiv.querySelector(".entry-content"); // Adjust as per WordPress theme structure
      if (wordpressContent) {
        modalContent.innerHTML = wordpressContent.innerHTML;
      } else {
        modalContent.innerHTML =
          "<p>Content could not be loaded. Please try again later.</p>";
      }

      // Add a close button
      const closeButton = document.createElement("button");
      closeButton.id = "modal-close";
      closeButton.innerHTML = "&times;";
      closeButton.classList.add(
        "absolute",
        "top-2",
        "right-2",
        "text-2xl",
        "font-bold",
        "text-gray-700",
        "hover:text-black"
      );
      closeButton.addEventListener("click", () => {
        modal.remove();
      });
      modalContent.appendChild(closeButton);
    })
    .catch((error) => {
      console.error("Error loading modal content:", error);
      modalContent.innerHTML = `<p class="text-red-500">Failed to fetch content. Please try again later.</p>`;
    });

  modal.appendChild(modalContent);
}
