const modalButton = document.getElementById("blockshopAlbumLink");

const releaseModal = document.getElementById("releaseModal");
const closeModal = document.querySelector(".close-modal");

// Initialize modal
modalButton.addEventListener("click", () => {
  openMusicModal();
});

// Close modal handlers
closeModal.addEventListener("click", closeMusicModal);
window.addEventListener("click", (e) => {
  if (e.target === releaseModal) closeMusicModal();
});

function openMusicModal() {
  releaseModal.classList.add("visible");
}

function closeMusicModal() {
  releaseModal.classList.remove("visible");
}
