import { songs } from "./songs.js";
import { loadSongs } from "./ui.js";
import {
    togglePlay,
    handleProgressClick,
    stopAudio,
    toggleLoop,
    playNext,
    setPlaylist,
} from "./player.js";

const musicButton = document.getElementById("musicButton");
const musicModal = document.getElementById("musicModal");
const closeModal = document.querySelector(".close-modal");
const songList = document.getElementById("songList");
const loopButton = document.querySelector(".loop-button");
const nextButton = document.querySelector(".next-button");

// Initialize modal
musicButton.addEventListener("click", () => {
    musicModal.style.display = "block";
    loadSongs(songs, songList);
    setPlaylist(songs);
});

// Close modal handlers
closeModal.addEventListener("click", closeMusicModal);
window.addEventListener("click", (e) => {
    if (e.target === musicModal) closeMusicModal();
});

function closeMusicModal() {
    musicModal.style.display = "none";
    stopAudio();
}

songList.addEventListener("click", (e) => {
    if (e.target.classList.contains("play-button")) {
        const songId = parseInt(e.target.dataset.id);
        togglePlay(songId, songs);
    }

    if (
        e.target.classList.contains("progress-container") ||
        e.target.classList.contains("progress-bar")
    ) {
        const songId = parseInt(e.target.dataset.id);
        handleProgressClick(songId, e, songs);
    }
});

loopButton.addEventListener("click", (e) => {
    const looping = toggleLoop();
    e.target.textContent = looping ? "🔁" : "↩️";
    e.target.title = looping ? "Looping enabled" : "Looping disabled";
});

nextButton.addEventListener("click", () => playNext());
