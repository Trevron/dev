import { projects } from './projects.js';

const carouselTrack = document.getElementById('carouselTrack');
const prevButton = document.getElementById('carouselPrev');
const nextButton = document.getElementById('carouselNext');

// Modal elements
const releaseModal = document.getElementById('releaseModal');
const closeModal = releaseModal.querySelector('.close-modal');
const releaseTitle = document.getElementById('releaseTitle');
const releaseLinks = document.getElementById('releaseLinks');
const bandcampSection = document.getElementById('bandcampSection');
const bandcampPlayer = document.getElementById('bandcampPlayer');
const steamWidget = document.getElementById('steamWidget');
const comingSoonBadge = document.getElementById('comingSoonBadge');

let currentIndex = 1;
let isAnimating = false;
let touchStartX = 0;
let touchEndX = 0;

// Position classes for carousel cards
const positions = ['far-left', 'left', 'center', 'right', 'far-right'];

function init() {
  renderCards();
  updateCarousel(false);
  setupEventListeners();
}

function renderCards() {
  carouselTrack.innerHTML = '';

  projects.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.dataset.index = index;

    card.innerHTML = `
      <div class="card-inner">
        ${project.comingSoon ? '<span class="coming-soon-tag">Coming Soon</span>' : ''}
        <h3>${project.title}</h3>
        <img src="${project.image}" alt="${project.title}" class="card-image" />
      </div>
    `;

    carouselTrack.appendChild(card);
  });
}

function getPositionIndex(cardIndex) {
  // Calculate position relative to current center
  const totalCards = projects.length;
  let diff = cardIndex - currentIndex;

  // Normalize for infinite looping
  if (diff > totalCards / 2) diff -= totalCards;
  if (diff < -totalCards / 2) diff += totalCards;

  // Map diff to position: -2=far-left, -1=left, 0=center, 1=right, 2=far-right
  return diff + 2;
}

function updateCarousel(animate = true) {
  const cards = carouselTrack.querySelectorAll('.carousel-card');

  cards.forEach((card, index) => {
    // Remove all position classes
    positions.forEach(pos => card.classList.remove(pos));

    const posIndex = getPositionIndex(index);

    if (posIndex >= 0 && posIndex < positions.length) {
      card.classList.add(positions[posIndex]);
      card.style.visibility = 'visible';
    } else {
      // Hide cards that are too far away
      card.style.visibility = 'hidden';
    }

    if (animate) {
      card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
    } else {
      card.style.transition = 'none';
    }
  });
}

function navigate(direction) {
  if (isAnimating) return;
  isAnimating = true;

  const totalCards = projects.length;

  if (direction === 'next') {
    currentIndex = (currentIndex + 1) % totalCards;
  } else {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
  }

  updateCarousel(true);

  setTimeout(() => {
    isAnimating = false;
  }, 400);
}

function openModal(projectIndex) {
  const project = projects[projectIndex];

  releaseTitle.textContent = `${project.title} (${project.subtitle})`;

  // Handle coming soon badge
  if (project.comingSoon) {
    comingSoonBadge.style.display = 'inline-block';
  } else {
    comingSoonBadge.style.display = 'none';
  }

  // Handle links section
  if (project.hyperfollow) {
    releaseLinks.href = project.hyperfollow;
    releaseLinks.style.display = 'block';
  } else {
    releaseLinks.style.display = 'none';
  }

  // Handle Bandcamp section
  if (project.bandcamp) {
    bandcampSection.style.display = 'block';
    bandcampPlayer.src = project.bandcamp.embedSrc;
  } else {
    bandcampSection.style.display = 'none';
    bandcampPlayer.src = '';
  }

  // Handle Steam widget
  if (project.steamWidget) {
    steamWidget.style.display = 'block';
    steamWidget.querySelector('iframe').src = project.steamWidget;
  } else {
    steamWidget.style.display = 'none';
  }

  releaseModal.classList.add('visible');
}

function closeModalHandler() {
  releaseModal.classList.remove('visible');
}

function handleCardClick(e) {
  const card = e.target.closest('.carousel-card');
  if (!card) return;

  const cardIndex = parseInt(card.dataset.index);

  if (card.classList.contains('center')) {
    // Open modal for center card
    openModal(cardIndex);
  } else if (card.classList.contains('left')) {
    // Navigate to previous
    navigate('prev');
  } else if (card.classList.contains('right')) {
    // Navigate to next
    navigate('next');
  }
}

function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      navigate('next');
    } else {
      navigate('prev');
    }
  }
}

function setupEventListeners() {
  prevButton.addEventListener('click', () => navigate('prev'));
  nextButton.addEventListener('click', () => navigate('next'));

  carouselTrack.addEventListener('click', handleCardClick);

  // Touch events for swipe
  carouselTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
  carouselTrack.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Modal close handlers
  closeModal.addEventListener('click', closeModalHandler);
  window.addEventListener('click', (e) => {
    if (e.target === releaseModal) closeModalHandler();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (releaseModal.classList.contains('visible')) return;

    if (e.key === 'ArrowLeft') {
      navigate('prev');
    } else if (e.key === 'ArrowRight') {
      navigate('next');
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
