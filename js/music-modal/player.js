import {
    showPlayControls,
    updateNowPlayingTitle,
    updatePlayButton,
    updateProgress,
} from "./ui.js";

let currentAudio = null;
let currentPlayingId = null;
let currentPlaylist = [];
let currentTrackIndex = -1;
let isLooping = true;
let volumeLevel = localStorage.getItem("volume") ?? 0.5;
let isShuffled = false;

export function togglePlay(songId, songs, isLoop) {
    const song = songs.find((s) => s.id === songId);
    if (!song) return;
    currentTrackIndex = currentPlaylist.findIndex((s) => s.id === songId);

    if (currentPlayingId === songId && currentAudio && !isLoop) {
        // Pause current song
        currentAudio.pause();
        currentPlayingId = null;
        updatePlayButton(songId, false);
    } else {
        // Stop any currently playing song
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            updatePlayButton(currentPlayingId, false);
        }

        // Play new song
        currentAudio = new Audio(song.audioUrl);
        currentAudio.loop = isLooping;
        currentAudio.volume = volumeLevel;
        currentAudio.play();
        currentPlayingId = songId;
        updatePlayButton(songId, true);
        updateNowPlayingTitle(
            Object.values(songs).find((s) => s.id === songId).title
        );
        showPlayControls();

        currentAudio.addEventListener("timeupdate", () => {
            updateProgress(songId, currentAudio.currentTime, song.duration);
        });

        currentAudio.addEventListener("ended", () => {
            updatePlayButton(songId, false);
            updateProgress(songId, 0, song.duration);

            if (!isLooping) {
                playNext();
            }
        });
    }
}

export function handleProgressClick(songId, e, songs) {
    if (currentPlayingId !== songId || !currentAudio) return;

    const progressContainer = e.currentTarget;
    const rect = progressContainer.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const containerWidth = rect.width;
    const seekPercentage = clickPosition / containerWidth;

    currentAudio.currentTime = seekPercentage * currentAudio.duration;
}

export function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
        currentPlayingId = null;
    }
}

// PLAYLIST AND LOOPING
export function setPlaylist(songs) {
    currentPlaylist = [...songs];
    currentTrackIndex = -1;
}

export function toggleLoop() {
    isLooping = !isLooping;
    if (currentAudio) {
        currentAudio.loop = isLooping;
    }
    return isLooping;
}

export function playNext() {
    if (currentPlaylist.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % currentPlaylist.length;
    playTrack(nextIndex);
}

export function playPrevious() {
    if (currentPlaylist.length === 0) return;
    const prevIndex =
        currentTrackIndex - 1 < 0
            ? currentPlaylist.length - 1
            : currentTrackIndex - 1;
    playTrack(prevIndex);
}

export function playTrack(index) {
    if (index === null) {
        index = currentTrackIndex;
    }
    if (index < 0 || index >= currentPlaylist.length) return;
    currentTrackIndex = index;
    const song = currentPlaylist[index];
    togglePlay(song.id, currentPlaylist);
}

export function updateVolume(volume) {
    volumeLevel = volume < 0 ? 0 : volume > 1 ? 1 : volume;
    if (currentAudio) {
        currentAudio.volume = volumeLevel;
    }
    localStorage.setItem("volume", volumeLevel);
}
