// main.js

const totalChapters = 219;
const startFrom = 18;
const batchSize = 20;
let loadedBatches = 0;
const chapters = getChapters();
let isLoading = false;

function getChapters() {
  const result = [];
  for (let i = 0; i < totalChapters; i++) {
    const chapterNumber = startFrom + i;
    result.push({
      title: `Глава ${chapterNumber}`,
      folder: `${chapterNumber}`,
      id: `chapter-${chapterNumber}`
    });
  }
  return result;
}

function isChapterRead(id) {
  return localStorage.getItem(id) === "read";
}

function markChapter(id) {
  const isRead = isChapterRead(id);
  if (isRead) {
    localStorage.removeItem(id);
  } else {
    localStorage.setItem(id, "read");
  }
  updateStar(id);
}

function updateStar(id) {
  const star = document.getElementById(`star-${id}`);
  if (isChapterRead(id)) {
    star.classList.add("read");
    star.textContent = "★ Прочитано";
  } else {
    star.classList.remove("read");
    star.textContent = "☆ Отметить как прочитано";
  }
}

function loadNextBatch() {
  if (isLoading) return;
  isLoading = true;

  const startIndex = loadedBatches * batchSize;
  const endIndex = Math.min(startIndex + batchSize, chapters.length);

  let totalImages = 0;
  let loadedImages = 0;

  for (let i = startIndex; i < endIndex; i++) {
    const chapter = chapters[i];
    const reader = document.getElementById('reader');

    const h2 = document.createElement('h2');
    h2.textContent = chapter.title;
    h2.classList.add('chapter-title');
    h2.id = chapter.id;
    reader.appendChild(h2);

    const chapterFolder = `images/магия вернувшегося должна быть особенной/${chapter.folder}`;

    for (let j = 1; j <= 100; j++) {
      const img = document.createElement('img');
      const filename = j < 10 ? `0${j}` : `${j}`;
      const pngPath = `${chapterFolder}/${filename}.png`;
      const jpegPath = `${chapterFolder}/${filename}.jpeg`;

      img.src = pngPath;
      img.alt = `${chapter.title} - страница ${j}`;
      img.classList.add('page-img');
      img.loading = 'lazy';

      totalImages++;

      img.onload = img.onerror = () => {
        loadedImages++;
        if (loadedImages === totalImages && loadedBatches === 0) {
          showContentAfterLoad();
        }
      };

      img.onerror = () => {
        img.onerror = null;
        img.src = jpegPath;
        img.onerror = () => {
          loadedImages++;
          img.remove();
        };
      };

      reader.appendChild(img);
      addFullscreenEvent(img);
    }

    const star = document.createElement('div');
    star.id = `star-${chapter.id}`;
    star.classList.add('star-btn');
    star.addEventListener('click', () => markChapter(chapter.id));
    reader.appendChild(star);
    updateStar(chapter.id);
  }

  loadedBatches++;
  isLoading = false;

  if (loadedBatches * batchSize < chapters.length) {
    observeLastChapter();
  }
}

function observeLastChapter() {
  const lastIndex = loadedBatches * batchSize - 1;
  const lastChapterEl = document.getElementById(chapters[lastIndex].id);
  if (!lastChapterEl) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.disconnect();
        loadNextBatch();
      }
    });
  }, { rootMargin: '200px' });

  observer.observe(lastChapterEl);
}

function scrollToLastReadChapter() {
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (isChapterRead(chapters[i].id)) {
      const tryScroll = () => {
        const el = document.getElementById(chapters[i].id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else setTimeout(tryScroll, 500);
      };
      tryScroll();
      break;
    }
  }
}

function showContentAfterLoad() {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
  scrollToLastReadChapter();
}

function startSnow() {
  const container = document.getElementById('snow-container');
  if (!container) return;
  container.innerHTML = '';
  const flakes = 80;
  for (let i = 0; i < flakes; i++) {
    const flake = document.createElement('div');
    flake.classList.add('flake');
    const size = Math.random() * 3 + 1;
    flake.style.width = flake.style.height = `${size}px`;
    flake.style.left = `${Math.random() * 100}%`;
    const duration = 10 + Math.random() * 20;
    flake.style.animationDuration = `${duration}s`;
    flake.style.animationDelay = `${-Math.random() * duration}s`;
    flake.style.opacity = (Math.random() * 0.6 + 0.4).toFixed(2);
    container.appendChild(flake);
  }
}

function stopSnow() {
  const container = document.getElementById('snow-container');
  if (!container) return;
  container.innerHTML = '';
}

function enableFullscreen(img) {
  const container = document.createElement('div');
  container.classList.add('fullscreen');

  const closeBtn = document.createElement('div');
  closeBtn.classList.add('close-btn');
  closeBtn.innerHTML = '✕';

  const imgClone = img.cloneNode(true);
  imgClone.addEventListener('click', () => document.body.removeChild(container));
  closeBtn.addEventListener('click', () => document.body.removeChild(container));

  container.appendChild(closeBtn);
  container.appendChild(imgClone);
  document.body.appendChild(container);
}

function addFullscreenEvent(img) {
  img.addEventListener('click', () => enableFullscreen(img));
}

// Инициализация

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('skip-loader').addEventListener('click', () => {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
    scrollToLastReadChapter();
  });

  startSnow();

  const toggle = document.getElementById('toggle-effects');
  toggle.addEventListener('change', function () {
    if (this.checked) {
      document.body.classList.remove('no-effects');
      startSnow();
    } else {
      document.body.classList.add('no-effects');
      stopSnow();
    }
  });

  loadNextBatch();
});
