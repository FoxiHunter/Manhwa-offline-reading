
const totalChapters = 3;

function getChapters() {
  const result = [];
  for (let i = 1; i <= totalChapters; i++) {
    result.push({
      title: `Глава ${i}`,
      filename: `${i}.png`,
      id: `chapter-${i}`
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

function renderChapters() {
  const reader = document.getElementById('reader');
  const chapters = getChapters();
  chapters.forEach(chapter => {
    const h2 = document.createElement('h2');
    h2.textContent = chapter.title;
    h2.classList.add('chapter-title');
    reader.appendChild(h2);

    const img = document.createElement('img');
    img.src = `images/магия вернувшегося должна быть особенной/${chapter.filename}`;
    img.alt = chapter.title;
    img.classList.add('page-img');
    img.loading = 'lazy';
    reader.appendChild(img);
    
    addFullscreenEvent(img);
    const star = document.createElement('div');
    star.id = `star-${chapter.id}`;
    star.classList.add('star-btn');
    star.addEventListener('click', () => markChapter(chapter.id));
    reader.appendChild(star);

    updateStar(chapter.id);
  });
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

document.addEventListener('DOMContentLoaded', () => {
  renderChapters();
  const toggle = document.getElementById('toggle-effects');
  startSnow();
  toggle.addEventListener('change', function () {
    if (this.checked) {
      document.body.classList.remove('no-effects');
      startSnow();
    } else {
      document.body.classList.add('no-effects');
      stopSnow();
    }
  });
});
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
