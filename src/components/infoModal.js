// infoModal.js
export function showModal() {
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

  // Fetch content from WordPress (replace URL with your WordPress API endpoint)
  fetch("https://jsonplaceholder.typicode.com/posts/1") // Example placeholder API
    .then((response) => response.json())
    .then((data) => {
      modalContent.innerHTML = `
        <button id="modal-close" class="absolute top-2 right-2 text-2xl font-bold text-gray-700 hover:text-black">&times;</button>
        <h2 class="text-2xl font-bold mb-4">${data.title}</h2>
        <p class="mb-4">${data.body}</p>
      `;

      // Add event listener to close modal on "X" button click
      document.getElementById("modal-close").addEventListener("click", () => {
        modal.remove();
      });
    })
    .catch((error) => {
      modalContent.innerHTML = `<p class="text-red-500">Failed to fetch content. Please try again later.</p>`;
    });

  modal.appendChild(modalContent);
}
