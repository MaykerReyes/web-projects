const $ = (id) => document.getElementById(id);

const urlInput = $('urlInput');
const fetchBtn = $('fetchBtn');
const errorMsg = $('errorMsg');
const infoCard = $('infoCard');
const thumbnail = $('thumbnail');
const durationBadge = $('durationBadge');
const platformBadge = $('platformBadge');
const videoTitle = $('videoTitle');
const videoUploader = $('videoUploader');
const qualitySelect = $('qualitySelect');
const downloadBtn = $('downloadBtn');
const progressSection = $('progressSection');
const progressFill = $('progressFill');
const progressPct = $('progressPct');
const progressSpeed = $('progressSpeed');
const progressEta = $('progressEta');
const cancelBtn = $('cancelBtn');
const downloadsList = $('downloadsList');
const downloadCount = $('downloadCount');
const toast = $('toast');

let currentUrl = '';
let currentDownloadId = null;
let eventSource = null;
let isDownloading = false;

const PLATFORM_STYLES = {
  youtube: { cls: 'youtube', label: 'YouTube', icon: '&#9654;' },
  facebook: { cls: 'facebook', label: 'Facebook', icon: '&#9654;' },
  instagram: { cls: 'instagram', label: 'Instagram', icon: '&#9654;' },
  unknown: { cls: 'unknown', label: 'Unknown', icon: '&#9654;' },
};

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.add('visible');
}

function hideError() {
  errorMsg.classList.remove('visible');
  errorMsg.textContent = '';
}

function showToast(msg, duration) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.add('hidden'), duration || 2500);
}

function formatSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(1)} ${units[i]}`;
}

function showInfo(data) {
  thumbnail.src = data.thumbnail || '';
  thumbnail.alt = data.title;
  durationBadge.textContent = data.durationFormatted || '--:--';

  const p = PLATFORM_STYLES[data.platformId] || PLATFORM_STYLES.unknown;
  platformBadge.className = `platform-badge ${p.cls}`;
  platformBadge.innerHTML = `${p.icon} ${p.label}`;

  videoTitle.textContent = data.title;
  videoUploader.textContent = data.uploader;

  infoCard.classList.remove('hidden');
  progressSection.classList.add('hidden');
  hideError();
}

function showProgress(state) {
  const pct = Math.min(state.progress, 100);
  progressFill.style.width = `${pct}%`;
  progressPct.textContent = `${Math.round(pct)}%`;
  progressSpeed.textContent = state.speed || '';
  progressEta.textContent = state.eta || '';
}

async function fetchInfo(url) {
  hideError();
  fetchBtn.disabled = true;
  fetchBtn.textContent = 'Loading...';

  try {
    const res = await fetch('/api/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch info');
    showInfo(data);
  } catch (err) {
    infoCard.classList.add('hidden');
    showError(err.message);
  } finally {
    fetchBtn.disabled = false;
    fetchBtn.textContent = 'Fetch Info';
  }
}

function startProgressStream(downloadId) {
  currentDownloadId = downloadId;
  isDownloading = true;
  progressSection.classList.remove('hidden');
  progressFill.style.width = '0%';
  progressPct.textContent = '0%';
  progressSpeed.textContent = '';
  progressEta.textContent = '';
  downloadBtn.disabled = true;
  fetchBtn.disabled = true;
  urlInput.disabled = true;

  eventSource = new EventSource(`/api/progress/${downloadId}`);
  eventSource.onmessage = (e) => {
    const state = JSON.parse(e.data);
    showProgress(state);

    if (state.done) {
      eventSource.close();
      eventSource = null;
      isDownloading = false;
      downloadBtn.disabled = false;
      fetchBtn.disabled = false;
      urlInput.disabled = false;
      currentDownloadId = null;

      if (state.success) {
        showProgress({ progress: 100, speed: '', eta: '' });
        showToast('Download complete!');
        loadDownloads();
      } else {
        showToast(state.error || 'Download failed', 4000);
      }
    }
  };

  eventSource.onerror = () => {
    eventSource.close();
    eventSource = null;
    isDownloading = false;
    downloadBtn.disabled = false;
    fetchBtn.disabled = false;
    urlInput.disabled = false;
    currentDownloadId = null;
    showToast('Connection lost', 3000);
  };
}

async function startDownload() {
  if (isDownloading || !currentUrl) return;

  hideError();
  downloadBtn.disabled = true;

  try {
    const res = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: currentUrl, quality: qualitySelect.value }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to start download');
    startProgressStream(data.downloadId);
  } catch (err) {
    downloadBtn.disabled = false;
    showError(err.message);
  }
}

function cancelDownload() {
  if (!currentDownloadId) return;
  fetch(`/api/cancel/${currentDownloadId}`, { method: 'POST' }).catch(() => {});
}

async function loadDownloads() {
  try {
    const res = await fetch('/api/list');
    const files = await res.json();
    renderDownloads(files);
  } catch {
    // silent
  }
}

function renderDownloads(files) {
  downloadCount.textContent = files.length;

  if (files.length === 0) {
    downloadsList.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.3">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <p>No downloads yet</p>
      </div>`;
    return;
  }

  downloadsList.innerHTML = files
    .map((f) => {
      const isAudio = /\.(mp3|m4a|opus|wav|flac)$/i.test(f.name);
      return `
        <div class="download-item">
          <div class="download-icon ${isAudio ? 'audio' : ''}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${isAudio
                ? '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'
                : '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>'
              }
            </svg>
          </div>
          <div class="download-info">
            <div class="download-name" title="${f.name}">${f.name}</div>
            <div class="download-meta">${f.sizeFormatted} &middot; ${new Date(f.date).toLocaleDateString()}</div>
          </div>
          <div class="download-actions">
            <button class="btn-sm" onclick="downloadFile('${f.name}')">Save</button>
            <button class="btn-sm danger" onclick="deleteFile('${f.name}')">Delete</button>
          </div>
        </div>`;
    })
    .join('');
}

window.downloadFile = function (name) {
  window.open(`/api/file/${encodeURIComponent(name)}`, '_blank');
};

window.deleteFile = async function (name) {
  try {
    const res = await fetch(`/api/file/${encodeURIComponent(name)}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('File deleted');
      loadDownloads();
    }
  } catch {
    showToast('Failed to delete file', 3000);
  }
};

fetchBtn.addEventListener('click', () => {
  const url = urlInput.value.trim();
  if (!url) { showError('Please enter a URL'); return; }
  currentUrl = url;
  fetchInfo(url);
});

urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') fetchBtn.click();
});

downloadBtn.addEventListener('click', startDownload);

cancelBtn.addEventListener('click', () => {
  cancelDownload();
  showToast('Download cancelled');
});

window.addEventListener('load', () => {
  loadDownloads();
});
