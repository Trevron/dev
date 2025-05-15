import { updatePlayButton, updateProgress } from "./ui.js";

let currentAudio = null;
let currentPlayingId = null;
let currentPlaylist = [];
let currentTrackIndex = -1;
let isLooping = false;
let isShuffled = false;

export function togglePlay(songId, songs, isLoop) {
    const song = songs.find((s) => s.id === songId);
    if (!song) return;

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
        currentAudio.play();
        currentPlayingId = songId;
        updatePlayButton(songId, true);

        currentAudio.addEventListener("timeupdate", () => {
            updateProgress(songId, currentAudio.currentTime, song.duration);
        });

        currentAudio.addEventListener("ended", () => {
            updatePlayButton(songId, false);
            updateProgress(songId, 0, song.duration);

            if (isLooping) {
                // Replay the same track if looping
                //   togglePlay(songId, currentPlaylist, true);
            } else {
                // Play next track in playlist
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

export function playTrack(index) {
    if (index < 0 || index >= currentPlaylist.length) return;

    currentTrackIndex = index;
    const song = currentPlaylist[index];
    togglePlay(song.id, currentPlaylist);
}
