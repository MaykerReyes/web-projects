const express = require('express');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DOWNLOADS_DIR = path.join(__dirname, 'downloads');

if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

function findBinary(name) {
  try {
    const where = execSync(`where ${name}`, { timeout: 3000, encoding: 'utf8' });
    const p = where.trim().split('\n')[0].trim();
    if (p && fs.existsSync(p)) return p;
  } catch {}

  const pipPaths = [
    path.join(process.env.APPDATA || '', 'Python', 'Python314', 'Scripts', `${name}.exe`),
    path.join(process.env.APPDATA || '', 'Python', 'Python313', 'Scripts', `${name}.exe`),
    path.join(process.env.APPDATA || '', 'Python', 'Python312', 'Scripts', `${name}.exe`),
    path.join(process.env.APPDATA || '', 'Python', 'Python311', 'Scripts', `${name}.exe`),
    path.join(process.env.USERPROFILE || '', '.local', 'bin', name),
    path.join('C:', 'ProgramData', 'chocolatey', 'bin', `${name}.exe`),
  ];

  for (const p of pipPaths) {
    if (fs.existsSync(p)) return p;
  }

  return name;
}

const YTDLP = findBinary('yt-dlp');
const FFMPEG = findBinary('ffmpeg');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const activeDownloads = new Map();

const FFMPEG_AVAILABLE = checkBinary(findBinary('ffmpeg'), '-version');

const QUALITY_PRESETS = {
  best: {
    format: 'bestvideo+bestaudio/best',
    fallback: 'best',
    label: 'Best Video',
  },
  '1080p': {
    format: 'bestvideo[res<=1080]+bestaudio/best[res<=1080]',
    fallback: 'best[res<=1080]',
    label: '1080p',
  },
  '720p': {
    format: 'bestvideo[res<=720]+bestaudio/best[res<=720]',
    fallback: 'best[res<=720]',
    label: '720p',
  },
  '480p': {
    format: 'bestvideo[res<=480]+bestaudio/best[res<=480]',
    fallback: 'best[res<=480]',
    label: '480p',
  },
  audio: { format: 'bestaudio/best', label: 'Audio Only', extractAudio: true },
  mp3: { format: 'bestaudio/best', label: 'MP3 Only', extractAudio: true, audioFormat: 'mp3' },
};

function extractPlatform(url) {
  if (/youtube\.com|youtu\.be/i.test(url)) return { id: 'youtube', name: 'YouTube' };
  if (/facebook\.com|fb\.com|fb\.watch/i.test(url)) return { id: 'facebook', name: 'Facebook' };
  if (/instagram\.com/i.test(url)) return { id: 'instagram', name: 'Instagram' };
  return { id: 'unknown', name: 'Unknown' };
}

function formatDuration(seconds) {
  if (!seconds) return '--:--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(1)} ${units[i]}`;
}

function checkBinary(bin, args) {
  try {
    execSync(`"${bin}" ${args}`, { stdio: 'ignore', timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

app.get('/api/health', (req, res) => {
  res.json({
    ytDlp: checkBinary(YTDLP, '--version'),
    ffmpeg: checkBinary(FFMPEG, '-version'),
  });
});

app.post('/api/info', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const data = await new Promise((resolve, reject) => {
      const proc = spawn(YTDLP, ['--dump-json', '--no-download', url], { timeout: 30000 });
      let stdout = '';
      let stderr = '';
      proc.stdout.on('data', (d) => { stdout += d; });
      proc.stderr.on('data', (d) => { stderr += d; });
      proc.on('close', (code) => {
        if (code !== 0) return reject(new Error(stderr.trim() || 'Failed to fetch video info'));
        try { resolve(JSON.parse(stdout.trim().split('\n')[0])); }
        catch { reject(new Error('Failed to parse video info')); }
      });
      proc.on('error', () => reject(new Error('yt-dlp not found. Install it from https://github.com/yt-dlp/yt-dlp')));
    });

    const platform = extractPlatform(url);
    res.json({
      title: data.title || 'Unknown',
      thumbnail: data.thumbnail || '',
      duration: data.duration || 0,
      durationFormatted: formatDuration(data.duration),
      platform: platform.name,
      platformId: platform.id,
      uploader: data.uploader || data.channel || 'Unknown',
      formats: (data.formats || []).length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/download', (req, res) => {
  const { url, quality } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const preset = QUALITY_PRESETS[quality] || QUALITY_PRESETS.best;
  const downloadId = crypto.randomUUID();
  const isMp3 = quality === 'mp3';
  const isAudio = quality === 'audio' || isMp3;

  if ((isAudio || isMp3) && !FFMPEG_AVAILABLE) {
    return res.status(400).json({ error: 'Audio extraction requires FFmpeg. Install from https://ffmpeg.org/download.html' });
  }

  const outputTemplate = path.join(DOWNLOADS_DIR, '%(title)s.%(ext)s');
  const fmt = (!FFMPEG_AVAILABLE && preset.fallback) ? preset.fallback : preset.format;
  const args = ['-f', fmt, '-o', outputTemplate, '--newline', '--no-mtime'];

  if (isMp3) {
    args.push('--extract-audio', '--audio-format', 'mp3');
  } else if (isAudio) {
    args.push('--extract-audio');
  }

  args.push(url);

  const proc = spawn(YTDLP, args, { windowsHide: true });
  const state = {
    proc,
    progress: 0,
    speed: '',
    eta: '',
    filename: '',
    done: false,
    success: false,
    error: '',
  };
  activeDownloads.set(downloadId, state);

  let stderrBuf = '';
  proc.stderr.on('data', (data) => {
    stderrBuf += data.toString();
    const lines = stderrBuf.split('\n');
    stderrBuf = lines.pop() || '';

    for (const line of lines) {
      const pct = line.match(/(\d+\.?\d*)%/);
      if (pct) state.progress = parseFloat(pct[1]);

      const speed = line.match(/at\s+([\d.]+[KMG]?i?B\/s)/);
      if (speed) state.speed = speed[1];

      const eta = line.match(/ETA\s+([\d:]+)/);
      if (eta) state.eta = eta[1];

      const dest = line.match(/^\[download\]\s+Destination:\s+(.+)/);
      if (dest) state.filename = path.basename(dest[1].trim());

      if (line.includes('has already been downloaded')) {
        state.progress = 100;
      }
    }
  });

  proc.on('close', (code) => {
    state.progress = 100;
    state.done = true;
    state.success = code === 0;
    if (code !== 0) state.error = `Process exited with code ${code}`;
  });

  proc.on('error', (err) => {
    state.done = true;
    state.success = false;
    state.error = err.message;
  });

  res.json({ downloadId });
});

app.get('/api/progress/:id', (req, res) => {
  const state = activeDownloads.get(req.params.id);
  if (!state) return res.status(404).json({ error: 'Download not found' });

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const send = () => {
    const data = JSON.stringify({
      progress: state.progress,
      speed: state.speed,
      eta: state.eta,
      filename: state.filename,
      done: state.done,
      success: state.success,
      error: state.error,
    });
    res.write(`data: ${data}\n\n`);
    if (state.done) {
      clearInterval(timer);
      res.end();
      setTimeout(() => activeDownloads.delete(req.params.id), 60000);
    }
  };

  const timer = setInterval(send, 400);
  send();
  req.on('close', () => clearInterval(timer));
});

app.post('/api/cancel/:id', (req, res) => {
  const state = activeDownloads.get(req.params.id);
  if (!state) return res.status(404).json({ error: 'Download not found' });
  if (!state.done) {
    state.proc.kill('SIGTERM');
    state.done = true;
    state.success = false;
    state.error = 'Cancelled';
  }
  res.json({ success: true });
});

app.get('/api/list', (req, res) => {
  try {
    const files = fs.readdirSync(DOWNLOADS_DIR)
      .filter((f) => !f.startsWith('.'))
      .map((f) => {
        const stat = fs.statSync(path.join(DOWNLOADS_DIR, f));
        return { name: f, size: stat.size, sizeFormatted: formatSize(stat.size), date: stat.mtime };
      })
      .sort((a, b) => b.date - a.date);
    res.json(files);
  } catch {
    res.json([]);
  }
});

app.get('/api/file/:name', (req, res) => {
  const filePath = path.join(DOWNLOADS_DIR, req.params.name);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.download(filePath);
});

app.delete('/api/file/:name', (req, res) => {
  const filePath = path.join(DOWNLOADS_DIR, req.params.name);
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  checkBinary(YTDLP, '--version')
    ? console.log(`yt-dlp: OK (${YTDLP})`)
    : console.warn('WARNING: yt-dlp not found. Install from https://github.com/yt-dlp/yt-dlp');
  if (YTDLP !== 'yt-dlp') console.log(`yt-dlp path: ${YTDLP}`);
  checkBinary(FFMPEG, '-version')
    ? console.log(`ffmpeg: OK (${FFMPEG})`)
    : console.warn('WARNING: ffmpeg not found. Some formats may fail to merge. Download from https://ffmpeg.org/download.html');
});
