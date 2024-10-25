import { showModal } from "./infoModal";

export const createIcon = (iconWidth) => {
  const iconElement = document.createElement("div");
  iconElement.classList.add(
    "absolute",
    "bg-cover",
    "cursor-pointer",
    "rounded-full"
  );
  iconElement.style.width = `${iconWidth}px`;
  iconElement.style.height = `${iconWidth}px`;
  iconElement.style.backgroundImage = 'url("/icon.png")';
  document.body.appendChild(iconElement);

  // Add event listener for click
  iconElement.addEventListener("click", () => {
    showModal();
  });
  return iconElement;
};
