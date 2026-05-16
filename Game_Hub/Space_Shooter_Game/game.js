const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('scoreDisplay');
const waveEl = document.getElementById('waveDisplay');
const livesEl = document.getElementById('livesDisplay');
const powerEl = document.getElementById('powerDisplay');
const startBtn = document.getElementById('startBtn');
const musicBtn = document.getElementById('musicBtn');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const messageEl = document.getElementById('message');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const STORAGE_KEY = 'spaceShooterProgress';

let player, bullets, enemies, particles, stars, powerUps, enemyBullets;
let score, wave, lives, highScore, powerUp, powerTimer;
let gameRunning, gameState, gameLoop;
let audioCtx, musicEnabled, musicPlaying, musicTimeout, currentMusicNote;
let boss, bossWave, shootCooldown, enemyShootCooldown;

const SPACE_THEME = [
    { freq: 440, dur: 200 }, { freq: 523, dur: 200 }, { freq: 587, dur: 200 },
    { freq: 659, dur: 200 }, { freq: 587, dur: 200 }, { freq: 523, dur: 200 },
    { freq: 440, dur: 200 }, { freq: 0, dur: 200 }, { freq: 392, dur: 200 },
    { freq: 440, dur: 200 }, { freq: 523, dur: 200 }, { freq: 440, dur: 200 },
    { freq: 392, dur: 200 }, { freq: 0, dur: 200 }, { freq: 330, dur: 200 },
    { freq: 392, dur: 200 }, { freq: 440, dur: 200 }, { freq: 523, dur: 200 },
    { freq: 440, dur: 200 }, { freq: 392, dur: 200 }, { freq: 330, dur: 200 },
    { freq: 0, dur: 200 }, { freq: 294, dur: 200 }, { freq: 330, dur: 200 },
    { freq: 392, dur: 200 }, { freq: 440, dur: 200 }, { freq: 392, dur: 200 },
    { freq: 330, dur: 200 }, { freq: 294, dur: 200 }, { freq: 0, dur: 200 },
    { freq: 440, dur: 200 }, { freq: 523, dur: 200 }, { freq: 587, dur: 200 },
    { freq: 659, dur: 200 }, { freq: 784, dur: 200 }, { freq: 659, dur: 200 },
    { freq: 587, dur: 200 }, { freq: 523, dur: 200 }, { freq: 440, dur: 200 },
    { freq: 0, dur: 200 }
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

function playShootSound() {
    if (!audioCtx || !musicEnabled) return;
    playTone(800, 50, 'square', 0.05);
}

function playExplosionSound() {
    if (!audioCtx || !musicEnabled) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
}

function playPowerUpSound() {
    if (!audioCtx || !musicEnabled) return;
    [523, 659, 784].forEach((f, i) => setTimeout(() => playTone(f, 100, 'sine', 0.08), i * 80));
}

function playDeathSound() {
    if (!audioCtx || !musicEnabled) return;
    [400, 350, 300, 250, 200].forEach((f, i) => setTimeout(() => playTone(f, 150, 'sawtooth', 0.1), i * 150));
}

function playBossSound() {
    if (!audioCtx || !musicEnabled) return;
    [200, 250, 200, 150].forEach((f, i) => setTimeout(() => playTone(f, 200, 'sawtooth', 0.12), i * 200));
}

function playMusicNote() {
    if (!audioCtx || !musicEnabled || !musicPlaying) return;
    const note = SPACE_THEME[currentMusicNote];
    if (note.freq > 0) playTone(note.freq, note.dur * 0.8, 'square', 0.03);
    currentMusicNote = (currentMusicNote + 1) % SPACE_THEME.length;
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

function initGame() {
    player = { x: CANVAS_WIDTH / 2 - 20, y: CANVAS_HEIGHT - 60, width: 40, height: 40, speed: 5 };
    bullets = [];
    enemies = [];
    enemyBullets = [];
    particles = [];
    powerUps = [];
    stars = [];
    boss = null;
    score = 0;
    wave = 1;
    lives = 3;
    powerUp = null;
    powerTimer = 0;
    shootCooldown = 0;
    enemyShootCooldown = 0;
    bossWave = false;

    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 2 + 0.5
        });
    }

    spawnWave();
    updateHUD();
}

function spawnWave() {
    enemies = [];
    enemyBullets = [];
    boss = null;
    bossWave = wave % 5 === 0;

    if (bossWave) {
        boss = {
            x: CANVAS_WIDTH / 2 - 40,
            y: 50,
            width: 80,
            height: 60,
            hp: 5 + Math.floor(wave / 5) * 2,
            maxHp: 5 + Math.floor(wave / 5) * 2,
            speed: 1 + wave * 0.1,
            dir: 1,
            shootTimer: 0,
            alive: true
        };
        playBossSound();
        showMessage(`BOSS WAVE ${wave}!`, 'warning');
    } else {
        const enemyCount = 5 + wave * 2;
        const rows = Math.min(3, 1 + Math.floor(wave / 3));
        const cols = Math.ceil(enemyCount / rows);
        const spacingX = 60;
        const spacingY = 50;
        const startX = (CANVAS_WIDTH - (cols - 1) * spacingX) / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const type = wave >= 6 && Math.random() < 0.3 ? 'shooter' :
                            wave >= 3 && Math.random() < 0.3 ? 'fast' : 'basic';
                enemies.push({
                    x: startX + col * spacingX,
                    y: 50 + row * spacingY,
                    width: 30,
                    height: 30,
                    speed: (1 + wave * 0.15) * (type === 'fast' ? 1.5 : 1),
                    dir: 1,
                    type: type,
                    alive: true,
                    shootTimer: Math.random() * 120 + 60,
                    zigzag: 0,
                    zigzagSpeed: type === 'fast' ? 0.1 : 0.05
                });
            }
        }
    }
}

function updateHUD() {
    scoreEl.textContent = String(score).padStart(6, '0');
    waveEl.textContent = wave;
    livesEl.textContent = lives;
    powerEl.textContent = powerUp ? powerUp.toUpperCase() : '---';
}

function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    setTimeout(() => { messageEl.className = 'message hidden'; }, 2000);
}

function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            score = data.score || 0;
            wave = data.wave || 1;
            lives = data.lives || 3;
            highScore = data.highScore || 0;
            updateHUD();
            showMessage('Progress loaded!', 'info');
        } catch (e) { resetProgress(); }
    } else {
        highScore = parseInt(localStorage.getItem(STORAGE_KEY + 'HighScore')) || 0;
    }
}

function saveProgress() {
    const data = { score, wave, lives, highScore };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(STORAGE_KEY + 'HighScore', highScore);
    showMessage('Progress saved!', 'success');
}

function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + 'HighScore');
    score = 0;
    wave = 1;
    lives = 3;
    highScore = 0;
    updateHUD();
    initGame();
    draw();
    showMessage('Progress reset!', 'warning');
}

function drawStars() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > CANVAS_HEIGHT) { star.y = 0; star.x = Math.random() * CANVAS_WIDTH; }
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });
}

function drawPlayer() {
    const px = player.x;
    const py = player.y;

    ctx.fillStyle = '#00ffcc';
    ctx.beginPath();
    ctx.moveTo(px + 20, py);
    ctx.lineTo(px + 40, py + 40);
    ctx.lineTo(px + 30, py + 35);
    ctx.lineTo(px + 20, py + 30);
    ctx.lineTo(px + 10, py + 35);
    ctx.lineTo(px, py + 40);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#00cc99';
    ctx.fillRect(px + 15, py + 10, 10, 20);

    ctx.fillStyle = '#ff6600';
    ctx.fillRect(px + 10, py + 35, 6, 5 + Math.random() * 5);
    ctx.fillRect(px + 24, py + 35, 6, 5 + Math.random() * 5);

    if (powerUp === 'shield') {
        ctx.strokeStyle = '#00aaff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px + 20, py + 20, 25, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function drawBullets() {
    bullets.forEach(b => {
        ctx.fillStyle = powerUp === 'spread' ? '#ff00ff' : '#00ffcc';
        ctx.fillRect(b.x, b.y, 4, 10);
        ctx.fillStyle = '#fff';
        ctx.fillRect(b.x + 1, b.y, 2, 6);
    });

    enemyBullets.forEach(b => {
        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff6688';
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawEnemies() {
    enemies.forEach(e => {
        if (!e.alive) return;
        const ex = e.x;
        const ey = e.y;

        if (e.type === 'fast') {
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.moveTo(ex + 15, ey);
            ctx.lineTo(ex + 30, ey + 15);
            ctx.lineTo(ex + 25, ey + 30);
            ctx.lineTo(ex + 5, ey + 30);
            ctx.lineTo(ex, ey + 15);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#ff9900';
            ctx.fillRect(ex + 10, ey + 10, 10, 10);
        } else if (e.type === 'shooter') {
            ctx.fillStyle = '#ff0055';
            ctx.fillRect(ex + 5, ey, 20, 20);
            ctx.fillRect(ex, ey + 10, 30, 10);
            ctx.fillStyle = '#cc0044';
            ctx.fillRect(ex + 10, ey + 20, 10, 10);
            ctx.fillStyle = '#fff';
            ctx.fillRect(ex + 10, ey + 5, 4, 4);
            ctx.fillRect(ex + 16, ey + 5, 4, 4);
        } else {
            ctx.fillStyle = '#00aaff';
            ctx.beginPath();
            ctx.arc(ex + 15, ey + 15, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0088cc';
            ctx.beginPath();
            ctx.arc(ex + 15, ey + 15, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.fillRect(ex + 8, ey + 10, 4, 4);
            ctx.fillRect(ex + 18, ey + 10, 4, 4);
        }
    });

    if (boss && boss.alive) {
        const bx = boss.x;
        const by = boss.y;

        ctx.fillStyle = '#ff0055';
        ctx.fillRect(bx + 10, by, 60, 20);
        ctx.fillRect(bx, by + 10, 80, 30);
        ctx.fillRect(bx + 10, by + 40, 60, 20);

        ctx.fillStyle = '#cc0044';
        ctx.fillRect(bx + 20, by + 15, 40, 20);

        ctx.fillStyle = '#fff';
        ctx.fillRect(bx + 25, by + 20, 8, 8);
        ctx.fillRect(bx + 47, by + 20, 8, 8);

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(bx + 27, by + 22, 4, 4);
        ctx.fillRect(bx + 49, by + 22, 4, 4);

        ctx.fillStyle = '#ff6600';
        ctx.fillRect(bx + 30, by + 45, 20, 10);

        const barWidth = 70;
        const barHeight = 6;
        const barX = bx + (boss.width - barWidth) / 2;
        const barY = by - 12;
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(barX, barY, barWidth * (boss.hp / boss.maxHp), barHeight);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}

function drawPowerUps() {
    powerUps.forEach(p => {
        ctx.fillStyle = p.type === 'shield' ? '#00aaff' :
                       p.type === 'rapid' ? '#ffcc00' : '#ff00ff';
        ctx.beginPath();
        ctx.arc(p.x + 10, p.y + 10, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(p.type === 'shield' ? 'S' : p.type === 'rapid' ? 'R' : 'W', p.x + 10, p.y + 13);
    });
}

function drawParticles() {
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.vy += 0.1;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.globalAlpha = 1;

        return p.life > 0;
    });
}

function drawMenu() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawStars();

    ctx.fillStyle = '#00ffcc';
    ctx.font = '36px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SPACE SHOOTER', CANVAS_WIDTH / 2, 150);

    ctx.fillStyle = '#ff00ff';
    ctx.font = '18px "Press Start 2P", monospace';
    ctx.fillText('RETRO ARCADE', CANVAS_WIDTH / 2, 200);

    ctx.fillStyle = '#fff';
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillText('Press ENTER to Start', CANVAS_WIDTH / 2, 300);

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#ccc';
    ctx.fillText('Arrow Keys / A D = Move', CANVAS_WIDTH / 2, 360);
    ctx.fillText('SPACE = Shoot', CANVAS_WIDTH / 2, 385);
    ctx.fillText('CTRL+S = Save  |  R = Reset', CANVAS_WIDTH / 2, 410);
    ctx.fillText('M = Toggle Music', CANVAS_WIDTH / 2, 435);

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
    ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, 200);

    ctx.fillStyle = '#fff';
    ctx.font = '18px "Press Start 2P", monospace';
    ctx.fillText(`SCORE: ${score}`, CANVAS_WIDTH / 2, 260);
    ctx.fillText(`WAVE: ${wave}`, CANVAS_WIDTH / 2, 290);

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
    ctx.fillText(`WAVES CLEARED: ${wave}`, CANVAS_WIDTH / 2, 260);

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
    drawPowerUps();
    drawBullets();
    drawEnemies();
    drawPlayer();
    drawParticles();
}

function updatePlayer() {
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        player.x += player.speed;
    }

    if (player.x < 0) player.x = 0;
    if (player.x > CANVAS_WIDTH - player.width) player.x = CANVAS_WIDTH - player.width;

    if (shootCooldown > 0) shootCooldown--;

    if (keys[' '] || keys['Space']) {
        const cooldown = powerUp === 'rapid' ? 8 : 15;
        if (shootCooldown <= 0) {
            if (powerUp === 'spread') {
                bullets.push({ x: player.x + 18, y: player.y, vx: 0, vy: -8 });
                bullets.push({ x: player.x + 10, y: player.y + 5, vx: -2, vy: -7 });
                bullets.push({ x: player.x + 26, y: player.y + 5, vx: 2, vy: -7 });
            } else {
                bullets.push({ x: player.x + 18, y: player.y, vx: 0, vy: -8 });
            }
            shootCooldown = cooldown;
            playShootSound();
        }
    }

    if (powerTimer > 0) {
        powerTimer--;
        if (powerTimer <= 0) powerUp = null;
    }
}

function updateBullets() {
    bullets = bullets.filter(b => {
        b.x += b.vx || 0;
        b.y += b.vy;
        return b.y > -10 && b.y < CANVAS_HEIGHT + 10 && b.x > -10 && b.x < CANVAS_WIDTH + 10;
    });

    enemyBullets = enemyBullets.filter(b => {
        b.x += b.vx;
        b.y += b.vy;
        return b.y < CANVAS_HEIGHT + 10 && b.y > -10;
    });
}

function updateEnemies() {
    let moveDown = false;

    enemies.forEach(e => {
        if (!e.alive) return;

        if (e.type === 'fast') {
            e.zigzag += e.zigzagSpeed;
            e.x += Math.sin(e.zigzag) * 3;
            e.y += e.speed * 0.3;
        } else {
            e.x += e.speed * e.dir;
        }

        if (e.x <= 0 || e.x >= CANVAS_WIDTH - e.width) {
            e.dir *= -1;
            moveDown = true;
        }

        if (e.type === 'shooter') {
            e.shootTimer--;
            if (e.shootTimer <= 0) {
                const dx = player.x + 20 - (e.x + 15);
                const dy = player.y + 20 - (e.y + 15);
                const dist = Math.sqrt(dx * dx + dy * dy);
                enemyBullets.push({
                    x: e.x + 15,
                    y: e.y + 30,
                    vx: (dx / dist) * 3,
                    vy: (dy / dist) * 3
                });
                e.shootTimer = 90 - wave * 3;
                if (e.shootTimer < 30) e.shootTimer = 30;
            }
        }
    });

    if (moveDown) {
        enemies.forEach(e => { if (e.alive) e.y += 10; });
    }

    if (boss && boss.alive) {
        boss.x += boss.speed * boss.dir;
        if (boss.x <= 0 || boss.x >= CANVAS_WIDTH - boss.width) {
            boss.dir *= -1;
        }

        boss.shootTimer++;
        if (boss.shootTimer >= 60) {
            boss.shootTimer = 0;
            enemyBullets.push({ x: boss.x + 40, y: boss.y + 60, vx: 0, vy: 5 });
            enemyBullets.push({ x: boss.x + 20, y: boss.y + 50, vx: -2, vy: 4 });
            enemyBullets.push({ x: boss.x + 60, y: boss.y + 50, vx: 2, vy: 4 });
        }
    }

    enemies = enemies.filter(e => {
        if (!e.alive) return false;
        if (e.y > CANVAS_HEIGHT - 50) {
            lives--;
            updateHUD();
            if (lives <= 0) gameOver();
            return false;
        }
        return true;
    });
}

function checkCollisions() {
    bullets.forEach((b, bi) => {
        enemies.forEach(e => {
            if (!e.alive) return;
            if (b.x > e.x && b.x < e.x + e.width && b.y > e.y && b.y < e.y + e.height) {
                e.alive = false;
                bullets.splice(bi, 1);
                score += e.type === 'fast' ? 200 : e.type === 'shooter' ? 300 : 100;
                spawnExplosion(e.x + e.width / 2, e.y + e.height / 2, e.type === 'fast' ? '#ffcc00' : e.type === 'shooter' ? '#ff0055' : '#00aaff');
                playExplosionSound();
                updateHUD();

                if (Math.random() < 0.1) {
                    const types = ['shield', 'rapid', 'spread'];
                    powerUps.push({
                        x: e.x,
                        y: e.y,
                        width: 20,
                        height: 20,
                        type: types[Math.floor(Math.random() * types.length)],
                        speed: 2
                    });
                }
            }
        });

        if (boss && boss.alive && b.x > boss.x && b.x < boss.x + boss.width && b.y > boss.y && b.y < boss.y + boss.height) {
            boss.hp--;
            bullets.splice(bi, 1);
            score += 100;
            spawnExplosion(b.x, b.y, '#ff0055');
            playExplosionSound();
            updateHUD();

            if (boss.hp <= 0) {
                boss.alive = false;
                score += 2000;
                for (let i = 0; i < 30; i++) {
                    spawnExplosion(boss.x + Math.random() * boss.width, boss.y + Math.random() * boss.height, ['#ff0055', '#ff6600', '#ffcc00'][Math.floor(Math.random() * 3)]);
                }
                playExplosionSound();
                wave++;
                setTimeout(() => spawnWave(), 1000);
                updateHUD();
            }
        }
    });

    enemyBullets.forEach((b, bi) => {
        if (b.x > player.x && b.x < player.x + player.width && b.y > player.y && b.y < player.y + player.height) {
            enemyBullets.splice(bi, 1);
            if (powerUp === 'shield') {
                powerUp = null;
                powerTimer = 0;
                spawnExplosion(b.x, b.y, '#00aaff');
            } else {
                playerHit();
            }
        }
    });

    enemies.forEach(e => {
        if (!e.alive) return;
        if (player.x < e.x + e.width && player.x + player.width > e.x &&
            player.y < e.y + e.height && player.y + player.height > e.y) {
            e.alive = false;
            if (powerUp !== 'shield') playerHit();
            spawnExplosion(e.x + e.width / 2, e.y + e.height / 2, '#ff0055');
        }
    });

    if (boss && boss.alive) {
        if (player.x < boss.x + boss.width && player.x + player.width > boss.x &&
            player.y < boss.y + boss.height && player.y + player.height > boss.y) {
            if (powerUp !== 'shield') playerHit();
        }
    }

    powerUps = powerUps.filter(p => {
        p.y += p.speed;
        if (p.y > CANVAS_HEIGHT) return false;

        if (player.x < p.x + p.width && player.x + player.width > p.x &&
            player.y < p.y + p.height && player.y + player.height > p.y) {
            powerUp = p.type;
            powerTimer = 600;
            playPowerUpSound();
            updateHUD();
            return false;
        }
        return true;
    });

    if (enemies.length === 0 && (!boss || !boss.alive)) {
        wave++;
        spawnWave();
        updateHUD();
    }
}

function playerHit() {
    lives--;
    updateHUD();
    playDeathSound();
    spawnExplosion(player.x + 20, player.y + 20, '#00ffcc');

    if (lives <= 0) {
        gameOver();
    } else {
        player.x = CANVAS_WIDTH / 2 - 20;
        player.y = CANVAS_HEIGHT - 60;
    }
}

function spawnExplosion(x, y, color) {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 30 + Math.random() * 20,
            maxLife: 50,
            size: 2 + Math.random() * 4,
            color: color
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
        localStorage.setItem(STORAGE_KEY + 'HighScore', highScore);
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
