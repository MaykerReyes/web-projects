# Building "MathQuest": A Brilliant-Inspired Offline Learning App

This guide provides the complete blueprint for building a beautiful, gamified, and fully offline web application. Because you want this to run completely offline without requiring a local web server, we have to carefully architect how the data is loaded to avoid browser CORS (Cross-Origin Resource Sharing) errors that occur when trying to fetch `.txt` files directly from a local `file://` directory.

## 1. Project Architecture

To keep this strictly offline and installation-free, you will use three core web technologies and a specific strategy for your data:

* **`index.html`**: The structure of the app.
* **`style.css`**: The visual design (recreating the Brilliant.org aesthetic).
* **`app.js`**: The logic for rendering questions, checking answers, and saving progress.
* **`data.js`** (Instead of a `.txt`): *Crucial workaround.* Browsers block local HTML files from reading local `.txt` files for security reasons. By saving your tons of exercises as a JavaScript object in a `.js` file, the HTML can load it seamlessly without needing a server. 

## 2. File Structure

Create a folder on your desktop called `MathQuest` and create these four files inside it:

MathQuest/
│
├── index.html
├── style.css
├── app.js
└── data.js

## 3. The Data Structure (`data.js`)

Structuring the data cleanly will make it much easier to scale as she progresses through 5th-grade math (fractions, decimals, basic geometry, and early algebra). 

Open `data.js` and add your exercises like this:

// data.js
const mathExercises = [
    {
        id: 1,
        topic: "Fractions",
        question: "What is 1/4 + 2/4?",
        options: ["1/8", "3/4", "3/8", "1/2"],
        correctAnswer: "3/4",
        explanation: "When adding fractions with the same bottom number (denominator), you just add the top numbers (numerators): 1 + 2 = 3. So, it's 3/4."
    },
    {
        id: 2,
        topic: "Decimals",
        question: "If you have $5.50 and you buy a notebook for $2.25, how much money do you have left?",
        options: ["$3.25", "$3.50", "$2.75", "$3.00"],
        correctAnswer: "$3.25",
        explanation: "Line up the decimals and subtract: 5.50 - 2.25 = 3.25."
    },
    {
        id: 3,
        topic: "Order of Operations",
        question: "Solve: 3 + 4 x 2",
        options: ["14", "11", "24", "10"],
        correctAnswer: "11",
        explanation: "Remember PEMDAS! Multiplication comes before addition. First, 4 x 2 = 8. Then, 3 + 8 = 11."
    }
];

## 4. The HTML Structure (`index.html`)

This sets up a clean, modern UI container. We link all our scripts and stylesheets here.

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MathQuest</title>
    <link rel="stylesheet" href="style.css">
    <!-- Google Fonts for that clean, Brilliant.org look -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
</head>
<body>
    <div class="app-container">
        <!-- Header: Stats and Progress -->
        <header>
            <div class="stats">
                <div class="stat-pill">⭐ XP: <span id="xp-counter">0</span></div>
                <div class="stat-pill">🔥 Streak: <span id="streak-counter">0</span></div>
            </div>
            <div class="progress-container">
                <div class="progress-bar" id="progress-bar"></div>
            </div>
        </header>

        <!-- Main Content: The Question Card -->
        <main>
            <div class="card" id="question-card">
                <div class="topic-label" id="topic-label">Topic</div>
                <h2 class="question-text" id="question-text">Loading question...</h2>
                
                <div class="options-grid" id="options-grid">
                    <!-- Buttons will be injected here by app.js -->
                </div>

                <div class="feedback-box hidden" id="feedback-box">
                    <h3 id="feedback-title">Correct!</h3>
                    <p id="feedback-text">Explanation goes here.</p>
                    <button class="primary-btn" id="next-btn">Next Challenge ➔</button>
                </div>
            </div>
        </main>
    </div>

    <!-- Load data first, then logic -->
    <script src="data.js"></script>
    <script src="app.js"></script>
</body>
</html>

## 5. The CSS: Recreating the "Brilliant" Aesthetic (`style.css`)

Brilliant.org is known for its excellent use of whitespace, subtle shadows, rounded typography, and a calming but engaging color palette. 

:root {
    --bg-color: #f7f9fa;
    --card-bg: #ffffff;
    --text-main: #1a1a1a;
    --text-muted: #5e6d77;
    --primary: #007aff; /* Brilliant Blue */
    --primary-hover: #0062cc;
    --correct: #00c985; /* Vibrant Green */
    --incorrect: #ff4f4f;
    --pill-bg: #eef2f5;
    --font-main: 'Inter', sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    font-family: var(--font-main);
    background-color: var(--bg-color);
    color: var(--text-main);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.app-container {
    width: 100%;
    max-width: 600px;
    padding: 20px;
}

/* Header & Progress */
header { margin-bottom: 30px; }

.stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-weight: 600;
}

.stat-pill {
    background-color: var(--pill-bg);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    color: var(--text-muted);
}

.progress-container {
    width: 100%;
    height: 8px;
    background-color: var(--pill-bg);
    border-radius: 10px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    width: 0%;
    background-color: var(--correct);
    transition: width 0.4s ease;
}

/* Question Card */
.card {
    background-color: var(--card-bg);
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.topic-label {
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1px;
    font-weight: 800;
    color: var(--primary);
    margin-bottom: 15px;
}

.question-text {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 30px;
}

/* Options Grid */
.options-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.option-btn {
    background-color: #fff;
    border: 2px solid var(--pill-bg);
    border-radius: 12px;
    padding: 16px 20px;
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-main);
    color: var(--text-main);
}

.option-btn:hover {
    border-color: var(--primary);
    background-color: #f0f7ff;
}

.option-btn.correct {
    background-color: var(--correct);
    border-color: var(--correct);
    color: white;
}

.option-btn.wrong {
    background-color: var(--incorrect);
    border-color: var(--incorrect);
    color: white;
}

/* Feedback Section */
.feedback-box {
    margin-top: 30px;
    padding: 20px;
    border-radius: 16px;
    background-color: var(--pill-bg);
    animation: fadeIn 0.4s ease;
}

.feedback-box.correct-theme { background-color: #e5f9f1; color: #008a5b; }
.feedback-box.wrong-theme { background-color: #ffebeb; color: #cc0000; }

.feedback-box h3 { margin-bottom: 8px; font-size: 18px; }
.feedback-box p { font-size: 14px; line-height: 1.5; margin-bottom: 20px; }

.primary-btn {
    width: 100%;
    background-color: var(--primary);
    color: white;
    border: none;
    padding: 16px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.primary-btn:hover { background-color: var(--primary-hover); }
.hidden { display: none; }

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

## 6. The JavaScript Logic (`app.js`)

This handles state management, interactions, and saving data locally. We will use the browser's `localStorage` so that when the browser is closed and reopened, her XP and current question index are preserved.

// State variables
let currentQuestionIndex = 0;
let xp = 0;
let streak = 0;

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
const progressBar = document.getElementById('progress-bar');

// Initialize App
function initApp() {
    // Load saved progress from localStorage
    const savedData = JSON.parse(localStorage.getItem('mathQuestProgress'));
    if (savedData) {
        currentQuestionIndex = savedData.currentIndex;
        xp = savedData.xp;
        streak = savedData.streak;
    }
    
    updateStats();
    loadQuestion();
}

function saveProgress() {
    const progress = {
        currentIndex: currentQuestionIndex,
        xp: xp,
        streak: streak
    };
    localStorage.setItem('mathQuestProgress', JSON.stringify(progress));
}

function loadQuestion() {
    // Check if finished
    if (currentQuestionIndex >= mathExercises.length) {
        questionText.innerText = "Amazing job! You finished all exercises!";
        topicLabel.innerText = "COMPLETED";
        optionsGrid.innerHTML = "";
        return;
    }

    const currentQ = mathExercises[currentQuestionIndex];
    questionText.innerText = currentQ.question;
    topicLabel.innerText = currentQ.topic;
    
    // Update progress bar
    const progressPercent = (currentQuestionIndex / mathExercises.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Clear previous options & feedback
    optionsGrid.innerHTML = '';
    feedbackBox.className = 'feedback-box hidden';

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

    if (selectedOption === questionData.correctAnswer) {
        selectedBtn.classList.add('correct');
        feedbackBox.classList.add('correct-theme');
        feedbackBox.classList.remove('wrong-theme');
        feedbackTitle.innerText = "🌟 Brilliant!";
        
        // Gamification logic
        xp += 50 + (streak * 10); // Bonus XP for streaks
        streak++;
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
        
        streak = 0; // Reset streak
    }

    feedbackText.innerText = questionData.explanation;
    updateStats();
    saveProgress();
}

function updateStats() {
    xpCounter.innerText = xp;
    streakCounter.innerText = streak;
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    saveProgress();
    loadQuestion();
});

// Start the app
initApp();

## 7. How to Use & Expand

1. **To run the app:** Simply double-click the `index.html` file. It will open in Chrome, Firefox, or Safari and run entirely offline.
2. **Adding more exercises:** You don't need to touch the HTML or CSS. Just open `data.js` in a text editor and copy/paste more JSON objects into the `mathExercises` array. 
3. **Resetting progress:** Because the app saves progress locally in the browser, if you ever want to reset it so your daughter can start over, simply open your browser's Developer Tools (F12), go to the "Application" tab -> "Local Storage", and delete the `mathQuestProgress` key.