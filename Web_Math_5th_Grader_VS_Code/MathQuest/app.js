// State variables
let currentQuestionIndex = 0;
let xp = 0;
let streak = 0;
let correctAnswers = 0;
let achievements = [];
let randomizedExercises = [];

// Achievement definitions
const achievementsList = [
    { id: 'first5', name: '🎯 Getting Started', condition: (c) => c === 5, description: '5 correct answers' },
    { id: 'ten', name: '🌟 On Fire', condition: (c) => c === 10, description: '10 correct answers' },
    { id: 'twentyfive', name: '💎 Math Star', condition: (c) => c === 25, description: '25 correct answers' },
    { id: 'fifty', name: '👑 Math Champion', condition: (c) => c === 50, description: '50 correct answers' },
    { id: 'hundred', name: '🏆 Math Legend', condition: (c) => c === 100, description: '100 correct answers' },
    { id: 'streak5', name: '🔥 Hot Streak', condition: (s) => s === 5, description: '5 in a row!' },
    { id: 'streak10', name: '⚡ Unstoppable', condition: (s) => s === 10, description: '10 in a row!' },
];

// DOM Elements
const questionText = document.getElementById('question-text');
const topicLabel = document.getElementById('topic-label');
const optionsGrid = document.getElementById('options-grid');
const feedbackBox = document.getElementById('feedback-box');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');
const xpCounter = document.getElementById('xp-counter');
const streakCounter = document.getElementById('streak-counter');
const correctCounter = document.getElementById('correct-counter');
const progressBar = document.getElementById('progress-bar');
const achievementsContainer = document.getElementById('achievements-container');
const questionCounter = document.getElementById('question-counter');
const xpGainDisplay = document.getElementById('xp-gain');

// Initialize App
function initApp() {
    // Load saved progress from localStorage
    const savedData = JSON.parse(localStorage.getItem('mathQuestProgress'));
    if (savedData) {
        currentQuestionIndex = savedData.currentIndex;
        xp = savedData.xp;
        streak = savedData.streak;
        correctAnswers = savedData.correctAnswers || 0;
        achievements = savedData.achievements || [];
    }
    
    // Shuffle and prepare questions
    randomizedExercises = shuffleArray([...mathExercises]);
    
    updateStats();
    loadQuestion();
}

function shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function saveProgress() {
    const progress = {
        currentIndex: currentQuestionIndex,
        xp: xp,
        streak: streak,
        correctAnswers: correctAnswers,
        achievements: achievements
    };
    localStorage.setItem('mathQuestProgress', JSON.stringify(progress));
}

function loadQuestion() {
    // Check if finished all questions
    if (currentQuestionIndex >= randomizedExercises.length) {
        questionText.innerText = "🎉 Amazing job! You finished all 105 math challenges!";
        topicLabel.innerText = "COMPLETED";
        optionsGrid.innerHTML = "";
        questionCounter.innerText = "";
        
        // Show restart button
        feedbackBox.classList.remove('hidden');
        feedbackBox.className = 'feedback-box correct-theme';
        feedbackTitle.innerText = "🏆 You're a Math Legend!";
        feedbackText.innerText = `Total XP earned: ${xp} ⭐\nFinal Streak: ${streak} 🔥\nCorrect Answers: ${correctAnswers} ✓`;
        xpGainDisplay.innerHTML = '';
        nextBtn.innerText = "Play Again ↻";
        nextBtn.onclick = resetApp;
        return;
    }

    const currentQ = randomizedExercises[currentQuestionIndex];
    questionText.innerText = currentQ.question;
    topicLabel.innerText = currentQ.topic;
    
    // Update progress bar
    const progressPercent = (currentQuestionIndex / randomizedExercises.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Update question counter
    questionCounter.innerText = `Question ${currentQuestionIndex + 1} of ${randomizedExercises.length}`;

    // Clear previous options & feedback
    optionsGrid.innerHTML = '';
    feedbackBox.className = 'feedback-box hidden';

    // Reset the next button
    nextBtn.innerText = "Next Challenge ➔";
    nextBtn.onclick = () => {
        currentQuestionIndex++;
        saveProgress();
        loadQuestion();
    };

    // Create buttons for options
    currentQ.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = option;
        btn.onclick = () => checkAnswer(option, btn, currentQ);
        optionsGrid.appendChild(btn);
    });
}

function checkAnswer(selectedOption, selectedBtn, questionData) {
    // Disable all buttons after selection
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(btn => btn.disabled = true);

    feedbackBox.classList.remove('hidden');

    let xpGain = 0;
    
    if (selectedOption === questionData.correctAnswer) {
        selectedBtn.classList.add('correct');
        feedbackBox.classList.add('correct-theme');
        feedbackBox.classList.remove('wrong-theme');
        feedbackTitle.innerText = "🌟 Brilliant!";
        
        // Gamification logic with streak bonuses
        const baseXP = 50;
        const streakBonus = Math.min(streak * 10, 100); // Cap at 100 bonus
        xpGain = baseXP + streakBonus;
        
        xp += xpGain;
        streak++;
        correctAnswers++;
        
        // Check for streak achievements
        checkAchievements('streak');
    } else {
        selectedBtn.classList.add('wrong');
        feedbackBox.classList.add('wrong-theme');
        feedbackBox.classList.remove('correct-theme');
        feedbackTitle.innerText = "Not quite, but let's learn!";
        
        // Find and highlight correct answer
        allBtns.forEach(btn => {
            if (btn.innerText === questionData.correctAnswer) {
                btn.classList.add('correct');
            }
        });
        
        xp += 10; // Participation XP
        xpGain = 10;
        streak = 0; // Reset streak
    }

    feedbackText.innerText = questionData.explanation;
    
    // Show XP gain
    xpGainDisplay.innerHTML = `<div style="text-align: center; color: #e85b8a; font-weight: 700; margin-top: 10px;">+${xpGain} XP 🌟</div>`;
    
    // Check for correct answer achievements
    checkAchievements('correct');
    
    updateStats();
    saveProgress();
}

function checkAchievements(type) {
    achievementsList.forEach(ach => {
        if (achievements.includes(ach.id)) return; // Already unlocked
        
        let isUnlocked = false;
        if (type === 'correct' && (ach.id.includes('first') || ach.id.includes('ten') || ach.id.includes('twenty') || ach.id.includes('fifty') || ach.id.includes('hundred'))) {
            isUnlocked = ach.condition(correctAnswers);
        } else if (type === 'streak' && ach.id.includes('streak')) {
            isUnlocked = ach.condition(streak);
        }
        
        if (isUnlocked) {
            achievements.push(ach.id);
            displayAchievementPopup(ach);
        }
    });
}

function displayAchievementPopup(achievement) {
    const popup = document.createElement('div');
    popup.className = 'achievement-badge';
    popup.innerHTML = `${achievement.name} - ${achievement.description}`;
    popup.style.animation = 'fadeIn 0.4s ease';
    achievementsContainer.appendChild(popup);
    
    // Remove after 4 seconds
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.3s';
        setTimeout(() => popup.remove(), 300);
    }, 4000);
}

function updateStats() {
    xpCounter.innerText = xp;
    streakCounter.innerText = streak;
    correctCounter.innerText = correctAnswers;
}

function resetApp() {
    currentQuestionIndex = 0;
    xp = 0;
    streak = 0;
    correctAnswers = 0;
    achievements = [];
    saveProgress();
    randomizedExercises = shuffleArray([...mathExercises]);
    updateStats();
    loadQuestion();
}

// Start the app
initApp();
