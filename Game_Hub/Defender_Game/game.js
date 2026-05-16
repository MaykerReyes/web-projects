const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('scoreDisplay');
const levelEl = document.getElementById('levelDisplay');
const livesEl = document.getElementById('livesDisplay');
const astroEl = document.getElementById('astroDisplay');
const bombEl = document.getElementById('bombDisplay');
const startBtn = document.getElementById('startBtn');
const musicBtn = document.getElementById('musicBtn');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const messageEl = document.getElementById('message');

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const STORAGE_KEY = 'defenderHighScore';

let player, bullets, enemies, astronauts, particles, stars, powerUps, terrain;
let score, level, lives, highScore, smartBombs, astronautsSaved, totalAstronauts;
let gameRunning, gameState, gameLoop;
let audioCtx, musicEnabled, musicPlaying, musicTimeout, currentMusicNote;
let cameraX, scrollSpeed, hyperspaceCooldown;
let boss, bossWarning, levelTransition;

const DEFENDER_THEME = [
    { freq: 110, dur: 400 }, { freq: 130, dur: 400 }, { freq: 147, dur: 400 },
    { freq: 165, dur: 400 }, { freq: 147, dur: 400 }, { freq: 130, dur: 400 },
    { freq: 110, dur: 400 }, { freq: 0, dur: 400 }, { freq: 130, dur: 400 },
    { freq: 147, dur: 400 }, { freq: 165, dur: 400 }, { freq: 196, dur: 400 },
    { freq: 165, dur: 400 }, { freq: 147, dur: 400 }, { freq: 130, dur: 400 },
    { freq: 0, dur: 400 }, { freq: 98, dur: 400 }, { freq: 110, dur: 400 },
    { freq: 130, dur: 400 }, { freq: 147, dur: 400 }, { freq: 130, dur: 400 },
    { freq: 110, dur: 400 }, { freq: 98, dur: 400 }, { freq: 0, dur: 400 }
];

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone(freq, duration, type = 'square', volume = 0.08) {
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

function playShootSound() { playTone(600, 60, 'square', 0.06); }
function playExplosionSound() {
    if (!audioCtx || !musicEnabled) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.3);
}
function playRescueSound() { [440, 554, 659].forEach((f, i) => setTimeout(() => playTone(f, 120, 'sine', 0.08), i * 100)); }
function playDeathSound() { [300, 250, 200, 150].forEach((f, i) => setTimeout(() => playTone(f, 200, 'sawtooth', 0.1), i * 200)); }
function playBossSound() { [150, 180, 150, 120].forEach((f, i) => setTimeout(() => playTone(f, 250, 'sawtooth', 0.12), i * 250)); }
function playHyperspaceSound() { playTone(800, 100, 'sine', 0.1); setTimeout(() => playTone(400, 100, 'sine', 0.1), 100); }
function playBombSound() { playTone(100, 200, 'sawtooth', 0.15); }
function playPowerUpSound() { [523, 659, 784].forEach((f, i) => setTimeout(() => playTone(f, 100, 'sine', 0.08), i * 80)); }
function playAbductionSound() { playTone(200, 300, 'sawtooth', 0.1); }

function playMusicNote() {
    if (!audioCtx || !musicEnabled || !musicPlaying) return;
    const note = DEFENDER_THEME[currentMusicNote];
    if (note.freq > 0) playTone(note.freq, note.dur * 0.9, 'triangle', 0.04);
    currentMusicNote = (currentMusicNote + 1) % DEFENDER_THEME.length;
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

function generateTerrain() {
    terrain = [];
    const segments = 200;
    const segmentWidth = CANVAS_WIDTH * 3 / segments;
    const baseHeight = 80;
    const complexity = Math.min(3, 1 + level * 0.3);

    for (let i = 0; i <= segments; i++) {
        const x = i * segmentWidth;
        const noise1 = Math.sin(i * 0.1 * complexity) * 30;
        const noise2 = Math.sin(i * 0.3 * complexity) * 15;
        const noise3 = Math.sin(i * 0.05) * 20;
        const height = baseHeight + noise1 + noise2 + noise3;
        terrain.push({ x, topHeight: height, bottomHeight: height });
    }
}

function initGame() {
    player = {
        x: 100, y: CANVAS_HEIGHT / 2,
        width: 30, height: 20,
        speed: 4, vx: 0, vy: 0,
        shootCooldown: 0, invincible: 0
    };
    bullets = [];
    enemies = [];
    astronauts = [];
    particles = [];
    powerUps = [];
    stars = [];
    boss = null;
    bossWarning = false;
    levelTransition = false;

    score = 0;
    level = 1;
    lives = 3;
    smartBombs = 1;
    astronautsSaved = 0;
    totalAstronauts = 10;
    cameraX = 0;
    scrollSpeed = 0.5;
    hyperspaceCooldown = 0;

    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * CANVAS_WIDTH * 3,
            y: Math.random() * CANVAS_HEIGHT,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.5 + 0.1
        });
    }

    generateTerrain();
    spawnAstronauts();
    spawnEnemies();
    updateHUD();
}

function spawnAstronauts() {
    astronauts = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
        const x = 200 + i * (CANVAS_WIDTH * 2.5 / count);
        const y = getTerrainY(x) - 15;
        astronauts.push({
            x, y, width: 12, height: 15,
            alive: true, rescued: false,
            walking: false, walkDir: 1, walkSpeed: 0.5,
            abducted: false, abductor: null
        });
    }
    totalAstronauts = count;
}

function getTerrainY(x) {
    const worldWidth = CANVAS_WIDTH * 3;
    const normX = ((x % worldWidth) + worldWidth) % worldWidth;
    const segIndex = Math.floor(normX / (worldWidth / terrain.length));
    if (segIndex < 0 || segIndex >= terrain.length) return CANVAS_HEIGHT - 80;
    return CANVAS_HEIGHT - terrain[segIndex].topHeight;
}

function spawnEnemies() {
    enemies = [];
    const baseCount = 5 + level * 3;
    const worldWidth = CANVAS_WIDTH * 3;
    const speedMult = 1 + (level - 1) * 0.15;

    for (let i = 0; i < baseCount; i++) {
        const type = level >= 3 && Math.random() < 0.3 ? 'mutator' :
                    level >= 2 && Math.random() < 0.3 ? 'lander' :
                    level >= 4 && Math.random() < 0.2 ? 'bomber' : 'swarmer';

        enemies.push({
            x: 300 + Math.random() * (worldWidth - 400),
            y: 50 + Math.random() * (CANVAS_HEIGHT - 150),
            width: type === 'bomber' ? 25 : 20,
            height: type === 'bomber' ? 20 : 20,
            speed: (1 + Math.random() * 1.5) * speedMult,
            type,
            alive: true,
            dir: Math.random() < 0.5 ? 1 : -1,
            shootTimer: 60 + Math.random() * 120,
            diveTimer: 0,
            zigzag: Math.random() * Math.PI * 2,
            mutated: false
        });
    }

    if (level % 5 === 0) {
        boss = {
            x: worldWidth - 200,
            y: CANVAS_HEIGHT / 2 - 40,
            width: 60, height: 50,
            hp: 3 + Math.floor(level / 5) * 2,
            maxHp: 3 + Math.floor(level / 5) * 2,
            speed: 1.5 * speedMult,
            dir: 1,
            shootTimer: 0,
            alive: true,
            flashTimer: 0
        };
        bossWarning = true;
        playBossSound();
        showMessage(`BOSS WARNING - LEVEL ${level}!`, 'warning');
        setTimeout(() => { bossWarning = false; }, 2000);
    } else {
        boss = null;
    }
}

function updateHUD() {
    scoreEl.textContent = String(score).padStart(6, '0');
    levelEl.textContent = level;
    livesEl.textContent = lives;
    astroEl.textContent = astronauts.filter(a => a.alive && !a.abducted).length;
    bombEl.textContent = smartBombs;
}

function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    setTimeout(() => { messageEl.className = 'message hidden'; }, 2000);
}

function loadProgress() {
    highScore = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
}

function saveProgress() {
    localStorage.setItem(STORAGE_KEY, highScore);
    showMessage('Progress saved!', 'success');
}

function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    highScore = 0;
    initGame();
    draw();
    showMessage('Progress reset!', 'warning');
}

function drawStars() {
    stars.forEach(star => {
        const screenX = ((star.x - cameraX * star.speed * 0.1) % CANVAS_WIDTH + CANVAS_WIDTH) % CANVAS_WIDTH;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
        ctx.fillRect(screenX, star.y, star.size, star.size);
    });
}

function drawTerrain() {
    const worldWidth = CANVAS_WIDTH * 3;
    const segmentWidth = worldWidth / terrain.length;

    ctx.fillStyle = '#00aa44';
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT);

    for (let i = 0; i < terrain.length; i++) {
        const screenX = terrain[i].x - cameraX;
        if (screenX < -segmentWidth || screenX > CANVAS_WIDTH + segmentWidth) continue;
        ctx.lineTo(screenX, CANVAS_HEIGHT - terrain[i].topHeight);
    }

    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#008833';
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT);

    for (let i = 0; i < terrain.length; i++) {
        const screenX = terrain[i].x - cameraX;
        if (screenX < -segmentWidth || screenX > CANVAS_WIDTH + segmentWidth) continue;
        ctx.lineTo(screenX, CANVAS_HEIGHT - terrain[i].topHeight + 10);
    }

    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#00ff66';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < terrain.length; i++) {
        const screenX = terrain[i].x - cameraX;
        if (screenX < -segmentWidth || screenX > CANVAS_WIDTH + segmentWidth) continue;
        if (i === 0) ctx.moveTo(screenX, CANVAS_HEIGHT - terrain[i].topHeight);
        else ctx.lineTo(screenX, CANVAS_HEIGHT - terrain[i].topHeight);
    }
    ctx.stroke();
}

function drawPlayer() {
    if (player.invincible > 0 && Math.floor(player.invincible / 4) % 2 === 0) return;

    const px = player.x - cameraX;
    const py = player.y;

    ctx.fillStyle = '#00ffcc';
    ctx.beginPath();
    ctx.moveTo(px + 30, py + 10);
    ctx.lineTo(px, py);
    ctx.lineTo(px + 5, py + 10);
    ctx.lineTo(px, py + 20);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#00cc99';
    ctx.fillRect(px + 8, py + 6, 15, 8);

    ctx.fillStyle = '#ff6600';
    ctx.fillRect(px - 5, py + 7, 8, 3 + Math.random() * 4);
    ctx.fillRect(px - 5, py + 12, 8, 3 + Math.random() * 4);
}

function drawBullets() {
    bullets.forEach(b => {
        ctx.fillStyle = b.isEnemy ? '#ff0055' : '#00ffcc';
        ctx.fillRect(b.x - cameraX, b.y, b.width || 6, b.height || 3);
    });
}

function drawEnemies() {
    enemies.forEach(e => {
        if (!e.alive) return;
        const ex = e.x - cameraX;
        const ey = e.y;

        if (e.type === 'lander' || e.mutated) {
            ctx.fillStyle = e.mutated ? '#ff0000' : '#ff6600';
            ctx.beginPath();
            ctx.moveTo(ex + 10, ey);
            ctx.lineTo(ex + 20, ey + 10);
            ctx.lineTo(ex + 15, ey + 20);
            ctx.lineTo(ex + 5, ey + 20);
            ctx.lineTo(ex, ey + 10);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.fillRect(ex + 6, ey + 8, 3, 3);
            ctx.fillRect(ex + 11, ey + 8, 3, 3);
        } else if (e.type === 'mutator') {
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(ex + 5, ey, 10, 20);
            ctx.fillRect(ex, ey + 5, 20, 10);
            ctx.fillStyle = '#cc00cc';
            ctx.fillRect(ex + 7, ey + 7, 6, 6);
            ctx.fillStyle = '#fff';
            ctx.fillRect(ex + 4, ey + 4, 3, 3);
            ctx.fillRect(ex + 13, ey + 4, 3, 3);
        } else if (e.type === 'bomber') {
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(ex, ey + 5, 25, 10);
            ctx.fillRect(ex + 5, ey, 15, 5);
            ctx.fillStyle = '#cc9900';
            ctx.fillRect(ex + 10, ey + 15, 5, 5);
            ctx.fillStyle = '#fff';
            ctx.fillRect(ex + 5, ey + 8, 3, 3);
            ctx.fillRect(ex + 17, ey + 8, 3, 3);
        } else {
            ctx.fillStyle = '#00aaff';
            ctx.beginPath();
            ctx.arc(ex + 10, ey + 10, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0088cc';
            ctx.beginPath();
            ctx.arc(ex + 10, ey + 10, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.fillRect(ex + 6, ey + 8, 3, 3);
            ctx.fillRect(ex + 11, ey + 8, 3, 3);
        }
    });

    if (boss && boss.alive) {
        const bx = boss.x - cameraX;
        const by = boss.y;

        ctx.fillStyle = boss.flashTimer > 0 && Math.floor(boss.flashTimer / 3) % 2 === 0 ? '#fff' : '#ff0055';
        ctx.fillRect(bx + 10, by, 40, 20);
        ctx.fillRect(bx, by + 10, 60, 30);
        ctx.fillRect(bx + 10, by + 40, 40, 10);

        ctx.fillStyle = '#cc0044';
        ctx.fillRect(bx + 15, by + 15, 30, 20);

        ctx.fillStyle = '#fff';
        ctx.fillRect(bx + 18, by + 20, 8, 8);
        ctx.fillRect(bx + 34, by + 20, 8, 8);

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(bx + 20, by + 22, 4, 4);
        ctx.fillRect(bx + 36, by + 22, 4, 4);

        const barWidth = 50;
        const barHeight = 5;
        const barX = bx + (boss.width - barWidth) / 2;
        const barY = by - 10;
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(barX, barY, barWidth * (boss.hp / boss.maxHp), barHeight);
    }
}

function drawAstronauts() {
    astronauts.forEach(a => {
        if (!a.alive || a.abducted) return;
        const ax = a.x - cameraX;
        const ay = a.y;

        ctx.fillStyle = '#fff';
        ctx.fillRect(ax + 2, ay, 8, 8);
        ctx.fillRect(ax, ay + 8, 12, 7);

        ctx.fillStyle = '#00aaff';
        ctx.fillRect(ax + 3, ay + 2, 6, 4);

        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(ax + 4, ay + 10, 4, 5);
    });
}

function drawPowerUps() {
    powerUps.forEach(p => {
        const px = p.x - cameraX;
        ctx.fillStyle = p.type === 'bomb' ? '#ffcc00' : '#00ffcc';
        ctx.beginPath();
        ctx.arc(px + 10, p.y + 10, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(p.type === 'bomb' ? 'B' : 'S', px + 10, p.y + 13);
    });
}

function drawParticles() {
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.vy += 0.05;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillRect(p.x - cameraX, p.y, p.size, p.size);
        ctx.globalAlpha = 1;

        return p.life > 0;
    });
}

function drawBossWarning() {
    if (!bossWarning) return;
    const flash = Math.floor(Date.now() / 200) % 2 === 0;
    if (flash) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#ff0000';
        ctx.font = '24px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚠ BOSS INCOMING ⚠', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
}

function drawMenu() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawStars();

    ctx.fillStyle = '#00ffcc';
    ctx.font = '36px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DEFENDER', CANVAS_WIDTH / 2, 120);

    ctx.fillStyle = '#ff00ff';
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillText('For Isa and Sarah', CANVAS_WIDTH / 2, 160);

    ctx.fillStyle = '#fff';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText('Protect the Astronauts!', CANVAS_WIDTH / 2, 220);

    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillText('Press ENTER to Start', CANVAS_WIDTH / 2, 300);

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#ccc';
    ctx.fillText('Arrow Keys / WASD = Move', CANVAS_WIDTH / 2, 360);
    ctx.fillText('SPACE = Shoot  |  H = Hyperspace', CANVAS_WIDTH / 2, 385);
    ctx.fillText('B = Smart Bomb  |  CTRL+S = Save', CANVAS_WIDTH / 2, 410);
    ctx.fillText('R = Reset  |  M = Toggle Music', CANVAS_WIDTH / 2, 435);

    if (highScore > 0) {
        ctx.fillStyle = '#ffcc00';
        ctx.fillText(`HIGH SCORE: ${highScore}`, CANVAS_WIDTH / 2, 480);
    }

    ctx.fillStyle = musicEnabled ? '#ffcc00' : '#666';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText(`MUSIC: ${musicEnabled ? 'ON' : 'OFF'}`, CANVAS_WIDTH / 2, 520);
}

function drawGameOver() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#ff0055';
    ctx.font = '36px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, 180);

    ctx.fillStyle = '#fff';
    ctx.font = '18px "Press Start 2P", monospace';
    ctx.fillText(`SCORE: ${score}`, CANVAS_WIDTH / 2, 230);
    ctx.fillText(`LEVEL: ${level}`, CANVAS_WIDTH / 2, 260);
    ctx.fillText(`ASTRONAUTS SAVED: ${astronautsSaved}`, CANVAS_WIDTH / 2, 290);

    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillText('Press ENTER to Restart', CANVAS_WIDTH / 2, 340);

    ctx.fillStyle = musicEnabled ? '#ffcc00' : '#666';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText(`MUSIC: ${musicEnabled ? 'ON' : 'OFF'}`, CANVAS_WIDTH / 2, 390);
}

function drawWin() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#ffcc00';
    ctx.font = '32px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('YOU WIN!', CANVAS_WIDTH / 2, 150);

    ctx.fillStyle = '#fff';
    ctx.font = '18px "Press Start 2P", monospace';
    ctx.fillText(`FINAL SCORE: ${score}`, CANVAS_WIDTH / 2, 220);
    ctx.fillText(`LEVELS CLEARED: ${level}`, CANVAS_WIDTH / 2, 260);

    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillText('Press ENTER to Play Again', CANVAS_WIDTH / 2, 320);

    ctx.fillStyle = musicEnabled ? '#ffcc00' : '#666';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText(`MUSIC: ${musicEnabled ? 'ON' : 'OFF'}`, CANVAS_WIDTH / 2, 370);
}

function draw() {
    if (gameState === 'menu') { drawMenu(); return; }
    if (gameState === 'gameover') { drawGameOver(); return; }
    if (gameState === 'win') { drawWin(); return; }

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawStars();
    drawTerrain();
    drawAstronauts();
    drawPowerUps();
    drawBullets();
    drawEnemies();
    drawPlayer();
    drawParticles();
    drawBossWarning();
}

function updatePlayer() {
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.vx = -player.speed;
    else if (keys['ArrowRight'] || keys['d'] || keys['D']) player.vx = player.speed;
    else player.vx *= 0.9;

    if (keys['ArrowUp'] || keys['w'] || keys['W']) player.vy = -player.speed;
    else if (keys['ArrowDown'] || keys['s'] || keys['S']) player.vy = player.speed;
    else player.vy *= 0.9;

    player.x += player.vx;
    player.y += player.vy;

    const terrainY = getTerrainY(player.x);
    if (player.y > terrainY - player.height) {
        player.y = terrainY - player.height;
        player.vy = 0;
    }
    if (player.y < 0) player.y = 0;
    if (player.x < 0) player.x = 0;
    if (player.x > CANVAS_WIDTH * 3) player.x = CANVAS_WIDTH * 3;

    if (player.shootCooldown > 0) player.shootCooldown--;
    if (player.invincible > 0) player.invincible--;
    if (hyperspaceCooldown > 0) hyperspaceCooldown--;

    if ((keys[' '] || keys['Space']) && player.shootCooldown <= 0) {
        bullets.push({
            x: player.x + player.width,
            y: player.y + player.height / 2 - 1,
            width: 8, height: 3,
            vx: 8, isEnemy: false
        });
        player.shootCooldown = 12;
        playShootSound();
    }

    if (keys['h'] || keys['H']) {
        if (hyperspaceCooldown <= 0) {
            player.x = 100 + Math.random() * (CANVAS_WIDTH * 3 - 200);
            player.y = 50 + Math.random() * (CANVAS_HEIGHT - 150);
            hyperspaceCooldown = 180;
            playHyperspaceSound();
            showMessage('HYPERSPACE!', 'info');
        }
    }

    if (keys['b'] || keys['B']) {
        if (smartBombs > 0) {
            smartBombs--;
            enemies.forEach(e => {
                if (e.alive) {
                    e.alive = false;
                    score += 100;
                    spawnExplosion(e.x, e.y, '#ff6600');
                }
            });
            if (boss && boss.alive) {
                boss.hp -= 2;
                boss.flashTimer = 30;
                if (boss.hp <= 0) {
                    boss.alive = false;
                    score += 2000;
                    spawnExplosion(boss.x, boss.y, '#ff0055');
                }
            }
            playBombSound();
            updateHUD();
            keys['b'] = false;
            keys['B'] = false;
        }
    }

    cameraX = player.x - CANVAS_WIDTH / 3;
    if (cameraX < 0) cameraX = 0;
    if (cameraX > CANVAS_WIDTH * 2) cameraX = CANVAS_WIDTH * 2;
}

function updateBullets() {
    bullets = bullets.filter(b => {
        b.x += b.vx;
        return b.x > cameraX - 50 && b.x < cameraX + CANVAS_WIDTH + 50;
    });
}

function updateEnemies() {
    const worldWidth = CANVAS_WIDTH * 3;

    enemies.forEach(e => {
        if (!e.alive) return;

        if (e.type === 'lander' || e.mutated) {
            const target = astronauts.find(a => a.alive && !a.abducted);
            if (target) {
                const dx = target.x - e.x;
                const dy = target.y - e.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                e.x += (dx / dist) * e.speed;
                e.y += (dy / dist) * e.speed;

                if (dist < 30 && !e.mutated) {
                    e.mutated = true;
                    e.speed *= 2;
                    e.width = 25;
                    e.height = 25;
                    playAbductionSound();
                }
            }
        } else if (e.type === 'mutator') {
            e.zigzag += 0.1;
            e.x += Math.cos(e.zigzag) * e.speed;
            e.y += Math.sin(e.zigzag) * e.speed * 0.5;

            const target = astronauts.find(a => a.alive && !a.abducted);
            if (target) {
                const dx = target.x - e.x;
                e.x += (dx > 0 ? 1 : -1) * e.speed * 0.3;
            }
        } else if (e.type === 'bomber') {
            e.x += e.speed * e.dir;
            if (e.x <= 0 || e.x >= worldWidth) e.dir *= -1;

            e.shootTimer--;
            if (e.shootTimer <= 0) {
                bullets.push({
                    x: e.x + e.width / 2,
                    y: e.y + e.height,
                    width: 4, height: 8,
                    vx: 0, vy: 4,
                    isEnemy: true
                });
                e.shootTimer = 90 - level * 5;
                if (e.shootTimer < 30) e.shootTimer = 30;
            }
        } else {
            e.zigzag += 0.05;
            e.x += Math.cos(e.zigzag) * e.speed;
            e.y += Math.sin(e.zigzag) * e.speed * 0.3;

            const dx = player.x - e.x;
            const dy = player.y - e.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 300) {
                e.x += (dx > 0 ? 1 : -1) * e.speed * 0.5;
                e.y += (dy > 0 ? 1 : -1) * e.speed * 0.3;
            }
        }

        if (e.y < 0) e.y = 0;
        if (e.y > CANVAS_HEIGHT - 50) e.y = CANVAS_HEIGHT - 50;
    });

    if (boss && boss.alive) {
        boss.x += boss.speed * boss.dir;
        if (boss.x <= 100 || boss.x >= worldWidth - 100) boss.dir *= -1;
        boss.y += Math.sin(Date.now() / 500) * 2;

        boss.shootTimer++;
        if (boss.shootTimer >= 40) {
            boss.shootTimer = 0;
            for (let i = -1; i <= 1; i++) {
                bullets.push({
                    x: boss.x + boss.width / 2,
                    y: boss.y + boss.height,
                    width: 6, height: 6,
                    vx: i * 2, vy: 4,
                    isEnemy: true
                });
            }
        }

        if (boss.flashTimer > 0) boss.flashTimer--;
    }

    enemies = enemies.filter(e => e.alive);
}

function checkCollisions() {
    bullets.forEach((b, bi) => {
        if (b.isEnemy) {
            if (player.invincible <= 0 &&
                b.x > player.x && b.x < player.x + player.width &&
                b.y > player.y && b.y < player.y + player.height) {
                bullets.splice(bi, 1);
                playerHit();
            }
            return;
        }

        enemies.forEach(e => {
            if (!e.alive) return;
            if (b.x > e.x && b.x < e.x + e.width && b.y > e.y && b.y < e.y + e.height) {
                e.alive = false;
                bullets.splice(bi, 1);
                score += e.mutated ? 300 : e.type === 'mutator' ? 250 : e.type === 'bomber' ? 200 : 100;
                spawnExplosion(e.x, e.y, e.mutated ? '#ff0000' : '#ff6600');
                playExplosionSound();
                updateHUD();

                if (Math.random() < 0.15) {
                    powerUps.push({
                        x: e.x, y: e.y,
                        width: 20, height: 20,
                        type: Math.random() < 0.5 ? 'bomb' : 'smart',
                        speed: 1
                    });
                }
            }
        });

        if (boss && boss.alive &&
            b.x > boss.x && b.x < boss.x + boss.width &&
            b.y > boss.y && b.y < boss.y + boss.height) {
            boss.hp--;
            boss.flashTimer = 20;
            bullets.splice(bi, 1);
            score += 100;
            spawnExplosion(b.x, b.y, '#ff0055');
            playExplosionSound();
            updateHUD();

            if (boss.hp <= 0) {
                boss.alive = false;
                score += 2000;
                for (let i = 0; i < 20; i++) {
                    spawnExplosion(boss.x + Math.random() * boss.width, boss.y + Math.random() * boss.height, ['#ff0055', '#ff6600', '#ffcc00'][Math.floor(Math.random() * 3)]);
                }
                playExplosionSound();
                advanceLevel();
            }
        }
    });

    enemies.forEach(e => {
        if (!e.alive) return;
        if (player.invincible <= 0 &&
            player.x < e.x + e.width && player.x + player.width > e.x &&
            player.y < e.y + e.height && player.y + player.height > e.y) {
            playerHit();
        }

        astronauts.forEach(a => {
            if (!a.alive || a.abducted) return;
            if (e.x < a.x + a.width && e.x + e.width > a.x &&
                e.y < a.y + a.height && e.y + e.height > a.y) {
                a.abducted = true;
                a.alive = false;
                score -= 500;
                playAbductionSound();
                spawnExplosion(a.x, a.y, '#00aaff');
                updateHUD();
            }
        });
    });

    powerUps = powerUps.filter(p => {
        p.y += p.speed;
        if (p.y > CANVAS_HEIGHT) return false;

        if (player.x < p.x + p.width && player.x + player.width > p.x &&
            player.y < p.y + p.height && player.y + player.height > p.y) {
            if (p.type === 'bomb') smartBombs++;
            playPowerUpSound();
            updateHUD();
            return false;
        }
        return true;
    });

    if (enemies.length === 0 && (!boss || !boss.alive)) {
        advanceLevel();
    }
}

function playerHit() {
    lives--;
    updateHUD();
    playDeathSound();
    spawnExplosion(player.x, player.y, '#00ffcc');

    if (lives <= 0) {
        gameOver();
    } else {
        player.x = 100;
        player.y = CANVAS_HEIGHT / 2;
        player.invincible = 120;
    }
}

function advanceLevel() {
    level++;
    score += 1000;
    smartBombs++;
    generateTerrain();
    spawnAstronauts();
    spawnEnemies();
    updateHUD();
    showMessage(`LEVEL ${level}!`, 'success');
    playPowerUpSound();
}

function spawnExplosion(x, y, color) {
    for (let i = 0; i < 12; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 25 + Math.random() * 15,
            maxLife: 40,
            size: 2 + Math.random() * 3,
            color
        });
    }
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    stopMusic();
    startBtn.textContent = 'START';
    if (score > highScore) {
        highScore = score;
        localStorage.setItem(STORAGE_KEY, highScore);
    }
    saveProgress();
    showMessage('GAME OVER', 'warning');
    gameState = 'gameover';
}

function update() {
    updatePlayer();
    updateBullets();
    updateEnemies();
    checkCollisions();
    draw();
}

function startGame() {
    initAudio();
    if (gameState === 'menu' || gameState === 'gameover' || gameState === 'win') {
        initGame();
        gameState = 'playing';
        gameRunning = true;
        startBtn.textContent = 'PAUSE';
        gameLoop = setInterval(update, 1000 / 60);
        if (musicEnabled) startMusic();
    } else if (gameRunning) {
        gameRunning = false;
        clearInterval(gameLoop);
        stopMusic();
        startBtn.textContent = 'RESUME';
        showMessage('PAUSED', 'info');
    } else {
        gameRunning = true;
        startBtn.textContent = 'PAUSE';
        gameLoop = setInterval(update, 1000 / 60);
        if (musicEnabled) startMusic();
    }
}

const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === 'Enter') { e.preventDefault(); startGame(); return; }
    if (e.ctrlKey && e.key.toLowerCase() === 's') { e.preventDefault(); saveProgress(); return; }
    if (e.key.toLowerCase() === 'r') { if (confirm('Reset all progress?')) resetProgress(); return; }
    if (e.key.toLowerCase() === 'm') { const enabled = toggleMusic(); showMessage(enabled ? 'Music ON' : 'Music OFF', 'info'); return; }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
});

document.addEventListener('keyup', (e) => { keys[e.key] = false; });

startBtn.addEventListener('click', startGame);
musicBtn.addEventListener('click', () => {
    const enabled = toggleMusic();
    musicBtn.textContent = `MUSIC: ${enabled ? 'ON' : 'OFF'}`;
    showMessage(enabled ? 'Music ON' : 'Music OFF', 'info');
});
saveBtn.addEventListener('click', saveProgress);
resetBtn.addEventListener('click', () => { if (confirm('Reset all progress?')) resetProgress(); });

musicEnabled = true;
gameState = 'menu';
loadProgress();
initGame();
draw();
