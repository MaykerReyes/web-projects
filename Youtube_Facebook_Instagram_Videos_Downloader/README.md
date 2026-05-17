# Video Downloader

Download videos from **YouTube**, **Facebook**, and **Instagram** (including Shorts, Reels, and vertical videos) with a clean web UI.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) — installed automatically via `pip install yt-dlp`
- [FFmpeg](https://ffmpeg.org/download.html) — recommended for audio extraction and video merging

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Open **http://localhost:3000** in your browser.

## Usage

1. **Paste a video URL** from YouTube, Facebook, or Instagram into the input field
2. Click **Fetch Info** — the app shows the video title, thumbnail, duration, and platform
3. Select a **quality preset**:

| Preset | Description |
|---|---|
| Best Video | Highest available quality |
| 1080p | Full HD (handles both landscape and portrait) |
| 720p | HD |
| 480p | Standard definition |
| Audio Only | Extracts audio as M4A |
| MP3 Only | Extracts audio and converts to MP3 |

4. Click **Download** — progress appears in real time
5. Once complete, use **Save** to download the file or **Delete** to remove it

## Quality Notes

- Videos are downloaded as MP4 (video) or M4A/MP3 (audio).
- The `res` format filter correctly handles **vertical/portrait videos** (Shorts, Reels), capping the smaller dimension at the selected quality level.
- Without FFmpeg, video downloads fall back to single-stream format and audio extraction is disabled.

## Troubleshooting

**"yt-dlp not found"**
Install it via pip:
```bash
pip install yt-dlp
```

**"FFmpeg not found"**
Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add it to your PATH, or use:
```bash
winget install ffmpeg
```

**Port 3000 already in use**
Set a custom port:
```bash
set PORT=3001 && npm start
```

## Project Structure

```
├── server.js          Express API + yt-dlp integration
├── package.json
├── public/
│   ├── index.html     Single-page UI
│   ├── css/style.css  Dark theme styles
│   └── js/app.js      Frontend logic
└── downloads/         Downloaded files
```
