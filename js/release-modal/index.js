const blockshopButton = document.getElementById("blockshopAlbumLink");
const blockshopPlayer = document.getElementById("blockshopPlayer");
const steamBlockshop = document.getElementById("steamBlockshop");
const hypersliceButton = document.getElementById("hypersliceAlbumLink");
const hyperslicePlayer = document.getElementById("hyperslicePlayer");
const steamHyperslice = document.getElementById("steamHyperslice");

const releaseModal = document.getElementById("releaseModal");
const closeModal = document.querySelector(".close-modal");
const releaseTitle = document.getElementById("releaseTitle");
const releaseLinks = document.getElementById("releaseLinks");

const blockshopDetails = {
  iFrameSrc: "https://bandcamp.com/EmbeddedPlayer/album=3816339469/size=large/bgcol=333333/linkcol=0f91ff/tracklist=true/artwork=none/transparent=true/",
  albumUrl: "https://trevron.bandcamp.com/album/block-shop-official-game-soundtrack",
  hyperfollow: "https://distrokid.com/hyperfollow/trevron/block-shop-official-game-soundtrack",
  title: "Block Shop (Official Game Soundtrack)",
}

const hypersliceDetails = {
  iFrameSrc: "https://bandcamp.com/EmbeddedPlayer/album=1454649338/size=large/bgcol=333333/linkcol=0f91ff/tracklist=true/artwork=none/transparent=true/",
  albumUrl: "https://trevron.bandcamp.com/album/hyperslice-official-game-soundtrack",
  hyperfollow: "https://distrokid.com/hyperfollow/trevron/hyperslice-official-game-soundtrack",
  title: "Hyperslice (Official Game Soundtrack)",
}

// Open blockshop
blockshopButton.addEventListener("click", () => {
  releaseTitle.innerText = blockshopDetails.title;
  releaseLinks.href = blockshopDetails.hyperfollow;
  blockshopPlayer.style.display = "block";
  hyperslicePlayer.style.display = "none";
  steamBlockshop.style.display = "block";
  steamHyperslice.style.display = "none";
  openMusicModal();
});

// Open hyperslice
hypersliceButton.addEventListener("click", () => {
  releaseTitle.innerText = hypersliceDetails.title;
  releaseLinks.href = hypersliceDetails.hyperfollow;
  blockshopPlayer.style.display = "none";
  hyperslicePlayer.style.display = "block";
  steamBlockshop.style.display = "none";
  steamHyperslice.style.display = "block";
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
