import { songs } from "./songs.js";
import { loadSongs } from "./ui.js";
import {
    togglePlay,
    handleProgressClick,
    stopAudio,
    toggleLoop,
    playNext,
    setPlaylist,
    playPrevious,
    playTrack,
    updateVolume,
} from "./player.js";

const musicButton = document.getElementById("musicButton");
const musicModal = document.getElementById("musicModal");
const closeModal = document.querySelector(".close-modal");
const songList = document.getElementById("songList");
const loopButton = document.querySelector(".loop-button");
const nextButton = document.querySelector(".skip-forward-button");
const prevButton = document.querySelector(".skip-back-button");
const controlPlayButton = document.querySelector(".control-play-button");
const volumeButton = document.querySelector(".volume-button");
const volumeContainer = document.querySelector(".volume-slider-container");
const volumeSlider = document.querySelector(".volume-slider");
const nowPlayingTitle = document.getElementById("nowPlayingTitle");
let firstOpen = true;

// Initialize modal
musicButton.addEventListener("click", () => {
    openMusicModal();
    if (firstOpen) {
        firstOpen = false;
        loadSongs(songs, songList);
        setPlaylist(songs);
        volumeSlider.value = localStorage.getItem("volume") ?? 0.5;
    }
});

// Close modal handlers
closeModal.addEventListener("click", closeMusicModal);
window.addEventListener("click", (e) => {
    if (e.target === musicModal) closeMusicModal();
});

function openMusicModal() {
    musicModal.classList.add("visible");
}

function closeMusicModal() {
    musicModal.classList.remove("visible");
}

songList.addEventListener("click", (e) => {
    const button = e.target.closest(".play-button");
    if (button) {
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
    const icon = e.currentTarget.querySelector(".control-icon");
    if (looping) {
        icon.src = "./icons/repeat.svg";
        icon.alt = "Looping enabled";
        e.currentTarget.title = "Looping enabled";
    } else {
        icon.src = "./icons/corner-up-right.svg";
        icon.alt = "Looping disabled";
        e.currentTarget.title = "Looping disabled";
    }
});

nextButton.addEventListener("click", () => playNext());
prevButton.addEventListener("click", () => playPrevious());
controlPlayButton.addEventListener("click", () => playTrack(null));
volumeButton.addEventListener("click", () =>
    volumeContainer.classList.add("visible")
);
nowPlayingTitle.addEventListener("click", () => openMusicModal());
document.addEventListener("click", (e) => {
    if (!e.target.closest(".volume-control")) {
        volumeContainer.classList.remove("visible");
    }
});

volumeSlider.addEventListener("input", (e) => {
    const volume = parseFloat(e.target.value);
    updateVolume(volume);
});
