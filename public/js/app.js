/* Vanndl – frontend app.js */

const API_BASE = window.location.origin;

// ─── DOM refs ───
const loader = document.getElementById('loader');
const app = document.getElementById('app');
const themeToggle = document.getElementById('themeToggle');
const urlInput = document.getElementById('urlInput');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resultSection = document.getElementById('resultSection');
const resultCard = document.getElementById('resultCard');
const chips = document.querySelectorAll('.chip');

// ─── Theme ───
const savedTheme = localStorage.getItem('vanndl-theme') || 'dark';
setTheme(savedTheme);

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.checked = theme === 'light';
  localStorage.setItem('vanndl-theme', theme);
}

themeToggle.addEventListener('change', () => {
  setTheme(themeToggle.checked ? 'light' : 'dark');
});

// ─── Loader ───
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
      app.classList.remove('hidden');
    }, 500);
  }, 900);
});

// ─── Platform selection ───
let selectedPlatform = 'auto';

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedPlatform = chip.dataset.platform;
    updatePlaceholder();
  });
});

function updatePlaceholder() {
  const placeholders = {
    auto: 'Paste TikTok, Instagram, or Spotify link…',
    tiktok: 'Paste TikTok video URL…',
    instagram: 'Paste Instagram post or reel URL…',
    spotify: 'Paste Spotify track URL…'
  };
  urlInput.placeholder = placeholders[selectedPlatform] || placeholders.auto;
}

// ─── Input clear button ───
urlInput.addEventListener('input', () => {
  clearBtn.classList.toggle('hidden', !urlInput.value.trim());
  // Auto-detect platform from URL
  if (selectedPlatform === 'auto') autoDetectChip(urlInput.value);
});

clearBtn.addEventListener('click', () => {
  urlInput.value = '';
  clearBtn.classList.add('hidden');
  urlInput.focus();
});

function autoDetectChip(url) {
  // Just highlight the matching chip visually without changing state
  chips.forEach(c => {
    if (c.dataset.platform === 'auto') return;
    const platforms = {
      tiktok: ['tiktok.com', 'vt.tiktok'],
      instagram: ['instagram.com'],
      spotify: ['spotify.com']
    };
    const matches = (platforms[c.dataset.platform] || []).some(d => url.includes(d));
    c.style.opacity = matches ? '1' : '0.5';
  });
}

// ─── Detect platform from URL ───
function detectPlatform(url) {
  if (url.includes('tiktok.com') || url.includes('vt.tiktok')) return 'tiktok';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('spotify.com') || url.includes('open.spotify')) return 'spotify';
  return null;
}

// ─── Icons ───
const platformIcons = {
  tiktok: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.67a8.26 8.26 0 004.84 1.55V6.78a4.85 4.85 0 01-1.07-.09z"/></svg>`,
  instagram: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  spotify: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`
};

const typeIcons = {
  video: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  audio: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  image: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
};

const dlArrow = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

// ─── Stat icons ───
function statHtml(stats = {}) {
  const items = [];
  if (stats.likes != null) items.push(`<span class="stat-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>${formatNum(stats.likes)}</span>`);
  if (stats.comments != null) items.push(`<span class="stat-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>${formatNum(stats.comments)}</span>`);
  if (stats.shares != null) items.push(`<span class="stat-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>${formatNum(stats.shares)}</span>`);
  return items.length ? `<div class="media-stats">${items.join('')}</div>` : '';
}

function formatNum(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function formatDuration(secs) {
  if (!secs) return '';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── Render result ───
function renderResult(data) {
  const platform = data.platform;
  const thumbHtml = data.thumbnail
    ? `<img class="media-thumb" src="${data.thumbnail}" alt="thumbnail" onerror="this.style.display='none'" />`
    : `<div class="media-thumb-placeholder">${typeIcons[platform === 'spotify' ? 'audio' : 'video']}</div>`;

  let extraMeta = '';
  if (data.duration) extraMeta += `<span class="stat-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${formatDuration(data.duration)}</span>`;
  if (data.album) extraMeta += `<span class="stat-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/></svg>${data.album}</span>`;

  const dlBtns = data.downloads.map((dl, i) => `
    <button class="dl-btn" onclick="triggerDownload('${escAttr(dl.url)}', '${escAttr(dl.label)}', '${escAttr(dl.type)}', this)">
      <span class="dl-btn-left">
        <span class="dl-btn-icon">${typeIcons[dl.type] || dlArrow}</span>
        ${dl.label}
      </span>
      <span class="dl-btn-arrow dl-btn-status">${dlArrow}</span>
    </button>
  `).join('');

  resultCard.innerHTML = `
    <div class="media-info">
      ${thumbHtml}
      <div class="media-details">
        <div class="media-platform">${platformIcons[platform] || ''} ${platform.charAt(0).toUpperCase() + platform.slice(1)}</div>
        <div class="media-title">${escHtml(data.title)}</div>
        <div class="media-author">by ${escHtml(data.author)}</div>
        ${statHtml(data.stats)}
        ${extraMeta ? `<div class="media-stats">${extraMeta}</div>` : ''}
      </div>
    </div>
    <div class="downloads-list">
      <div class="downloads-label">Download Options</div>
      ${dlBtns}
    </div>
  `;
  resultSection.classList.remove('hidden');
}

function renderError(msg) {
  resultCard.innerHTML = `
    <div class="result-error">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      ${escHtml(msg)}
    </div>
  `;
  resultSection.classList.remove('hidden');
}

function renderLoading() {
  resultCard.innerHTML = `
    <div class="result-loading">
      <div class="three-body">
        <div class="three-body__dot"></div>
        <div class="three-body__dot"></div>
        <div class="three-body__dot"></div>
      </div>
      <span>Fetching media info…</span>
    </div>
  `;
  resultSection.classList.remove('hidden');
}

function escAttr(str) {
  return (str || '').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}

// Download via proxy to force blob save (no tab redirect)
async function triggerDownload(url, label, type, btn) {
  const statusEl = btn.querySelector('.dl-btn-status');
  const spinner = `<div class="three-body" style="--uib-size:18px;--uib-speed:0.7s;--uib-color:#8350C4"><div class="three-body__dot"></div><div class="three-body__dot"></div><div class="three-body__dot"></div></div>`;
  const checkIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;

  btn.disabled = true;
  statusEl.innerHTML = spinner;

  const ext = type === 'audio' ? 'mp3' : type === 'image' ? 'jpg' : 'mp4';
  const filename = `${label.replace(/\s+/g, '_')}.${ext}`;

  try {
    // Route through our backend proxy to avoid CORS/redirect issues
    const res = await fetch(`${API_BASE}/api/proxy-download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, filename })
    });

    if (!res.ok) throw new Error('Download failed');

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);

    statusEl.innerHTML = checkIcon;
    setTimeout(() => { statusEl.innerHTML = dlArrow; btn.disabled = false; }, 3000);
  } catch (err) {
    statusEl.innerHTML = dlArrow;
    btn.disabled = false;
    alert('Download gagal. Coba lagi.');
  }
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

// ─── Fetch handler ───
async function handleFetch() {
  const url = urlInput.value.trim();
  if (!url) {
    urlInput.focus();
    return;
  }

  const platform = selectedPlatform === 'auto' ? detectPlatform(url) : selectedPlatform;
  if (!platform) {
    renderError('Unsupported link. Please paste a TikTok, Instagram, or Spotify URL.');
    return;
  }

  downloadBtn.disabled = true;
  renderLoading();

  try {
    const res = await fetch(`${API_BASE}/api/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Unknown error');
    renderResult(data);
  } catch (err) {
    renderError(err.message || 'Failed to fetch. Please check the link and try again.');
  } finally {
    downloadBtn.disabled = false;
  }
}

downloadBtn.addEventListener('click', handleFetch);
urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleFetch(); });
