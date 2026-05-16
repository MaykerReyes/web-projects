const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 32;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 480;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const GRAVITY = 0.5;
const JUMP_FORCE = -16;
const MOVE_SPEED = 4;
const FRICTION = 0.8;
const MAX_FALL_SPEED = 12;

const STORAGE_KEY = 'marioRetroProgress';

const TILE = {
    EMPTY: 0,
    GROUND: 1,
    BRICK: 2,
    QUESTION: 3,
    PIPE_TOP_LEFT: 4,
    PIPE_TOP_RIGHT: 5,
    PIPE_BODY_LEFT: 6,
    PIPE_BODY_RIGHT: 7,
    HARD_BLOCK: 8,
    USED_BLOCK: 9,
    LAVA: 10,
    CLOUD: 11,
    CASTLE_BLOCK: 12
};

const LEVEL_WIDTH = 100;
const LEVEL_HEIGHT = 15;

let level = [];
let camera = { x: 0 };
let score = 0;
let coins = 0;
let lives = 3;
let time = 400;
let highScore = 0;
let currentWorld = 1;
let unlockedWorld = 1;
let gameRunning = false;
let gameLoop = null;
let timeInterval = null;
let player = null;
let enemies = [];
let particles = [];
let floatingTexts = [];
let fireballs = [];
let movingPlatforms = [];
let boss = null;
let gameState = 'menu';
let worldTransition = false;
let transitionTimer = 0;
let lavaAnimOffset = 0;
let bossFireTimer = 0;

let audioCtx = null;
let musicEnabled = true;
let musicPlaying = false;
let musicTimeout = null;
let currentMusicNote = 0;

const WORLD_CONFIG = {
    1: {
        name: 'GRASSLAND',
        sky: '#6b8cff',
        ground: '#c84c0c',
        groundDark: '#a03800',
        hill: '#00a800',
        hillDark: '#008000',
        bush: '#00a800',
        cloud: '#fff',
        time: 400,
        enemySpeed: 1,
        enemyCount: 6,
        flagPos: 80
    },
    2: {
        name: 'UNDERGROUND',
        sky: '#1a1a2e',
        ground: '#4a4a6a',
        groundDark: '#3a3a5a',
        hill: '#4a4a6a',
        hillDark: '#3a3a5a',
        bush: '#4a4a6a',
        cloud: '#2a2a4a',
        time: 350,
        enemySpeed: 1.2,
        enemyCount: 10,
        flagPos: 85
    },
    3: {
        name: 'SKY WORLD',
        sky: '#87ceeb',
        ground: '#f0f0f0',
        groundDark: '#d0d0d0',
        hill: '#e8e8e8',
        hillDark: '#d8d8d8',
        bush: '#f0f0f0',
        cloud: '#fff',
        time: 300,
        enemySpeed: 1.3,
        enemyCount: 10,
        flagPos: 90
    },
    4: {
        name: 'WATER WORLD',
        sky: '#2d4a7a',
        ground: '#1a3a5a',
        groundDark: '#0a2a4a',
        hill: '#2d4a7a',
        hillDark: '#1d3a6a',
        bush: '#2d4a7a',
        cloud: '#4a6a9a',
        time: 300,
        enemySpeed: 1.5,
        enemyCount: 12,
        flagPos: 95
    },
    5: {
        name: 'CASTLE',
        sky: '#1a1a1a',
        ground: '#3a3a3a',
        groundDark: '#2a2a2a',
        hill: '#2a2a2a',
        hillDark: '#1a1a1a',
        bush: '#2a2a2a',
        cloud: '#333',
        time: 350,
        enemySpeed: 1.5,
        enemyCount: 8,
        flagPos: 95
    }
};

const colors = {
    sky: '#6b8cff',
    ground: '#c84c0c',
    groundDark: '#a03800',
    brick: '#c84c0c',
    brickDark: '#a03800',
    question: '#fbd000',
    questionDark: '#c8a000',
    usedBlock: '#888',
    pipe: '#00a800',
    pipeDark: '#008000',
    mario: '#e52521',
    marioDark: '#8b0000',
    marioSkin: '#fcb880',
    goomba: '#c84c0c',
    goombaDark: '#803000',
    koopa: '#00a800',
    koopaDark: '#008000',
    coin: '#fbd000',
    coinDark: '#c8a000',
    cloud: '#fff',
    bush: '#00a800',
    hill: '#00a800',
    hillDark: '#008000',
    flagPole: '#888',
    flag: '#00a800',
    lava: '#ff4500',
    lavaDark: '#cc3700',
    boss: '#8b0000',
    bossDark: '#5a0000',
    fireball: '#ff6600',
    bossHealth: '#e52521'
};

const MARIO_THEME = [
    { freq: 660, dur: 150 }, { freq: 660, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 660, dur: 150 }, { freq: 0, dur: 150 }, { freq: 523, dur: 150 },
    { freq: 660, dur: 150 }, { freq: 0, dur: 150 }, { freq: 784, dur: 150 },
    { freq: 0, dur: 150 }, { freq: 0, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 392, dur: 150 }, { freq: 0, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 0, dur: 150 }, { freq: 523, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 0, dur: 150 }, { freq: 392, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 0, dur: 150 }, { freq: 330, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 0, dur: 150 }, { freq: 440, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 0, dur: 150 }, { freq: 494, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 0, dur: 150 }, { freq: 466, dur: 150 }, { freq: 440, dur: 150 },
    { freq: 0, dur: 150 }, { freq: 392, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 660, dur: 150 }, { freq: 784, dur: 150 }, { freq: 880, dur: 150 },
    { freq: 0, dur: 150 }, { freq: 704, dur: 150 }, { freq: 784, dur: 150 },
    { freq: 0, dur: 150 }, { freq: 660, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 523, dur: 150 }, { freq: 587, dur: 150 }, { freq: 494, dur: 150 },
    { freq: 0, dur: 150 }, { freq: 0, dur: 150 }, { freq: 523, dur: 150 },
    { freq: 0, dur: 150 }, { freq: 392, dur: 150 }, { freq: 330, dur: 150 },
    { freq: 0, dur: 150 }, { freq: 440, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 494, dur: 150 }, { freq: 0, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 466, dur: 150 }, { freq: 440, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 392, dur: 150 }, { freq: 0, dur: 150 }, { freq: 660, dur: 150 },
    { freq: 784, dur: 150 }, { freq: 880, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 704, dur: 150 }, { freq: 784, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 660, dur: 150 }, { freq: 0, dur: 150 }, { freq: 523, dur: 150 },
    { freq: 587, dur: 150 }, { freq: 494, dur: 150 }, { freq: 0, dur: 150 },
    { freq: 0, dur: 150 }, { freq: 0, dur: 150 }
];

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playTone(freq, duration, type = 'square', volume = 0.1) {
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

function playJumpSound() {
    if (!audioCtx || !musicEnabled) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

function playCoinSound() {
    if (!audioCtx || !musicEnabled) return;
    playTone(988, 80, 'square', 0.08);
    setTimeout(() => playTone(1319, 200, 'square', 0.08), 80);
}

function playStompSound() {
    if (!audioCtx || !musicEnabled) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

function playDeathSound() {
    if (!audioCtx || !musicEnabled) return;
    const notes = [400, 350, 300, 250, 200, 150];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 150, 'square', 0.1), i * 150);
    });
}

function playPowerUpSound() {
    if (!audioCtx || !musicEnabled) return;
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 100, 'square', 0.08), i * 80);
    });
}

function playBumpSound() {
    if (!audioCtx || !musicEnabled) return;
    playTone(150, 50, 'square', 0.06);
}

function playBossHitSound() {
    if (!audioCtx || !musicEnabled) return;
    playTone(200, 100, 'sawtooth', 0.1);
    setTimeout(() => playTone(150, 100, 'sawtooth', 0.1), 100);
}

function playFireballSound() {
    if (!audioCtx || !musicEnabled) return;
    playTone(300, 50, 'sawtooth', 0.05);
}

function playMusicNote() {
    if (!audioCtx || !musicEnabled || !musicPlaying) return;
    const note = MARIO_THEME[currentMusicNote];
    if (note.freq > 0) {
        playTone(note.freq, note.dur * 0.8, 'square', 0.04);
    }
    currentMusicNote = (currentMusicNote + 1) % MARIO_THEME.length;
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
    if (musicTimeout) {
        clearTimeout(musicTimeout);
        musicTimeout = null;
    }
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    if (musicEnabled) startMusic();
    else stopMusic();
    return musicEnabled;
}

function getConfig() {
    return WORLD_CONFIG[currentWorld] || WORLD_CONFIG[1];
}

function generateWorld(worldNum) {
    level = [];
    for (let y = 0; y < LEVEL_HEIGHT; y++) {
        level[y] = [];
        for (let x = 0; x < LEVEL_WIDTH; x++) {
            level[y][x] = TILE.EMPTY;
        }
    }
    enemies = [];
    movingPlatforms = [];
    boss = null;
    fireballs = [];
    bossFireTimer = 0;

    const config = getConfig();

    switch (worldNum) {
        case 1: generateWorld1(config); break;
        case 2: generateWorld2(config); break;
        case 3: generateWorld3(config); break;
        case 4: generateWorld4(config); break;
        case 5: generateWorld5(config); break;
        default: generateWorld1(config);
    }
}

function generateWorld1(config) {
    for (let x = 0; x < LEVEL_WIDTH; x++) {
        if ((x >= 35 && x <= 36) || (x >= 65 && x <= 66)) continue;
        level[13][x] = TILE.GROUND;
        level[14][x] = TILE.GROUND;
    }

    level[9][16] = TILE.QUESTION;
    level[9][20] = TILE.BRICK;
    level[9][21] = TILE.QUESTION;
    level[9][22] = TILE.BRICK;
    level[9][23] = TILE.QUESTION;
    level[9][24] = TILE.BRICK;
    level[5][22] = TILE.QUESTION;

    level[9][38] = TILE.BRICK;
    level[9][39] = TILE.QUESTION;
    level[9][40] = TILE.BRICK;

    for (let x = 45; x <= 48; x++) level[9][x] = TILE.BRICK;
    level[5][47] = TILE.QUESTION;

    level[9][55] = TILE.BRICK;
    level[9][56] = TILE.QUESTION;
    level[9][57] = TILE.BRICK;
    level[9][58] = TILE.QUESTION;

    for (let y = 11; y <= 12; y++) {
        level[y][28] = TILE.PIPE_BODY_LEFT;
        level[y][29] = TILE.PIPE_BODY_RIGHT;
    }
    level[10][28] = TILE.PIPE_TOP_LEFT;
    level[10][29] = TILE.PIPE_TOP_RIGHT;

    for (let y = 10; y <= 12; y++) {
        level[y][42] = TILE.PIPE_BODY_LEFT;
        level[y][43] = TILE.PIPE_BODY_RIGHT;
    }
    level[9][42] = TILE.PIPE_TOP_LEFT;
    level[9][43] = TILE.PIPE_TOP_RIGHT;

    for (let y = 9; y <= 12; y++) {
        level[y][52] = TILE.PIPE_BODY_LEFT;
        level[y][53] = TILE.PIPE_BODY_RIGHT;
    }
    level[8][52] = TILE.PIPE_TOP_LEFT;
    level[8][53] = TILE.PIPE_TOP_RIGHT;

    for (let i = 0; i < 4; i++) {
        for (let y = 12 - i; y <= 12; y++) level[y][60 + i] = TILE.HARD_BLOCK;
    }
    for (let i = 0; i < 4; i++) {
        for (let y = 12 - (3 - i); y <= 12; y++) level[y][65 + i] = TILE.HARD_BLOCK;
    }
    for (let i = 0; i < 8; i++) {
        for (let y = 12 - i; y <= 12; y++) level[y][75 + i] = TILE.HARD_BLOCK;
    }

    level[7][config.flagPos] = TILE.HARD_BLOCK;
    for (let y = 3; y <= 12; y++) level[y][config.flagPos] = TILE.HARD_BLOCK;

    const sp = config.enemySpeed;
    enemies.push({ x: 22 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 30 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 40 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 48 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 55 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 62 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
}

function generateWorld2(config) {
    for (let x = 0; x < LEVEL_WIDTH; x++) {
        if ((x >= 25 && x <= 27) || (x >= 50 && x <= 52) || (x >= 70 && x <= 72)) {
            level[13][x] = TILE.LAVA;
            level[14][x] = TILE.LAVA;
            continue;
        }
        level[13][x] = TILE.GROUND;
        level[14][x] = TILE.GROUND;
    }

    level[9][10] = TILE.BRICK;
    level[9][11] = TILE.QUESTION;
    level[9][12] = TILE.BRICK;
    level[9][13] = TILE.QUESTION;
    level[9][14] = TILE.BRICK;

    level[7][18] = TILE.BRICK;
    level[7][19] = TILE.BRICK;
    level[7][20] = TILE.QUESTION;
    level[7][21] = TILE.BRICK;
    level[7][22] = TILE.BRICK;

    for (let x = 28; x <= 32; x++) level[9][x] = TILE.BRICK;
    level[5][30] = TILE.QUESTION;
    level[5][31] = TILE.QUESTION;

    level[9][35] = TILE.BRICK;
    level[9][36] = TILE.BRICK;
    level[9][37] = TILE.QUESTION;
    level[9][38] = TILE.BRICK;

    for (let y = 11; y <= 12; y++) {
        level[y][40] = TILE.PIPE_BODY_LEFT;
        level[y][41] = TILE.PIPE_BODY_RIGHT;
    }
    level[10][40] = TILE.PIPE_TOP_LEFT;
    level[10][41] = TILE.PIPE_TOP_RIGHT;

    for (let x = 43; x <= 47; x++) level[9][x] = TILE.BRICK;
    level[5][45] = TILE.QUESTION;

    level[9][55] = TILE.BRICK;
    level[9][56] = TILE.QUESTION;
    level[9][57] = TILE.BRICK;
    level[9][58] = TILE.QUESTION;
    level[9][59] = TILE.BRICK;

    for (let x = 62; x <= 66; x++) level[9][x] = TILE.BRICK;
    level[5][64] = TILE.QUESTION;

    for (let i = 0; i < 4; i++) {
        for (let y = 12 - i; y <= 12; y++) level[y][75 + i] = TILE.HARD_BLOCK;
    }
    for (let i = 0; i < 4; i++) {
        for (let y = 12 - (3 - i); y <= 12; y++) level[y][80 + i] = TILE.HARD_BLOCK;
    }

    level[7][config.flagPos] = TILE.HARD_BLOCK;
    for (let y = 3; y <= 12; y++) level[y][config.flagPos] = TILE.HARD_BLOCK;

    const sp = config.enemySpeed;
    enemies.push({ x: 15 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 20 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 33 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 38 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 45 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 55 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 60 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 65 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 28 * TILE_SIZE, y: 8 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1.2 * sp, alive: true, type: 'koopa' });
    enemies.push({ x: 58 * TILE_SIZE, y: 8 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1.2 * sp, alive: true, type: 'koopa' });
}

function generateWorld3(config) {
    for (let x = 0; x < 8; x++) {
        level[13][x] = TILE.GROUND;
        level[14][x] = TILE.GROUND;
    }
    for (let x = 12; x < 18; x++) {
        level[13][x] = TILE.GROUND;
        level[14][x] = TILE.GROUND;
    }
    for (let x = 22; x < 30; x++) {
        level[13][x] = TILE.GROUND;
        level[14][x] = TILE.GROUND;
    }
    for (let x = 35; x < 42; x++) {
        level[13][x] = TILE.GROUND;
        level[14][x] = TILE.GROUND;
    }
    for (let x = 48; x < 55; x++) {
        level[13][x] = TILE.GROUND;
        level[14][x] = TILE.GROUND;
    }
    for (let x = 60; x < 68; x++) {
        level[13][x] = TILE.GROUND;
        level[14][x] = TILE.GROUND;
    }
    for (let x = 73; x < 80; x++) {
        level[13][x] = TILE.GROUND;
        level[14][x] = TILE.GROUND;
    }
    for (let x = 85; x < 95; x++) {
        level[13][x] = TILE.GROUND;
        level[14][x] = TILE.GROUND;
    }

    for (let x = 9; x <= 11; x++) level[9][x] = TILE.CLOUD;
    level[5][10] = TILE.QUESTION;

    for (let x = 19; x <= 21; x++) level[8][x] = TILE.CLOUD;
    level[4][20] = TILE.QUESTION;

    for (let x = 31; x <= 34; x++) level[9][x] = TILE.CLOUD;
    level[5][32] = TILE.QUESTION;
    level[5][33] = TILE.QUESTION;

    for (let x = 43; x <= 47; x++) level[8][x] = TILE.CLOUD;
    level[4][45] = TILE.QUESTION;

    for (let x = 56; x <= 59; x++) level[9][x] = TILE.CLOUD;
    level[5][57] = TILE.QUESTION;

    for (let x = 69; x <= 72; x++) level[8][x] = TILE.CLOUD;
    level[4][70] = TILE.QUESTION;

    for (let x = 81; x <= 84; x++) level[9][x] = TILE.CLOUD;
    level[5][82] = TILE.QUESTION;

    for (let x = 88; x <= 92; x++) level[7][x] = TILE.HARD_BLOCK;

    level[7][config.flagPos] = TILE.HARD_BLOCK;
    for (let y = 3; y <= 12; y++) level[y][config.flagPos] = TILE.HARD_BLOCK;

    const sp = config.enemySpeed;
    enemies.push({ x: 14 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 24 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 37 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 50 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 62 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 75 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 87 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 16 * TILE_SIZE, y: 6 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1.3 * sp, alive: true, type: 'flying_goomba', baseY: 6, flyOffset: 0 });
    enemies.push({ x: 40 * TILE_SIZE, y: 5 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1.3 * sp, alive: true, type: 'flying_goomba', baseY: 5, flyOffset: 0 });
    enemies.push({ x: 65 * TILE_SIZE, y: 6 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1.3 * sp, alive: true, type: 'flying_goomba', baseY: 6, flyOffset: 0 });
}

function generateWorld4(config) {
    for (let x = 0; x < LEVEL_WIDTH; x++) {
        if (x < 5 || x > 10 && x < 16 || x > 20 && x < 26 || x > 30 && x < 36 || x > 40 && x < 46 || x > 50 && x < 56 || x > 60 && x < 66 || x > 70 && x < 76 || x > 80 && x < 86 || x > 90) {
            level[13][x] = TILE.GROUND;
            level[14][x] = TILE.GROUND;
        } else {
            level[13][x] = TILE.LAVA;
            level[14][x] = TILE.LAVA;
        }
    }

    level[9][6] = TILE.QUESTION;
    level[9][7] = TILE.BRICK;
    level[9][8] = TILE.QUESTION;

    level[9][17] = TILE.BRICK;
    level[9][18] = TILE.QUESTION;
    level[9][19] = TILE.BRICK;
    level[5][18] = TILE.QUESTION;

    level[9][27] = TILE.BRICK;
    level[9][28] = TILE.BRICK;
    level[9][29] = TILE.QUESTION;
    level[9][30] = TILE.BRICK;

    level[9][37] = TILE.BRICK;
    level[9][38] = TILE.QUESTION;
    level[9][39] = TILE.BRICK;

    level[9][47] = TILE.BRICK;
    level[9][48] = TILE.QUESTION;
    level[9][49] = TILE.BRICK;
    level[5][48] = TILE.QUESTION;

    level[9][57] = TILE.BRICK;
    level[9][58] = TILE.BRICK;
    level[9][59] = TILE.QUESTION;

    level[9][67] = TILE.BRICK;
    level[9][68] = TILE.QUESTION;
    level[9][69] = TILE.BRICK;

    level[9][77] = TILE.BRICK;
    level[9][78] = TILE.QUESTION;
    level[9][79] = TILE.BRICK;

    level[9][87] = TILE.BRICK;
    level[9][88] = TILE.QUESTION;
    level[9][89] = TILE.BRICK;

    movingPlatforms.push({ x: 11 * TILE_SIZE, y: 10 * TILE_SIZE, width: 3 * TILE_SIZE, height: TILE_SIZE / 2, startX: 11 * TILE_SIZE, endX: 14 * TILE_SIZE, speed: 1, dir: 1 });
    movingPlatforms.push({ x: 21 * TILE_SIZE, y: 10 * TILE_SIZE, width: 3 * TILE_SIZE, height: TILE_SIZE / 2, startX: 21 * TILE_SIZE, endX: 24 * TILE_SIZE, speed: 1.2, dir: 1 });
    movingPlatforms.push({ x: 31 * TILE_SIZE, y: 10 * TILE_SIZE, width: 3 * TILE_SIZE, height: TILE_SIZE / 2, startX: 31 * TILE_SIZE, endX: 34 * TILE_SIZE, speed: 1.4, dir: 1 });
    movingPlatforms.push({ x: 41 * TILE_SIZE, y: 10 * TILE_SIZE, width: 3 * TILE_SIZE, height: TILE_SIZE / 2, startX: 41 * TILE_SIZE, endX: 44 * TILE_SIZE, speed: 1.5, dir: 1 });
    movingPlatforms.push({ x: 51 * TILE_SIZE, y: 10 * TILE_SIZE, width: 3 * TILE_SIZE, height: TILE_SIZE / 2, startX: 51 * TILE_SIZE, endX: 54 * TILE_SIZE, speed: 1.6, dir: 1 });
    movingPlatforms.push({ x: 61 * TILE_SIZE, y: 10 * TILE_SIZE, width: 3 * TILE_SIZE, height: TILE_SIZE / 2, startX: 61 * TILE_SIZE, endX: 64 * TILE_SIZE, speed: 1.7, dir: 1 });
    movingPlatforms.push({ x: 71 * TILE_SIZE, y: 10 * TILE_SIZE, width: 3 * TILE_SIZE, height: TILE_SIZE / 2, startX: 71 * TILE_SIZE, endX: 74 * TILE_SIZE, speed: 1.8, dir: 1 });
    movingPlatforms.push({ x: 81 * TILE_SIZE, y: 10 * TILE_SIZE, width: 3 * TILE_SIZE, height: TILE_SIZE / 2, startX: 81 * TILE_SIZE, endX: 84 * TILE_SIZE, speed: 2, dir: 1 });

    for (let x = 91; x <= 94; x++) level[9][x] = TILE.HARD_BLOCK;

    level[7][config.flagPos] = TILE.HARD_BLOCK;
    for (let y = 3; y <= 12; y++) level[y][config.flagPos] = TILE.HARD_BLOCK;

    const sp = config.enemySpeed;
    enemies.push({ x: 6 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 13 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 18 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 23 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 28 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 33 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 38 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 43 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 48 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 53 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 58 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 63 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
}

function generateWorld5(config) {
    for (let x = 0; x < LEVEL_WIDTH; x++) {
        if (x < 75) {
            if ((x >= 20 && x <= 22) || (x >= 40 && x <= 42) || (x >= 55 && x <= 57)) {
                level[13][x] = TILE.LAVA;
                level[14][x] = TILE.LAVA;
                continue;
            }
            level[13][x] = TILE.GROUND;
            level[14][x] = TILE.GROUND;
        } else {
            level[13][x] = TILE.CASTLE_BLOCK;
            level[14][x] = TILE.CASTLE_BLOCK;
        }
    }

    for (let y = 11; y <= 12; y++) {
        level[y][10] = TILE.CASTLE_BLOCK;
        level[y][11] = TILE.CASTLE_BLOCK;
    }

    level[9][15] = TILE.BRICK;
    level[9][16] = TILE.QUESTION;
    level[9][17] = TILE.BRICK;

    for (let x = 25; x <= 28; x++) level[9][x] = TILE.CASTLE_BLOCK;
    level[5][26] = TILE.QUESTION;
    level[5][27] = TILE.QUESTION;

    for (let y = 11; y <= 12; y++) {
        level[y][30] = TILE.PIPE_BODY_LEFT;
        level[y][31] = TILE.PIPE_BODY_RIGHT;
    }
    level[10][30] = TILE.PIPE_TOP_LEFT;
    level[10][31] = TILE.PIPE_TOP_RIGHT;

    level[9][35] = TILE.BRICK;
    level[9][36] = TILE.QUESTION;
    level[9][37] = TILE.BRICK;
    level[9][38] = TILE.QUESTION;

    for (let x = 45; x <= 48; x++) level[9][x] = TILE.CASTLE_BLOCK;
    level[5][46] = TILE.QUESTION;

    for (let y = 11; y <= 12; y++) {
        level[y][50] = TILE.PIPE_BODY_LEFT;
        level[y][51] = TILE.PIPE_BODY_RIGHT;
    }
    level[10][50] = TILE.PIPE_TOP_LEFT;
    level[10][51] = TILE.PIPE_TOP_RIGHT;

    level[9][60] = TILE.BRICK;
    level[9][61] = TILE.QUESTION;
    level[9][62] = TILE.BRICK;
    level[9][63] = TILE.QUESTION;
    level[9][64] = TILE.BRICK;
    level[5][62] = TILE.QUESTION;

    for (let x = 68; x <= 72; x++) level[9][x] = TILE.CASTLE_BLOCK;

    for (let y = 5; y <= 12; y++) {
        level[y][75] = TILE.CASTLE_BLOCK;
        level[y][94] = TILE.CASTLE_BLOCK;
    }
    for (let x = 75; x <= 94; x++) {
        level[5][x] = TILE.CASTLE_BLOCK;
    }

    for (let x = 76; x <= 93; x++) {
        level[13][x] = TILE.LAVA;
        level[14][x] = TILE.LAVA;
    }

    for (let x = 80; x <= 89; x++) {
        level[11][x] = TILE.CASTLE_BLOCK;
    }

    boss = {
        x: 85 * TILE_SIZE,
        y: 10 * TILE_SIZE,
        width: 64,
        height: 64,
        vx: -1.5 * config.enemySpeed,
        hp: 3,
        maxHp: 3,
        alive: true,
        type: 'boss',
        flashTimer: 0,
        fireTimer: 0
    };

    level[7][config.flagPos] = TILE.HARD_BLOCK;
    for (let y = 3; y <= 12; y++) level[y][config.flagPos] = TILE.HARD_BLOCK;

    const sp = config.enemySpeed;
    enemies.push({ x: 8 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 14 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 26 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 33 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 38 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 46 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 52 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
    enemies.push({ x: 62 * TILE_SIZE, y: 12 * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, vx: -1 * sp, alive: true, type: 'goomba' });
}

function initPlayer() {
    player = {
        x: 3 * TILE_SIZE,
        y: 10 * TILE_SIZE,
        width: 28,
        height: 32,
        vx: 0,
        vy: 0,
        onGround: false,
        jumping: false,
        facing: 1,
        invincible: 0
    };
}

function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            score = data.score || 0;
            coins = data.coins || 0;
            lives = data.lives || 3;
            highScore = data.highScore || 0;
            currentWorld = data.currentWorld || 1;
            unlockedWorld = data.unlockedWorld || 1;
            updateHUD();
            showMessage('Progress loaded!', 'info');
        } catch (e) {
            resetProgress();
        }
    } else {
        highScore = parseInt(localStorage.getItem('marioHighScore')) || 0;
    }
}

function saveProgress() {
    const data = { score, coins, lives, highScore, currentWorld, unlockedWorld };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem('marioHighScore', highScore);
    showMessage('Progress saved!', 'success');
}

function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('marioHighScore');
    score = 0;
    coins = 0;
    lives = 3;
    highScore = 0;
    currentWorld = 1;
    unlockedWorld = 1;
    time = getConfig().time;
    updateHUD();
    resetGame();
    showMessage('Progress reset!', 'warning');
}

function resetGame() {
    generateWorld(currentWorld);
    initPlayer();
    camera.x = 0;
    particles = [];
    floatingTexts = [];
    time = getConfig().time;
    updateHUD();
    draw();
}

function advanceToWorld(worldNum) {
    currentWorld = worldNum;
    if (worldNum > unlockedWorld) {
        unlockedWorld = worldNum;
    }
    generateWorld(currentWorld);
    initPlayer();
    camera.x = 0;
    particles = [];
    floatingTexts = [];
    fireballs = [];
    time = getConfig().time;
    updateHUD();
}

function updateHUD() {
    document.getElementById('scoreDisplay').textContent = String(score).padStart(6, '0');
    document.getElementById('coinDisplay').textContent = String(coins).padStart(2, '0');
    document.getElementById('timeDisplay').textContent = time;
    document.getElementById('livesDisplay').textContent = lives;
    const worldEl = document.getElementById('worldDisplay');
    if (worldEl) worldEl.textContent = `1-${currentWorld}`;
}

function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = `message ${type}`;
    setTimeout(() => { msg.className = 'message hidden'; }, 2000);
}

function isSolid(tileType) {
    return [TILE.GROUND, TILE.BRICK, TILE.QUESTION, TILE.PIPE_TOP_LEFT, TILE.PIPE_TOP_RIGHT,
            TILE.PIPE_BODY_LEFT, TILE.PIPE_BODY_RIGHT, TILE.HARD_BLOCK, TILE.USED_BLOCK,
            TILE.CASTLE_BLOCK].includes(tileType);
}

function getTile(x, y) {
    const tileX = Math.floor(x / TILE_SIZE);
    const tileY = Math.floor(y / TILE_SIZE);
    if (tileX < 0 || tileX >= LEVEL_WIDTH || tileY < 0 || tileY >= LEVEL_HEIGHT) return TILE.EMPTY;
    return level[tileY][tileX];
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function resolveCollisions() {
    player.onGround = false;

    const left = Math.floor(player.x / TILE_SIZE);
    const right = Math.floor((player.x + player.width) / TILE_SIZE);
    const top = Math.floor(player.y / TILE_SIZE);
    const bottom = Math.floor((player.y + player.height) / TILE_SIZE);

    for (let y = top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) {
            if (x < 0 || x >= LEVEL_WIDTH || y < 0 || y >= LEVEL_HEIGHT) continue;
            const tile = level[y][x];
            if (!isSolid(tile) && tile !== TILE.CLOUD) continue;

            const tileRect = { x: x * TILE_SIZE, y: y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE };
            if (!checkCollision(player, tileRect)) continue;

            const overlapLeft = (player.x + player.width) - (x * TILE_SIZE);
            const overlapRight = ((x + 1) * TILE_SIZE) - player.x;
            const overlapTop = (player.y + player.height) - (y * TILE_SIZE);
            const overlapBottom = ((y + 1) * TILE_SIZE) - player.y;

            const minOverlapX = Math.min(overlapLeft, overlapRight);
            const minOverlapY = Math.min(overlapTop, overlapBottom);

            if (minOverlapX < minOverlapY) {
                if (overlapLeft < overlapRight) {
                    player.x = x * TILE_SIZE - player.width;
                } else {
                    player.x = (x + 1) * TILE_SIZE;
                }
                player.vx = 0;
            } else {
                if (overlapTop < overlapBottom) {
                    player.y = y * TILE_SIZE - player.height;
                    player.vy = 0;
                    player.onGround = true;
                    player.jumping = false;
                } else {
                    player.y = (y + 1) * TILE_SIZE;
                    player.vy = 0;
                    if (tile === TILE.QUESTION) hitQuestionBlock(x, y);
                    else if (tile === TILE.BRICK) hitBrickBlock(x, y);
                }
            }
        }
    }

    for (const mp of movingPlatforms) {
        const mpRect = { x: mp.x, y: mp.y, width: mp.width, height: mp.height };
        if (checkCollision(player, mpRect)) {
            const playerBottom = player.y + player.height;
            const platformTop = mp.y;
            if (playerBottom > platformTop && playerBottom < platformTop + 10 && player.vy >= 0) {
                player.y = mp.y - player.height;
                player.vy = 0;
                player.onGround = true;
                player.jumping = false;
                player.x += mp.speed * mp.dir;
            }
        }
    }
}

function hitQuestionBlock(x, y) {
    level[y][x] = TILE.USED_BLOCK;
    coins++;
    score += 200;
    addFloatingText('+200', x * TILE_SIZE, y * TILE_SIZE - 10);
    spawnCoinParticle(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE);
    playCoinSound();
    updateHUD();
}

function hitBrickBlock(x, y) {
    particles.push({ x: x * TILE_SIZE, y: y * TILE_SIZE, vx: -2, vy: -6, life: 30, size: TILE_SIZE / 2, color: colors.brick });
    particles.push({ x: x * TILE_SIZE + TILE_SIZE / 2, y: y * TILE_SIZE, vx: 2, vy: -6, life: 30, size: TILE_SIZE / 2, color: colors.brick });
    score += 50;
    updateHUD();
    level[y][x] = TILE.EMPTY;
    playBumpSound();
}

function addFloatingText(text, x, y) {
    floatingTexts.push({ text, x, y, life: 40, vy: -1 });
}

function spawnCoinParticle(x, y) {
    particles.push({ x, y, vx: 0, vy: -8, life: 20, size: 8, color: colors.coin, type: 'coin' });
}

function updatePlayer() {
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        player.vx -= 0.5;
        player.facing = -1;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        player.vx += 0.5;
        player.facing = 1;
    }

    player.vx *= FRICTION;
    if (Math.abs(player.vx) > MOVE_SPEED) player.vx = MOVE_SPEED * Math.sign(player.vx);
    if (Math.abs(player.vx) < 0.1) player.vx = 0;

    if ((keys[' '] || keys['Space']) && player.onGround && !player.jumping) {
        player.vy = JUMP_FORCE;
        player.jumping = true;
        player.onGround = false;
        playJumpSound();
    }

    if (!(keys[' '] || keys['Space']) && player.vy < -4) {
        player.vy = -4;
    }

    player.vy += GRAVITY;
    if (player.vy > MAX_FALL_SPEED) player.vy = MAX_FALL_SPEED;

    player.x += player.vx;
    resolveCollisions();

    player.y += player.vy;
    resolveCollisions();

    if (player.x < 0) player.x = 0;
    if (player.x > (LEVEL_WIDTH * TILE_SIZE) - player.width) player.x = (LEVEL_WIDTH * TILE_SIZE) - player.width;

    for (let y = 0; y < LEVEL_HEIGHT; y++) {
        for (let x = 0; x < LEVEL_WIDTH; x++) {
            if (level[y][x] === TILE.LAVA) {
                const lavaRect = { x: x * TILE_SIZE, y: y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE };
                if (checkCollision(player, lavaRect)) {
                    playerDie();
                    return;
                }
            }
        }
    }

    if (player.y > CANVAS_HEIGHT) {
        playerDie();
        return;
    }

    if (player.invincible > 0) player.invincible--;

    const config = getConfig();
    if (player.x >= config.flagPos * TILE_SIZE && currentWorld < 5) {
        levelComplete();
    } else if (player.x >= config.flagPos * TILE_SIZE && currentWorld === 5 && (!boss || !boss.alive)) {
        gameWin();
    }
}

function updateEnemies() {
    const config = getConfig();

    enemies.forEach(enemy => {
        if (!enemy.alive) return;
        if (enemy.x < camera.x - 200 || enemy.x > camera.x + CANVAS_WIDTH + 200) return;

        if (enemy.type === 'flying_goomba') {
            enemy.flyOffset += 0.05;
            enemy.y = enemy.baseY * TILE_SIZE + Math.sin(enemy.flyOffset) * 40;
            enemy.x += enemy.vx;
        } else {
            enemy.x += enemy.vx;

            const tileBelow = getTile(enemy.x + enemy.width / 2, enemy.y + enemy.height + 2);
            const tileAhead = getTile(enemy.x + (enemy.vx > 0 ? enemy.width : 0), enemy.y + enemy.height / 2);

            if (!isSolid(tileBelow) || isSolid(tileAhead)) {
                enemy.vx *= -1;
            }
        }

        if (player.invincible <= 0 && checkCollision(player, enemy)) {
            if (player.vy > 0 && player.y + player.height - 10 < enemy.y + enemy.height / 2) {
                if (enemy.type === 'koopa') {
                    if (enemy.hits === undefined) enemy.hits = 0;
                    enemy.hits++;
                    if (enemy.hits >= 2) {
                        enemy.alive = false;
                    } else {
                        enemy.vx *= -1;
                        player.vy = -6;
                    }
                } else {
                    enemy.alive = false;
                }
                player.vy = -8;
                score += enemy.type === 'koopa' ? 200 : 100;
                addFloatingText(`+${enemy.type === 'koopa' ? 200 : 100}`, enemy.x, enemy.y - 10);
                playStompSound();
                updateHUD();
            } else {
                playerDie();
            }
        }
    });

    if (boss && boss.alive) {
        boss.x += boss.vx;
        if (boss.x <= 76 * TILE_SIZE || boss.x >= 92 * TILE_SIZE) {
            boss.vx *= -1;
        }

        if (boss.flashTimer > 0) boss.flashTimer--;

        boss.fireTimer++;
        if (boss.fireTimer >= 180) {
            boss.fireTimer = 0;
            fireballs.push({
                x: boss.x + (boss.vx > 0 ? boss.width : 0),
                y: boss.y + boss.height / 2,
                vx: boss.vx > 0 ? 4 : -4,
                width: 12,
                height: 12,
                life: 120
            });
            playFireballSound();
        }

        if (player.invincible <= 0 && checkCollision(player, boss)) {
            if (player.vy > 0 && player.y + player.height - 10 < boss.y + boss.height / 2) {
                boss.hp--;
                boss.flashTimer = 30;
                player.vy = -10;
                score += 500;
                addFloatingText('+500', boss.x, boss.y - 20);
                playBossHitSound();
                updateHUD();

                for (let i = 0; i < 10; i++) {
                    particles.push({
                        x: boss.x + boss.width / 2,
                        y: boss.y + boss.height / 2,
                        vx: (Math.random() - 0.5) * 8,
                        vy: (Math.random() - 0.5) * 8,
                        life: 30,
                        size: 6,
                        color: colors.boss
                    });
                }

                if (boss.hp <= 0) {
                    boss.alive = false;
                    score += 2000;
                    addFloatingText('+2000', boss.x, boss.y - 40);
                    for (let i = 0; i < 20; i++) {
                        particles.push({
                            x: boss.x + boss.width / 2,
                            y: boss.y + boss.height / 2,
                            vx: (Math.random() - 0.5) * 12,
                            vy: (Math.random() - 0.5) * 12,
                            life: 60,
                            size: 8,
                            color: i % 2 === 0 ? colors.boss : colors.fireball
                        });
                    }
                }
            } else {
                playerDie();
            }
        }
    }

    fireballs = fireballs.filter(fb => {
        fb.x += fb.vx;
        fb.life--;

        if (player.invincible <= 0 && checkCollision(player, fb)) {
            playerDie();
            return false;
        }

        const tileBelow = getTile(fb.x, fb.y + fb.height);
        if (isSolid(tileBelow)) {
            for (let i = 0; i < 5; i++) {
                particles.push({
                    x: fb.x, y: fb.y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: -Math.random() * 4,
                    life: 15, size: 4, color: colors.fireball
                });
            }
            return false;
        }

        return fb.life > 0;
    });
}

function updateMovingPlatforms() {
    movingPlatforms.forEach(mp => {
        mp.x += mp.speed * mp.dir;
        if (mp.x <= mp.startX || mp.x >= mp.endX) {
            mp.dir *= -1;
        }
    });
}

function playerDie() {
    lives--;
    updateHUD();
    playDeathSound();
    if (lives <= 0) {
        gameOver();
    } else {
        player.x = 3 * TILE_SIZE;
        player.y = 10 * TILE_SIZE;
        player.vx = 0;
        player.vy = 0;
        player.invincible = 90;
        camera.x = 0;
        fireballs = [];
    }
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    clearInterval(timeInterval);
    stopMusic();
    document.getElementById('startBtn').textContent = 'START';
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('marioHighScore', highScore);
    }
    saveProgress();
    showMessage('GAME OVER', 'warning');
    gameState = 'gameover';
}

function levelComplete() {
    gameRunning = false;
    clearInterval(gameLoop);
    clearInterval(timeInterval);
    stopMusic();
    score += time * 10;
    updateHUD();
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('marioHighScore', highScore);
    }
    saveProgress();
    playPowerUpSound();

    if (currentWorld < 5) {
        worldTransition = true;
        transitionTimer = 120;
        gameState = 'transition';
    } else {
        gameWin();
    }
}

function gameWin() {
    gameRunning = false;
    clearInterval(gameLoop);
    clearInterval(timeInterval);
    stopMusic();
    score += time * 10;
    updateHUD();
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('marioHighScore', highScore);
    }
    saveProgress();
    playPowerUpSound();
    showMessage('YOU WIN!', 'success');
    gameState = 'win';
}

function updateCamera() {
    const targetX = player.x - CANVAS_WIDTH / 3;
    camera.x += (targetX - camera.x) * 0.1;
    if (camera.x < 0) camera.x = 0;
    if (camera.x > (LEVEL_WIDTH * TILE_SIZE) - CANVAS_WIDTH) camera.x = (LEVEL_WIDTH * TILE_SIZE) - CANVAS_WIDTH;
}

function updateParticles() {
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life--;
        return p.life > 0;
    });

    floatingTexts = floatingTexts.filter(ft => {
        ft.y += ft.vy;
        ft.life--;
        return ft.life > 0;
    });

    lavaAnimOffset = (lavaAnimOffset + 0.5) % 8;
}

function drawTile(x, y, type) {
    const screenX = x * TILE_SIZE - camera.x;
    const screenY = y * TILE_SIZE;
    if (screenX < -TILE_SIZE || screenX > CANVAS_WIDTH + TILE_SIZE) return;

    const config = getConfig();

    switch (type) {
        case TILE.GROUND:
            ctx.fillStyle = config.ground;
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = config.groundDark;
            ctx.fillRect(screenX, screenY, TILE_SIZE, 4);
            ctx.fillRect(screenX + 4, screenY + 8, 8, 8);
            ctx.fillRect(screenX + 20, screenY + 16, 8, 8);
            break;

        case TILE.BRICK:
            ctx.fillStyle = colors.brick;
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = colors.brickDark;
            ctx.fillRect(screenX, screenY, TILE_SIZE, 2);
            ctx.fillRect(screenX, screenY + TILE_SIZE / 2, TILE_SIZE, 2);
            ctx.fillRect(screenX + TILE_SIZE / 2, screenY, 2, TILE_SIZE / 2);
            ctx.fillRect(screenX, screenY + TILE_SIZE / 2, 2, TILE_SIZE / 2);
            ctx.fillRect(screenX + TILE_SIZE - 2, screenY + TILE_SIZE / 2, 2, TILE_SIZE / 2);
            break;

        case TILE.QUESTION:
            ctx.fillStyle = colors.question;
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = colors.questionDark;
            ctx.fillRect(screenX, screenY, TILE_SIZE, 2);
            ctx.fillRect(screenX, screenY, 2, TILE_SIZE);
            ctx.fillRect(screenX + TILE_SIZE - 2, screenY, 2, TILE_SIZE);
            ctx.fillRect(screenX, screenY + TILE_SIZE - 2, TILE_SIZE, 2);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 18px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('?', screenX + TILE_SIZE / 2, screenY + TILE_SIZE - 8);
            break;

        case TILE.USED_BLOCK:
            ctx.fillStyle = colors.usedBlock;
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#666';
            ctx.fillRect(screenX, screenY, TILE_SIZE, 2);
            ctx.fillRect(screenX, screenY, 2, TILE_SIZE);
            break;

        case TILE.PIPE_TOP_LEFT:
        case TILE.PIPE_TOP_RIGHT:
            ctx.fillStyle = colors.pipe;
            ctx.fillRect(screenX - 2, screenY, TILE_SIZE + 2, TILE_SIZE);
            ctx.fillStyle = colors.pipeDark;
            ctx.fillRect(screenX - 2, screenY, 4, TILE_SIZE);
            ctx.fillRect(screenX + TILE_SIZE - 2, screenY, 4, TILE_SIZE);
            break;

        case TILE.PIPE_BODY_LEFT:
        case TILE.PIPE_BODY_RIGHT:
            ctx.fillStyle = colors.pipe;
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = colors.pipeDark;
            ctx.fillRect(screenX, screenY, 4, TILE_SIZE);
            ctx.fillRect(screenX + TILE_SIZE - 4, screenY, 4, TILE_SIZE);
            break;

        case TILE.HARD_BLOCK:
            ctx.fillStyle = '#888';
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#aaa';
            ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            ctx.fillStyle = '#666';
            ctx.fillRect(screenX, screenY, TILE_SIZE, 2);
            ctx.fillRect(screenX, screenY, 2, TILE_SIZE);
            break;

        case TILE.LAVA:
            const lavaOffset = Math.sin(lavaAnimOffset + x * 0.5) * 3;
            ctx.fillStyle = colors.lava;
            ctx.fillRect(screenX, screenY + lavaOffset, TILE_SIZE, TILE_SIZE - lavaOffset);
            ctx.fillStyle = colors.lavaDark;
            ctx.fillRect(screenX + 2, screenY + lavaOffset + 4, TILE_SIZE - 4, TILE_SIZE - lavaOffset - 4);
            ctx.fillStyle = '#ff8c00';
            ctx.fillRect(screenX + 4, screenY + lavaOffset, TILE_SIZE - 8, 4);
            break;

        case TILE.CLOUD:
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = 'rgba(200, 200, 255, 0.5)';
            ctx.fillRect(screenX + 4, screenY + 4, TILE_SIZE - 8, TILE_SIZE - 8);
            break;

        case TILE.CASTLE_BLOCK:
            ctx.fillStyle = '#4a4a4a';
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#5a5a5a';
            ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            ctx.fillStyle = '#3a3a3a';
            ctx.fillRect(screenX, screenY, TILE_SIZE, 2);
            ctx.fillRect(screenX, screenY, 2, TILE_SIZE);
            break;
    }
}

function drawPlayer() {
    if (player.invincible > 0 && Math.floor(player.invincible / 4) % 2 === 0) return;

    const screenX = player.x - camera.x;
    const screenY = player.y;

    ctx.fillStyle = colors.mario;
    ctx.fillRect(screenX + 4, screenY, 20, 8);
    ctx.fillRect(screenX + 2, screenY + 4, 24, 8);

    ctx.fillStyle = colors.marioSkin;
    ctx.fillRect(screenX + 6, screenY + 8, 16, 8);
    ctx.fillRect(screenX + (player.facing > 0 ? 18 : 2), screenY + 10, 6, 4);

    ctx.fillStyle = colors.mario;
    ctx.fillRect(screenX + 4, screenY + 16, 20, 8);

    ctx.fillStyle = '#0000a8';
    ctx.fillRect(screenX + 6, screenY + 20, 16, 4);
    ctx.fillRect(screenX + 4, screenY + 24, 8, 8);
    ctx.fillRect(screenX + 16, screenY + 24, 8, 8);

    ctx.fillStyle = '#8b4513';
    ctx.fillRect(screenX + 2, screenY + 28, 10, 4);
    ctx.fillRect(screenX + 16, screenY + 28, 10, 4);
}

function drawEnemy(enemy) {
    if (!enemy.alive) return;
    const screenX = enemy.x - camera.x;
    const screenY = enemy.y;
    if (screenX < -TILE_SIZE || screenX > CANVAS_WIDTH + TILE_SIZE) return;

    if (enemy.type === 'koopa') {
        ctx.fillStyle = colors.koopa;
        ctx.fillRect(screenX + 6, screenY + 4, 20, 24);
        ctx.fillRect(screenX + 4, screenY + 8, 24, 16);

        ctx.fillStyle = '#fff';
        ctx.fillRect(screenX + 10, screenY + 10, 6, 6);

        ctx.fillStyle = '#000';
        ctx.fillRect(screenX + 12, screenY + 12, 4, 4);

        ctx.fillStyle = colors.koopaDark;
        ctx.fillRect(screenX + 6, screenY + 24, 8, 8);
        ctx.fillRect(screenX + 18, screenY + 24, 8, 8);

        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(screenX + 8, screenY + 6, 16, 4);
    } else if (enemy.type === 'flying_goomba') {
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(screenX + 4, screenY + 6, 24, 18);
        ctx.fillRect(screenX + 2, screenY + 10, 28, 10);

        ctx.fillStyle = '#fff';
        ctx.fillRect(screenX + 8, screenY + 12, 6, 6);
        ctx.fillRect(screenX + 18, screenY + 12, 6, 6);

        ctx.fillStyle = '#000';
        ctx.fillRect(screenX + 10, screenY + 14, 4, 4);
        ctx.fillRect(screenX + 20, screenY + 14, 4, 4);

        ctx.fillStyle = '#666';
        ctx.fillRect(screenX - 4, screenY + 2, 10, 6);
        ctx.fillRect(screenX + 26, screenY + 2, 10, 6);

        ctx.fillStyle = '#8b4513';
        ctx.fillRect(screenX + 4, screenY + 24, 10, 8);
        ctx.fillRect(screenX + 18, screenY + 24, 10, 8);
    } else {
        ctx.fillStyle = colors.goomba;
        ctx.fillRect(screenX + 4, screenY + 4, 24, 20);
        ctx.fillRect(screenX + 2, screenY + 8, 28, 12);

        ctx.fillStyle = '#fff';
        ctx.fillRect(screenX + 8, screenY + 10, 6, 6);
        ctx.fillRect(screenX + 18, screenY + 10, 6, 6);

        ctx.fillStyle = '#000';
        ctx.fillRect(screenX + 10, screenY + 12, 4, 4);
        ctx.fillRect(screenX + 20, screenY + 12, 4, 4);

        ctx.fillStyle = colors.goombaDark;
        ctx.fillRect(screenX + 4, screenY + 24, 10, 8);
        ctx.fillRect(screenX + 18, screenY + 24, 10, 8);

        ctx.fillStyle = '#000';
        ctx.fillRect(screenX + 10, screenY + 6, 4, 2);
        ctx.fillRect(screenX + 18, screenY + 6, 4, 2);
    }
}

function drawBoss() {
    if (!boss || !boss.alive) return;
    const screenX = boss.x - camera.x;
    const screenY = boss.y;

    if (boss.flashTimer > 0 && Math.floor(boss.flashTimer / 3) % 2 === 0) {
        ctx.fillStyle = '#fff';
    } else {
        ctx.fillStyle = colors.boss;
    }

    ctx.fillRect(screenX + 8, screenY + 8, 48, 48);
    ctx.fillRect(screenX + 4, screenY + 16, 56, 32);

    ctx.fillStyle = colors.bossDark;
    ctx.fillRect(screenX + 12, screenY + 4, 40, 12);

    ctx.fillStyle = '#fff';
    ctx.fillRect(screenX + 16, screenY + 20, 12, 12);
    ctx.fillRect(screenX + 36, screenY + 20, 12, 12);

    ctx.fillStyle = '#ff0000';
    ctx.fillRect(screenX + 20, screenY + 24, 8, 8);
    ctx.fillRect(screenX + 40, screenY + 24, 8, 8);

    ctx.fillStyle = '#000';
    ctx.fillRect(screenX + 20, screenY + 40, 24, 8);
    ctx.fillStyle = '#fff';
    ctx.fillRect(screenX + 24, screenY + 40, 4, 4);
    ctx.fillRect(screenX + 32, screenY + 40, 4, 4);
    ctx.fillRect(screenX + 40, screenY + 40, 4, 4);

    ctx.fillStyle = colors.bossDark;
    ctx.fillRect(screenX + 8, screenY + 52, 16, 12);
    ctx.fillRect(screenX + 40, screenY + 52, 16, 12);

    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(screenX + 16, screenY, 8, 8);
    ctx.fillRect(screenX + 40, screenY, 8, 8);

    const barWidth = 60;
    const barHeight = 8;
    const barX = screenX + (boss.width - barWidth) / 2;
    const barY = screenY - 16;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = colors.bossHealth;
    ctx.fillRect(barX, barY, barWidth * (boss.hp / boss.maxHp), barHeight);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}

function drawFireballs() {
    fireballs.forEach(fb => {
        const screenX = fb.x - camera.x;
        ctx.fillStyle = colors.fireball;
        ctx.beginPath();
        ctx.arc(screenX + fb.width / 2, fb.y + fb.height / 2, fb.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(screenX + fb.width / 2, fb.y + fb.height / 2, fb.width / 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawMovingPlatforms() {
    movingPlatforms.forEach(mp => {
        const screenX = mp.x - camera.x;
        ctx.fillStyle = '#888';
        ctx.fillRect(screenX, mp.y, mp.width, mp.height);
        ctx.fillStyle = '#aaa';
        ctx.fillRect(screenX + 2, mp.y + 2, mp.width - 4, mp.height - 4);
        ctx.fillStyle = '#666';
        ctx.fillRect(screenX, mp.y, mp.width, 2);
        ctx.fillRect(screenX, mp.y + mp.height - 2, mp.width, 2);
    });
}

function drawBackground() {
    const config = getConfig();
    ctx.fillStyle = config.sky;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (currentWorld === 1 || currentWorld === 3) {
        drawCloud(100, 60);
        drawCloud(350, 40);
        drawCloud(600, 70);
        drawCloud(900, 50);
        drawCloud(1200, 65);
        drawCloud(1500, 45);
        drawCloud(1800, 55);
        drawCloud(2100, 60);
        drawCloud(2400, 50);
        drawCloud(2700, 70);
    }

    if (currentWorld === 1 || currentWorld === 3) {
        drawHill(150, 13 * TILE_SIZE, 120);
        drawHill(500, 13 * TILE_SIZE, 80);
        drawHill(900, 13 * TILE_SIZE, 150);
        drawHill(1400, 13 * TILE_SIZE, 100);
        drawHill(1900, 13 * TILE_SIZE, 130);
        drawHill(2400, 13 * TILE_SIZE, 90);
        drawHill(2800, 13 * TILE_SIZE, 110);

        drawBush(200, 13 * TILE_SIZE - 16);
        drawBush(550, 13 * TILE_SIZE - 12);
        drawBush(1000, 13 * TILE_SIZE - 20);
        drawBush(1500, 13 * TILE_SIZE - 16);
        drawBush(2000, 13 * TILE_SIZE - 14);
        drawBush(2500, 13 * TILE_SIZE - 18);
    }

    if (currentWorld === 5) {
        for (let i = 0; i < 8; i++) {
            const px = i * 120 - (camera.x * 0.2) % 120;
            ctx.fillStyle = 'rgba(255, 69, 0, 0.1)';
            ctx.fillRect(px, 0, 60, CANVAS_HEIGHT);
        }
    }
}

function drawCloud(x, y) {
    const screenX = x - camera.x * 0.3;
    if (screenX < -100 || screenX > CANVAS_WIDTH + 100) return;
    ctx.fillStyle = getConfig().cloud;
    ctx.fillRect(screenX, y, 60, 20);
    ctx.fillRect(screenX + 10, y - 10, 40, 10);
    ctx.fillRect(screenX - 10, y + 5, 80, 15);
}

function drawHill(x, y, size) {
    const screenX = x - camera.x * 0.5;
    if (screenX < -200 || screenX > CANVAS_WIDTH + 200) return;
    const config = getConfig();
    ctx.fillStyle = config.hill;
    ctx.beginPath();
    ctx.moveTo(screenX, y);
    ctx.lineTo(screenX + size / 2, y - size);
    ctx.lineTo(screenX + size, y);
    ctx.fill();
    ctx.fillStyle = config.hillDark;
    ctx.beginPath();
    ctx.moveTo(screenX + size * 0.3, y);
    ctx.lineTo(screenX + size / 2, y - size + 10);
    ctx.lineTo(screenX + size * 0.7, y);
    ctx.fill();
}

function drawBush(x, y) {
    const screenX = x - camera.x * 0.6;
    if (screenX < -100 || screenX > CANVAS_WIDTH + 100) return;
    ctx.fillStyle = getConfig().bush;
    ctx.fillRect(screenX, y, 50, 16);
    ctx.fillRect(screenX + 10, y - 8, 30, 8);
    ctx.fillRect(screenX - 5, y + 4, 60, 12);
}

function drawParticles() {
    particles.forEach(p => {
        const screenX = p.x - camera.x;
        ctx.fillStyle = p.color;
        if (p.type === 'coin') {
            ctx.fillRect(screenX - 4, p.y, 8, 8);
            ctx.fillStyle = colors.coinDark;
            ctx.fillRect(screenX - 2, p.y + 2, 4, 4);
        } else {
            ctx.fillRect(screenX, p.y, p.size, p.size);
        }
    });

    ctx.fillStyle = '#fff';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    floatingTexts.forEach(ft => {
        const screenX = ft.x - camera.x;
        ctx.fillText(ft.text, screenX, ft.y);
    });
}

function drawMenu() {
    ctx.fillStyle = '#6b8cff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = colors.mario;
    ctx.font = '36px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SUPER MARIO', CANVAS_WIDTH / 2, 120);

    ctx.fillStyle = colors.question;
    ctx.font = '24px "Press Start 2P", monospace';
    ctx.fillText('RETRO EDITION', CANVAS_WIDTH / 2, 160);

    ctx.fillStyle = '#fff';
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillText('Press ENTER to Start', CANVAS_WIDTH / 2, 240);

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#ccc';
    ctx.fillText('Arrow Keys / WASD = Move', CANVAS_WIDTH / 2, 290);
    ctx.fillText('SPACE = Jump', CANVAS_WIDTH / 2, 310);
    ctx.fillText('CTRL+S = Save  |  R = Reset', CANVAS_WIDTH / 2, 330);
    ctx.fillText('M = Toggle Music', CANVAS_WIDTH / 2, 350);

    ctx.fillStyle = colors.coin;
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText('5 WORLDS TO CONQUER!', CANVAS_WIDTH / 2, 390);

    if (highScore > 0) {
        ctx.fillStyle = colors.coin;
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillText(`HIGH SCORE: ${highScore}`, CANVAS_WIDTH / 2, 420);
    }

    if (unlockedWorld > 1) {
        ctx.fillStyle = '#43b047';
        ctx.fillText(`UNLOCKED: WORLD 1-${unlockedWorld}`, CANVAS_WIDTH / 2, 445);
    }

    ctx.fillStyle = musicEnabled ? colors.coin : '#666';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText(`MUSIC: ${musicEnabled ? 'ON' : 'OFF'} (M to toggle)`, CANVAS_WIDTH / 2, 470);
}

function drawGameOver() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = colors.mario;
    ctx.font = '36px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, 180);

    ctx.fillStyle = '#fff';
    ctx.font = '18px "Press Start 2P", monospace';
    ctx.fillText(`SCORE: ${score}`, CANVAS_WIDTH / 2, 230);
    ctx.fillText(`WORLD: 1-${currentWorld}`, CANVAS_WIDTH / 2, 260);

    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillText('Press ENTER to Restart', CANVAS_WIDTH / 2, 310);

    ctx.fillStyle = musicEnabled ? colors.coin : '#666';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText(`MUSIC: ${musicEnabled ? 'ON' : 'OFF'} (M to toggle)`, CANVAS_WIDTH / 2, 360);
}

function drawTransition() {
    const alpha = Math.min(1, (120 - transitionTimer) / 30);
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (transitionTimer < 90) {
        ctx.fillStyle = colors.question;
        ctx.font = '28px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('WORLD 1-' + (currentWorld + 1), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

        ctx.fillStyle = '#fff';
        ctx.font = '14px "Press Start 2P", monospace';
        ctx.fillText(getConfig().name, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    }
}

function drawWin() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = colors.question;
    ctx.font = '32px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('YOU WIN!', CANVAS_WIDTH / 2, 130);

    ctx.fillStyle = '#fff';
    ctx.font = '18px "Press Start 2P", monospace';
    ctx.fillText(`FINAL SCORE: ${score}`, CANVAS_WIDTH / 2, 190);
    ctx.fillText(`COINS: ${coins}`, CANVAS_WIDTH / 2, 220);
    ctx.fillText(`TIME BONUS: +${time * 10}`, CANVAS_WIDTH / 2, 250);

    ctx.fillStyle = colors.coin;
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillText('CONGRATULATIONS!', CANVAS_WIDTH / 2, 300);

    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText('Press ENTER to Play Again', CANVAS_WIDTH / 2, 340);

    ctx.fillStyle = musicEnabled ? colors.coin : '#666';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText(`MUSIC: ${musicEnabled ? 'ON' : 'OFF'} (M to toggle)`, CANVAS_WIDTH / 2, 380);
}

function draw() {
    if (gameState === 'menu') {
        drawMenu();
        return;
    }
    if (gameState === 'gameover') {
        drawGameOver();
        return;
    }
    if (gameState === 'win') {
        drawWin();
        return;
    }
    if (gameState === 'transition') {
        drawGameScene();
        drawTransition();
        return;
    }

    drawGameScene();
}

function drawGameScene() {
    drawBackground();

    const startTile = Math.floor(camera.x / TILE_SIZE);
    const endTile = startTile + Math.ceil(CANVAS_WIDTH / TILE_SIZE) + 1;

    for (let y = 0; y < LEVEL_HEIGHT; y++) {
        for (let x = startTile; x <= endTile && x < LEVEL_WIDTH; x++) {
            if (level[y][x] !== TILE.EMPTY) {
                drawTile(x, y, level[y][x]);
            }
        }
    }

    drawMovingPlatforms();
    enemies.forEach(drawEnemy);
    drawBoss();
    drawFireballs();
    drawPlayer();
    drawParticles();
}

function update() {
    if (gameState === 'transition') {
        transitionTimer--;
        if (transitionTimer <= 0) {
            worldTransition = false;
            advanceToWorld(currentWorld + 1);
            gameState = 'playing';
            gameRunning = true;
            document.getElementById('startBtn').textContent = 'PAUSE';
            gameLoop = setInterval(update, 1000 / 60);
            timeInterval = setInterval(() => {
                if (gameRunning && gameState === 'playing') {
                    time--;
                    updateHUD();
                    if (time <= 0) playerDie();
                }
            }, 1000);
            if (musicEnabled) startMusic();
        }
        return;
    }

    updatePlayer();
    updateEnemies();
    updateMovingPlatforms();
    updateCamera();
    updateParticles();
    draw();
}

function startGame() {
    initAudio();
    if (gameState === 'menu' || gameState === 'gameover' || gameState === 'win') {
        if (gameState === 'gameover' || gameState === 'win') {
            currentWorld = 1;
            lives = 3;
            score = 0;
            coins = 0;
        }
        resetGame();
        gameState = 'playing';
        gameRunning = true;
        document.getElementById('startBtn').textContent = 'PAUSE';
        gameLoop = setInterval(update, 1000 / 60);
        timeInterval = setInterval(() => {
            if (gameRunning && gameState === 'playing') {
                time--;
                updateHUD();
                if (time <= 0) playerDie();
            }
        }, 1000);
        if (musicEnabled) startMusic();
    } else if (gameRunning) {
        gameRunning = false;
        clearInterval(gameLoop);
        clearInterval(timeInterval);
        stopMusic();
        document.getElementById('startBtn').textContent = 'RESUME';
        showMessage('PAUSED', 'info');
    } else {
        gameRunning = true;
        document.getElementById('startBtn').textContent = 'PAUSE';
        gameLoop = setInterval(update, 1000 / 60);
        timeInterval = setInterval(() => {
            if (gameRunning && gameState === 'playing') {
                time--;
                updateHUD();
                if (time <= 0) playerDie();
            }
        }, 1000);
        if (musicEnabled) startMusic();
    }
}

const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === 'Enter') {
        e.preventDefault();
        startGame();
        return;
    }

    if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveProgress();
        return;
    }

    if (e.key.toLowerCase() === 'r') {
        if (confirm('Reset all progress?')) {
            resetProgress();
        }
        return;
    }

    if (e.key.toLowerCase() === 'm') {
        const enabled = toggleMusic();
        showMessage(enabled ? 'Music ON' : 'Music OFF', 'info');
        return;
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('musicBtn').addEventListener('click', () => {
    const enabled = toggleMusic();
    document.getElementById('musicBtn').textContent = `MUSIC: ${enabled ? 'ON' : 'OFF'}`;
    showMessage(enabled ? 'Music ON' : 'Music OFF', 'info');
});
document.getElementById('saveBtn').addEventListener('click', saveProgress);
document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Reset all progress?')) resetProgress();
});

loadProgress();
generateWorld(currentWorld);
initPlayer();
draw();
