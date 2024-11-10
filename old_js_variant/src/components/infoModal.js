export function showModal(url) {
  const modal = document.createElement("div");
  modal.classList.add("fixed", "inset-0", "bg-gray-800", "bg-opacity-75", "flex", "items-center", "justify-center", "z-50");

  const modalContent = document.createElement("div");
  modalContent.classList.add("bg-white", "rounded", "shadow-lg", "overflow-hidden", "relative", "w-full", "max-w-2xl", "h-3/4", "flex", "flex-col");

  // Close modal if clicking outside content
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });

  // Create iframe that displays the URL
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.classList.add("w-full", "h-full", "flex-grow");
  iframe.style.border = "none";

  // Append the iframe to the modal content
  modalContent.appendChild(iframe);

  // Add a centered Close button at the bottom
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.classList.add("bg-gray-700", "hover:bg-gray-900", "text-white", "font-bold", "py-2", "rounded", "w-full", "max-w-xs", "mx-auto", "mb-4", "mt-2");
  closeButton.addEventListener("click", () => {
    modal.remove();
  });

  // Append the close button to the modal content
  modalContent.appendChild(closeButton);

  // Append modal content to modal, then to the body
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}
