const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const musicBtn = document.getElementById('musicBtn');
const messageEl = document.getElementById('message');

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let highScore = 0;
let gameRunning = false;
let gameLoop = null;
let speed = 150;
let audioCtx = null;
let musicEnabled = true;
let musicPlaying = false;
let musicTimeout = null;
let currentMusicNote = 0;

const STORAGE_KEY = 'neonSnakeProgress';

const AMBIENT_THEME = [
    { freq: 262, dur: 800 }, { freq: 330, dur: 800 }, { freq: 392, dur: 800 },
    { freq: 523, dur: 800 }, { freq: 392, dur: 800 }, { freq: 330, dur: 800 },
    { freq: 262, dur: 800 }, { freq: 0, dur: 800 }, { freq: 294, dur: 800 },
    { freq: 370, dur: 800 }, { freq: 440, dur: 800 }, { freq: 587, dur: 800 },
    { freq: 440, dur: 800 }, { freq: 370, dur: 800 }, { freq: 294, dur: 800 },
    { freq: 0, dur: 800 }, { freq: 220, dur: 800 }, { freq: 277, dur: 800 },
    { freq: 330, dur: 800 }, { freq: 440, dur: 800 }, { freq: 330, dur: 800 },
    { freq: 277, dur: 800 }, { freq: 220, dur: 800 }, { freq: 0, dur: 800 }
];

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone(freq, duration, type = 'sine', volume = 0.06) {
    if (!audioCtx || !musicEnabled || freq === 0) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration / 1000);
}

function playEatSound() {
    if (!audioCtx || !musicEnabled) return;
    playTone(523, 100, 'sine', 0.08);
    setTimeout(() => playTone(659, 150, 'sine', 0.08), 100);
}

function playGameOverSound() {
    if (!audioCtx || !musicEnabled) return;
    [330, 277, 220].forEach((f, i) => setTimeout(() => playTone(f, 300, 'sine', 0.1), i * 300));
}

function playMusicNote() {
    if (!audioCtx || !musicEnabled || !musicPlaying) return;
    const note = AMBIENT_THEME[currentMusicNote];
    if (note.freq > 0) playTone(note.freq, note.dur * 0.9, 'sine', 0.04);
    currentMusicNote = (currentMusicNote + 1) % AMBIENT_THEME.length;
    musicTimeout = setTimeout(playMusicNote, note.dur);
}

function startMusic() {
    initAudio();
    if (musicPlaying) return;
    musicPlaying = true;
    currentMusicNote = 0;
    playMusicNote();
}

function stopMusic() {
    musicPlaying = false;
    if (musicTimeout) { clearTimeout(musicTimeout); musicTimeout = null; }
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    if (musicEnabled) startMusic(); else stopMusic();
    return musicEnabled;
}

function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            snake = data.snake || [{ x: 10, y: 10 }];
            direction = data.direction || { x: 1, y: 0 };
            nextDirection = data.direction || { x: 1, y: 0 };
            food = data.food || { x: 15, y: 15 };
            score = data.score || 0;
            highScore = data.highScore || 0;
            scoreEl.textContent = score;
            highScoreEl.textContent = highScore;
            showMessage('Progress loaded!', 'info');
        } catch (e) {
            resetProgress();
        }
    } else {
        highScore = parseInt(localStorage.getItem('neonSnakeHighScore')) || 0;
        highScoreEl.textContent = highScore;
    }
    draw();
}

function saveProgress() {
    const data = {
        snake,
        direction,
        food,
        score,
        highScore
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem('neonSnakeHighScore', highScore);
    showMessage('Progress saved!', 'success');
}

function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('neonSnakeHighScore');
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    food = spawnFood();
    score = 0;
    highScore = 0;
    scoreEl.textContent = 0;
    highScoreEl.textContent = 0;
    gameRunning = false;
    if (gameLoop) clearInterval(gameLoop);
    startBtn.textContent = 'START';
    showMessage('Progress reset!', 'warning');
    draw();
}

function spawnFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
            y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE))
        };
    } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
    return newFood;
}

function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_SIZE, i);
        ctx.stroke();
    }

    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();

    snake.forEach((seg, i) => {
        ctx.shadowBlur = i === 0 ? 20 : 10;
        ctx.shadowColor = '#00ffcc';
        ctx.fillStyle = i === 0 ? '#00ffcc' : '#00cc99';
        ctx.fillRect(
            seg.x * GRID_SIZE + 1,
            seg.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );
    });

    ctx.shadowBlur = 0;
}

function update() {
    direction = { ...nextDirection };

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    if (head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE ||
        head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE) {
        gameOver();
        return;
    }

    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreEl.textContent = highScore;
        }
        food = spawnFood();
        playEatSound();
        if (speed > 50) speed -= 2;
        clearInterval(gameLoop);
        gameLoop = setInterval(update, speed);
    } else {
        snake.pop();
    }

    draw();
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    stopMusic();
    startBtn.textContent = 'START';
    saveProgress();
    playGameOverSound();
    showMessage(`Game Over! Score: ${score}`, 'warning');
}

function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    setTimeout(() => {
        messageEl.className = 'message hidden';
    }, 2000);
}

function toggleGame() {
    initAudio();
    if (gameRunning) {
        gameRunning = false;
        clearInterval(gameLoop);
        stopMusic();
        startBtn.textContent = 'RESUME';
        showMessage('Game paused', 'info');
    } else {
        gameRunning = true;
        startBtn.textContent = 'PAUSE';
        gameLoop = setInterval(update, speed);
        if (musicEnabled) startMusic();
    }
}

startBtn.addEventListener('click', toggleGame);
musicBtn.addEventListener('click', () => {
    const enabled = toggleMusic();
    musicBtn.textContent = `MUSIC: ${enabled ? 'ON' : 'OFF'}`;
    showMessage(enabled ? 'Music ON' : 'Music OFF', 'info');
});
saveBtn.addEventListener('click', saveProgress);
resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all progress?')) {
        resetProgress();
    }
});

musicEnabled = true;
loadProgress();
