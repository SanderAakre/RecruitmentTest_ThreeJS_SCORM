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
    "rounded",
    "shadow-lg",
    "overflow-hidden",
    "relative",
    "w-full",
    "max-w-2xl",
    "h-3/4" // Adjust height as needed
  );

  // Close modal if clicking outside content
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });

  // Create the iframe to display the WordPress content
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.classList.add("w-full", "h-full");
  iframe.style.border = "none"; // Remove default iframe border for a cleaner look

  // Append the iframe to the modal content
  modalContent.appendChild(iframe);

  // Add a close button to the modal
  const closeButton = document.createElement("button");
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

  // Append modal content to modal, then to the body
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}
