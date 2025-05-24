// Format time from seconds to MM:SS
export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Create song player element
export function createSongPlayer(song) {
    const songItem = document.createElement("div");
    songItem.className = "song-item";
    songItem.dataset.id = song.id;

    songItem.innerHTML = `
      <div class="song-info">
        <div class="song-image-container">
          <img class="song-image" src="${song.imageUrl}"/>
        </div>
      </div>
      <div class="song-player-container">
        <div class="song-title">${song.title}</div>
        
        <div class="song-player">
          <button class="play-button control-button" data-id="${song.id}">
            <img src="./icons/play.svg" class="control-icon" data-id="${
                song.id
            }"/>
          </button>
          <div class="progress-container" data-id="${song.id}">
            <div class="progress-bar" data-id="${song.id}"></div>
          </div>
          <div class="time-display" data-id="${song.id}">0:00 / ${formatTime(
        song.duration
    )}
          </div>
        </div>
        <div class="song-actions">
            <a class="download-button" href="${
                song.audioUrl
            }" download="${getDownloadFilename(song)}" title="Download ${
        song.title
    }">
                Download
            </a>
        </div>
      </div>
    `;

    return songItem;
}

// Helper function to create a clean filename
function getDownloadFilename(song) {
    return `${song.title}.mp3`.replace(/[^\w\s.-]/gi, "");
}

// Update play button state
export function updatePlayButton(songId, isPlaying) {
    const button = document.querySelector(`.play-button[data-id="${songId}"]`);
    const icon = button?.querySelector(`.control-icon`);
    const controlPlayButton = document.querySelector(".control-play-button");
    const controlPlayIcon = controlPlayButton?.querySelector(`.control-icon`);
    if (button && icon) {
        if (isPlaying) {
            icon.src = "./icons/pause.svg";
            icon.alt = "Pause song";
            button.title = "Pause song";
        } else {
            icon.src = "./icons/play.svg";
            icon.alt = "Play song";
            button.title = "Play song";
        }
    }
    if (controlPlayButton && controlPlayIcon) {
        if (isPlaying) {
            controlPlayIcon.src = "./icons/pause.svg";
            controlPlayIcon.alt = "Pause song";
            controlPlayButton.title = "Pause song";
        } else {
            controlPlayIcon.src = "./icons/play.svg";
            controlPlayIcon.alt = "Play song";
            controlPlayButton.title = "Play song";
        }
    }
}

// Update progress bar and time display
export function updateProgress(songId, currentTime, duration) {
    const progressBar = document.querySelector(
        `.progress-bar[data-id="${songId}"]`
    );
    const timeDisplay = document.querySelector(
        `.time-display[data-id="${songId}"]`
    );

    if (progressBar) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }

    if (timeDisplay) {
        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(
            duration
        )}`;
    }
}

// Load songs into the modal
export function loadSongs(songs) {
    songList.innerHTML = "";
    songs.forEach((song) => {
        songList.appendChild(createSongPlayer(song));
    });
}

export function showPlayControls() {
    const controller = document.getElementById("musicController");
    controller.classList.remove("hidden");
}

export function updateNowPlayingTitle(song) {
    const nowPlaying = document.getElementById("nowPlayingTitle");
    nowPlaying.textContent = song;
}
