(function () {
  "use strict";

  const STORAGE_KEY = "studyQuestProgress:v1";
  const LEGACY_STORAGE_KEY = "mathQuestProgress:v2";
  const SUBJECT_ALL = "All Subjects";
  const rawExercises = Array.isArray(window.mathExercises) ? window.mathExercises : [];
  const exercises = rawExercises.map((exercise) => ({
    subject: "Math",
    ...exercise
  }));
  const config = window.mathQuestConfig || {};
  const topicQuestSizes = config.topicQuestSizes || {};
  const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]));

  const elements = {
    questionText: document.getElementById("question-text"),
    topicLabel: document.getElementById("topic-label"),
    stepLabel: document.getElementById("step-label"),
    optionsGrid: document.getElementById("options-grid"),
    feedbackBox: document.getElementById("feedback-box"),
    feedbackTitle: document.getElementById("feedback-title"),
    feedbackText: document.getElementById("feedback-text"),
    nextBtn: document.getElementById("next-btn"),
    xpCounter: document.getElementById("xp-counter"),
    streakCounter: document.getElementById("streak-counter"),
    levelCounter: document.getElementById("level-counter"),
    progressBar: document.getElementById("progress-bar"),
    progressStrip: document.getElementById("progress-strip"),
    progressLabel: document.getElementById("progress-label"),
    masteryLabel: document.getElementById("mastery-label"),
    subjectList: document.getElementById("subject-list"),
    topicList: document.getElementById("topic-list"),
    newSetBtn: document.getElementById("new-set-btn"),
    resetBtn: document.getElementById("reset-btn"),
    navButtons: [...document.querySelectorAll(".nav-btn")],
    views: {
      quest: document.getElementById("quest-view"),
      guide: document.getElementById("guide-view"),
      games: document.getElementById("games-view"),
      badges: document.getElementById("badges-view")
    },
    badgesGrid: document.getElementById("badges-grid"),
    mbEquation: document.getElementById("mb-equation"),
    mbOptions: document.getElementById("mb-options"),
    mbScore: document.getElementById("mb-score"),
    mbTime: document.getElementById("mb-time"),
    mbFeedback: document.getElementById("mb-feedback"),
    mbStartBtn: document.getElementById("mb-start-btn"),
    starCanvas: document.getElementById("star-canvas"),
    starScore: document.getElementById("star-score"),
    starTime: document.getElementById("star-time"),
    starBest: document.getElementById("star-best"),
    starFeedback: document.getElementById("star-feedback"),
    starStartBtn: document.getElementById("star-start-btn"),
    lightsBoard: document.getElementById("lights-board"),
    lightPads: [...document.querySelectorAll(".light-pad")],
    lightsRound: document.getElementById("lights-round"),
    lightsFeedback: document.getElementById("lights-feedback"),
    lightsStartBtn: document.getElementById("lights-start-btn"),
    snakeCanvas: document.getElementById("snake-canvas"),
    snakeScore: document.getElementById("snake-score"),
    snakeBest: document.getElementById("snake-best"),
    snakeFeedback: document.getElementById("snake-feedback"),
    snakeStartBtn: document.getElementById("snake-start-btn")
  };

  function pathKeyFor(subject, topic) {
    return `${subject}::${topic}`;
  }

  function pathKeyForExercise(exercise) {
    return pathKeyFor(exercise.subject, exercise.topic);
  }

  const subjectNames = [SUBJECT_ALL, ...new Set(exercises.map((exercise) => exercise.subject))];
  const pathKeys = [...new Set(exercises.map(pathKeyForExercise))];
  const paths = pathKeys.map((key) => {
    const sample = exercises.find((exercise) => pathKeyForExercise(exercise) === key);
    return {
      key,
      subject: sample.subject,
      topic: sample.topic
    };
  });
  const pathByKey = new Map(paths.map((path) => [path.key, path]));

  const state = {
    xp: 0,
    streak: 0,
    selectedSubject: SUBJECT_ALL,
    selectedTopic: "All",
    completedIds: [],
    positionByTopic: {},
    questIdsByTopic: {},
    answeredId: null
  };

  const starContext = elements.starCanvas.getContext("2d");
  const snakeContext = elements.snakeCanvas ? elements.snakeCanvas.getContext("2d") : null;
  const starState = {
    running: false,
    score: 0,
    best: Number(localStorage.getItem("studyQuestStarBest")) || 0,
    timeLeft: 30,
    playerX: elements.starCanvas.width / 2,
    stars: [],
    keys: { left: false, right: false },
    lastFrame: 0,
    spawnTimer: 0,
    animationId: null
  };

  const lightsState = {
    sequence: [],
    inputIndex: 0,
    round: 0,
    accepting: false,
    playToken: 0
  };

  const mbState = {
    running: false,
    score: 0,
    timeLeft: 30,
    timerId: null,
    correctAnswer: null
  };

  const snakeState = {
    running: false,
    score: 0,
    best: Number(localStorage.getItem("studyQuestSnakeBest")) || 0,
    snake: [{x: 10, y: 10}],
    dir: {x: 1, y: 0},
    nextDir: {x: 1, y: 0},
    food: {x: 15, y: 15},
    animationId: null,
    speed: 150,
    lastTick: 0
  };

  const badgeDefs = [
    { id: "b1", title: "Beginner", desc: "Earn 50 XP", reqXp: 50, icon: "🌟" },
    { id: "b2", title: "Learner", desc: "Earn 200 XP", reqXp: 200, icon: "📚" },
    { id: "b3", title: "Scholar", desc: "Earn 500 XP", reqXp: 500, icon: "🎓" },
    { id: "b4", title: "Genius", desc: "Earn 1000 XP", reqXp: 1000, icon: "💡" },
    { id: "b5", title: "Master", desc: "Earn 2500 XP", reqXp: 2500, icon: "👑" }
  ];

  function renderBadges() {
    if (!elements.badgesGrid) return;
    elements.badgesGrid.innerHTML = "";
    badgeDefs.forEach(b => {
      const isUnlocked = state.xp >= b.reqXp;
      const el = document.createElement("div");
      el.className = `badge-item ${isUnlocked ? "" : "locked"}`;
      el.innerHTML = `
        <div class="badge-icon">${b.icon}</div>
        <div class="badge-title">${b.title}</div>
        <div class="badge-desc">${b.desc}</div>
      `;
      elements.badgesGrid.appendChild(el);
    });
  }

  function visiblePathKeys(subject = state.selectedSubject) {
    if (subject === SUBJECT_ALL) {
      return pathKeys;
    }

    return paths.filter((path) => path.subject === subject).map((path) => path.key);
  }

  function poolForPath(pathKey) {
    return exercises.filter((exercise) => pathKeyForExercise(exercise) === pathKey);
  }

  function targetSizeForPath(pathKey) {
    const path = pathByKey.get(pathKey);
    const poolSize = poolForPath(pathKey).length;
    const requestedSize = topicQuestSizes[pathKey]
      ?? topicQuestSizes[`${path.subject}: ${path.topic}`]
      ?? topicQuestSizes[path.topic];
    const targetSize = Number.isFinite(requestedSize) ? requestedSize : poolSize;

    return Math.min(Math.max(targetSize, 0), poolSize);
  }

  function shuffled(values) {
    const copy = [...values];

    for (let index = copy.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const current = copy[index];
      copy[index] = copy[swapIndex];
      copy[swapIndex] = current;
    }

    return copy;
  }

  function chooseOne(values) {
    return values[Math.floor(Math.random() * values.length)];
  }

  function awardXp(amount) {
    state.xp += amount;
    updateStats();
    saveState();
  }

  function buildQuestIdsForPath(pathKey, idsToKeep) {
    const poolIds = poolForPath(pathKey).map((exercise) => exercise.id);
    const targetSize = targetSizeForPath(pathKey);
    const keptIds = Array.isArray(idsToKeep)
      ? idsToKeep.filter((id) => poolIds.includes(id)).slice(0, targetSize)
      : [];
    const remainingIds = poolIds.filter((id) => !keptIds.includes(id));

    return [...keptIds, ...shuffled(remainingIds).slice(0, targetSize - keptIds.length)];
  }

  function allQuestIds(subject = SUBJECT_ALL) {
    return visiblePathKeys(subject).flatMap((pathKey) => state.questIdsByTopic[pathKey] || []);
  }

  function selectionKey() {
    return state.selectedTopic === "All"
      ? `subject:${state.selectedSubject}`
      : state.selectedTopic;
  }

  function ensureQuestPlan() {
    pathKeys.forEach((pathKey) => {
      const currentIds = state.questIdsByTopic[pathKey];
      state.questIdsByTopic[pathKey] = buildQuestIdsForPath(pathKey, currentIds);
    });

    const currentQuestIds = allQuestIds(SUBJECT_ALL);
    state.completedIds = state.completedIds.filter((id) => currentQuestIds.includes(id));

    subjectNames.forEach((subject) => {
      const key = `subject:${subject}`;
      state.positionByTopic[key] = Math.min(state.positionByTopic[key] || 0, allQuestIds(subject).length);
    });

    pathKeys.forEach((pathKey) => {
      const pathLength = (state.questIdsByTopic[pathKey] || []).length;
      state.positionByTopic[pathKey] = Math.min(state.positionByTopic[pathKey] || 0, pathLength);
    });

    if (state.selectedTopic !== "All" && !visiblePathKeys().includes(state.selectedTopic)) {
      state.selectedTopic = "All";
    }
  }

  function startFreshQuest(keepXp, keepSelection) {
    const selectedSubject = keepSelection ? state.selectedSubject : SUBJECT_ALL;

    state.streak = 0;
    state.selectedSubject = selectedSubject;
    state.selectedTopic = "All";
    state.completedIds = [];
    state.positionByTopic = {};
    state.questIdsByTopic = {};
    state.answeredId = null;

    if (!keepXp) {
      state.xp = 0;
    }

    ensureQuestPlan();
    saveState();
    render();
  }

  function loadSavedState() {
    try {
      const savedText = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      const saved = JSON.parse(savedText);

      if (!saved || typeof saved !== "object") {
        ensureQuestPlan();
        return;
      }

      state.xp = Number.isFinite(saved.xp) ? saved.xp : 0;
      state.streak = Number.isFinite(saved.streak) ? saved.streak : 0;
      state.selectedSubject = subjectNames.includes(saved.selectedSubject) ? saved.selectedSubject : SUBJECT_ALL;
      state.selectedTopic = saved.selectedTopic === "All" || pathByKey.has(saved.selectedTopic)
        ? saved.selectedTopic
        : "All";
      state.completedIds = Array.isArray(saved.completedIds)
        ? saved.completedIds.filter((id) => exerciseById.has(id))
        : [];
      state.positionByTopic = saved.positionByTopic && typeof saved.positionByTopic === "object"
        ? saved.positionByTopic
        : {};
      state.questIdsByTopic = saved.questIdsByTopic && typeof saved.questIdsByTopic === "object"
        ? saved.questIdsByTopic
        : {};
      state.answeredId = saved.answeredId || null;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }

    ensureQuestPlan();
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function activeExercises() {
    if (state.selectedTopic === "All") {
      return allQuestIds(state.selectedSubject).map((id) => exerciseById.get(id)).filter(Boolean);
    }

    return (state.questIdsByTopic[state.selectedTopic] || [])
      .map((id) => exerciseById.get(id))
      .filter(Boolean);
  }

  function currentPosition() {
    const active = activeExercises();
    const rawPosition = state.positionByTopic[selectionKey()] || 0;
    return Math.min(Math.max(rawPosition, 0), active.length);
  }

  function setCurrentPosition(position) {
    state.positionByTopic[selectionKey()] = position;
  }

  function completedCountForSubject(subject) {
    return allQuestIds(subject).filter((id) => state.completedIds.includes(id)).length;
  }

  function totalCountForSubject(subject) {
    return allQuestIds(subject).length;
  }

  function completedCountForPath(pathKey) {
    return (state.questIdsByTopic[pathKey] || []).filter((id) => state.completedIds.includes(id)).length;
  }

  function totalCountForPath(pathKey) {
    return (state.questIdsByTopic[pathKey] || []).length;
  }

  function poolCountForSubject(subject) {
    if (subject === SUBJECT_ALL) {
      return exercises.length;
    }

    return exercises.filter((exercise) => exercise.subject === subject).length;
  }

  function poolCountForPath(pathKey) {
    return poolForPath(pathKey).length;
  }

  function updateStats() {
    const completed = completedCountForSubject(state.selectedSubject);
    const total = totalCountForSubject(state.selectedSubject) || 1;
    const percent = Math.round((completed / total) * 100);
    const subjectSuffix = state.selectedSubject === SUBJECT_ALL ? "" : ` in ${state.selectedSubject}`;

    elements.xpCounter.textContent = state.xp;
    elements.streakCounter.textContent = state.streak;
    elements.levelCounter.textContent = Math.floor(state.xp / 250) + 1;
    elements.progressBar.style.width = `${percent}%`;
    elements.masteryLabel.textContent = `${completed} of ${total} mastered${subjectSuffix}`;
    renderBadges();
  }

  function setView(viewName) {
    const nextView = elements.views[viewName] ? viewName : "quest";

    elements.navButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.view === nextView));
    });

    Object.entries(elements.views).forEach(([name, view]) => {
      view.classList.toggle("hidden", name !== nextView);
    });

    elements.progressStrip.classList.toggle("hidden", nextView !== "quest");

    if (nextView === "games") {
      drawStarGame();
      updateLightsDisplay();
    } else if (starState.running) {
      pauseStarGame();
    }
  }

  function renderSubjectList() {
    elements.subjectList.innerHTML = "";

    subjectNames.forEach((subject) => {
      const button = document.createElement("button");
      const subjectName = document.createElement("span");
      const subjectCount = document.createElement("span");

      button.className = "subject-btn";
      button.type = "button";
      button.setAttribute("aria-pressed", String(subject === state.selectedSubject));
      button.title = `${totalCountForSubject(subject)} drawn from ${poolCountForSubject(subject)} available questions`;

      subjectName.className = "subject-name";
      subjectName.textContent = subject;

      subjectCount.className = "subject-count";
      subjectCount.textContent = `${completedCountForSubject(subject)}/${totalCountForSubject(subject)}`;

      button.append(subjectName, subjectCount);
      button.addEventListener("click", () => {
        state.selectedSubject = subject;
        state.selectedTopic = "All";
        state.answeredId = null;
        saveState();
        render();
      });

      elements.subjectList.appendChild(button);
    });
  }

  function renderTopicList() {
    elements.topicList.innerHTML = "";

    const allButton = document.createElement("button");
    const allName = document.createElement("span");
    const allCount = document.createElement("span");

    allButton.className = "topic-btn";
    allButton.type = "button";
    allButton.setAttribute("aria-pressed", String(state.selectedTopic === "All"));
    allButton.title = `${totalCountForSubject(state.selectedSubject)} drawn from ${poolCountForSubject(state.selectedSubject)} available questions`;

    allName.className = "topic-name";
    allName.textContent = state.selectedSubject === SUBJECT_ALL ? "All paths" : `All ${state.selectedSubject}`;

    allCount.className = "topic-count";
    allCount.textContent = `${completedCountForSubject(state.selectedSubject)}/${totalCountForSubject(state.selectedSubject)}`;

    allButton.append(allName, allCount);
    allButton.addEventListener("click", () => {
      state.selectedTopic = "All";
      state.answeredId = null;
      saveState();
      render();
    });

    elements.topicList.appendChild(allButton);

    visiblePathKeys().forEach((pathKey) => {
      const path = pathByKey.get(pathKey);
      const button = document.createElement("button");
      const topicName = document.createElement("span");
      const topicCount = document.createElement("span");

      button.className = "topic-btn";
      button.type = "button";
      button.setAttribute("aria-pressed", String(pathKey === state.selectedTopic));
      button.dataset.topic = pathKey;
      button.title = `${totalCountForPath(pathKey)} drawn from ${poolCountForPath(pathKey)} available questions`;

      topicName.className = "topic-name";
      topicName.textContent = state.selectedSubject === SUBJECT_ALL
        ? `${path.subject}: ${path.topic}`
        : path.topic;

      topicCount.className = "topic-count";
      topicCount.textContent = `${completedCountForPath(pathKey)}/${totalCountForPath(pathKey)}`;

      button.append(topicName, topicCount);
      button.addEventListener("click", () => {
        state.selectedTopic = pathKey;
        state.answeredId = null;
        saveState();
        render();
      });

      elements.topicList.appendChild(button);
    });
  }

  function renderEmptyState() {
    elements.topicLabel.textContent = "Ready";
    elements.stepLabel.textContent = "Step 0";
    elements.progressLabel.textContent = "No challenges loaded";
    elements.questionText.textContent = "Add exercises to data.js to begin.";
    elements.optionsGrid.innerHTML = "";
    elements.feedbackBox.className = "feedback-box hidden";
  }

  function currentSelectionLabel() {
    if (state.selectedTopic === "All") {
      return state.selectedSubject;
    }

    const path = pathByKey.get(state.selectedTopic);
    return `${path.subject}: ${path.topic}`;
  }

  function renderCompletion() {
    const selectionLabel = currentSelectionLabel();

    elements.topicLabel.textContent = selectionLabel;
    elements.stepLabel.textContent = "Complete";
    elements.progressLabel.textContent = `${selectionLabel} complete`;
    elements.questionText.textContent = `Nice finish. The ${selectionLabel} quest is complete.`;
    elements.optionsGrid.innerHTML = "";
    elements.feedbackBox.className = "feedback-box hidden";

    const reviewButton = document.createElement("button");
    reviewButton.className = "option-btn";
    reviewButton.type = "button";
    reviewButton.textContent = "Review this quest";
    reviewButton.addEventListener("click", () => {
      setCurrentPosition(0);
      state.answeredId = null;
      saveState();
      render();
    });

    elements.optionsGrid.appendChild(reviewButton);
    updateStats();
    renderSubjectList();
    renderTopicList();
  }

  function renderQuestion() {
    const active = activeExercises();
    const position = currentPosition();
    const question = active[position];

    if (!question) {
      renderCompletion();
      return;
    }

    elements.topicLabel.textContent = `${question.subject}: ${question.topic}`;
    elements.stepLabel.textContent = `Step ${position + 1}`;
    elements.progressLabel.textContent = `Challenge ${position + 1} of ${active.length}`;
    elements.questionText.textContent = question.question;
    elements.optionsGrid.innerHTML = "";
    elements.feedbackBox.className = "feedback-box hidden";

    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.className = "option-btn";
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => checkAnswer(option, button, question));
      elements.optionsGrid.appendChild(button);
    });

    updateStats();
  }

  function checkAnswer(selectedOption, selectedButton, question) {
    if (state.answeredId === question.id) {
      return;
    }

    const buttons = [...elements.optionsGrid.querySelectorAll(".option-btn")];
    const isCorrect = selectedOption === question.correctAnswer;
    const wasAlreadyCompleted = state.completedIds.includes(question.id);

    buttons.forEach((button) => {
      button.disabled = true;

      if (button.textContent === question.correctAnswer) {
        button.classList.add("correct");
      }
    });

    elements.feedbackBox.classList.remove("hidden", "correct-theme", "wrong-theme");

    if (isCorrect) {
      selectedButton.classList.add("correct");
      elements.feedbackBox.classList.add("correct-theme");
      elements.feedbackTitle.textContent = wasAlreadyCompleted ? "Still sharp" : "Brilliant";
      state.xp += wasAlreadyCompleted ? 10 : 50 + (state.streak * 10);
      state.streak += 1;

      if (!wasAlreadyCompleted) {
        state.completedIds.push(question.id);
      }
    } else {
      selectedButton.classList.add("wrong");
      elements.feedbackBox.classList.add("wrong-theme");
      elements.feedbackTitle.textContent = "Not quite";
      state.streak = 0;
    }

    state.answeredId = question.id;
    elements.feedbackText.textContent = question.explanation;
    elements.nextBtn.textContent = currentPosition() + 1 >= activeExercises().length
      ? "Finish quest"
      : "Next challenge";

    saveState();
    updateStats();
    renderSubjectList();
    renderTopicList();
  }

  function drawStarShape(context, x, y, radius) {
    context.beginPath();

    for (let point = 0; point < 10; point++) {
      const angle = -Math.PI / 2 + point * Math.PI / 5;
      const pointRadius = point % 2 === 0 ? radius : radius * 0.45;
      const drawX = x + Math.cos(angle) * pointRadius;
      const drawY = y + Math.sin(angle) * pointRadius;

      if (point === 0) {
        context.moveTo(drawX, drawY);
      } else {
        context.lineTo(drawX, drawY);
      }
    }

    context.closePath();
    context.fill();
  }

  function drawStarGame() {
    const canvas = elements.starCanvas;
    const width = canvas.width;
    const height = canvas.height;

    starContext.clearRect(0, 0, width, height);
    starContext.fillStyle = "#12211f";
    starContext.fillRect(0, 0, width, height);

    starContext.fillStyle = "rgba(255, 255, 255, 0.16)";
    for (let index = 0; index < 40; index++) {
      const x = (index * 97) % width;
      const y = (index * 53) % height;
      starContext.fillRect(x, y, 2, 2);
    }

    starContext.fillStyle = "#f2b84b";
    starState.stars.forEach((star) => {
      drawStarShape(starContext, star.x, star.y, star.radius);
    });

    const playerY = height - 38;
    starContext.fillStyle = "#28a87d";
    starContext.beginPath();
    starContext.roundRect(starState.playerX - 46, playerY, 92, 18, 8);
    starContext.fill();
    starContext.fillStyle = "#e8f7ef";
    starContext.beginPath();
    starContext.roundRect(starState.playerX - 28, playerY - 14, 56, 18, 8);
    starContext.fill();

    if (!starState.running) {
      starContext.fillStyle = "rgba(255, 255, 255, 0.88)";
      starContext.font = "700 22px system-ui, sans-serif";
      starContext.textAlign = "center";
      starContext.fillText("Catch the falling stars", width / 2, height / 2 - 8);
      starContext.font = "600 15px system-ui, sans-serif";
      starContext.fillText("Press Start, then move the catcher left and right.", width / 2, height / 2 + 22);
    }
  }

  function updateStarHud() {
    elements.starScore.textContent = starState.score;
    elements.starTime.textContent = Math.max(0, Math.ceil(starState.timeLeft));
    elements.starBest.textContent = starState.best;
  }

  function spawnStar() {
    starState.stars.push({
      x: 24 + Math.random() * (elements.starCanvas.width - 48),
      y: -20,
      radius: 12 + Math.random() * 6,
      speed: 120 + Math.random() * 95
    });
  }

  function endStarGame() {
    starState.running = false;
    window.cancelAnimationFrame(starState.animationId);
    starState.animationId = null;

    if (starState.score > starState.best) {
      starState.best = starState.score;
      localStorage.setItem("studyQuestStarBest", String(starState.best));
    }

    const earnedXp = Math.min(30, starState.score);
    if (earnedXp > 0) {
      awardXp(earnedXp);
    }

    elements.starFeedback.textContent = `Game over. You caught ${starState.score} stars and earned ${earnedXp} XP.`;
    elements.starStartBtn.textContent = "Play again";
    updateStarHud();
    drawStarGame();
  }

  function pauseStarGame() {
    starState.running = false;
    window.cancelAnimationFrame(starState.animationId);
    starState.animationId = null;
    elements.starFeedback.textContent = "Paused. Press Start when you want to play again.";
    elements.starStartBtn.textContent = "Start game";
    updateStarHud();
    drawStarGame();
  }

  function stepStarGame(timestamp) {
    if (!starState.running) {
      return;
    }

    const canvas = elements.starCanvas;
    const delta = Math.min((timestamp - starState.lastFrame) / 1000, 0.05);
    starState.lastFrame = timestamp;
    starState.timeLeft -= delta;

    const movement = 330 * delta;
    if (starState.keys.left) {
      starState.playerX -= movement;
    }
    if (starState.keys.right) {
      starState.playerX += movement;
    }
    starState.playerX = Math.min(canvas.width - 50, Math.max(50, starState.playerX));

    starState.spawnTimer -= delta;
    if (starState.spawnTimer <= 0) {
      spawnStar();
      starState.spawnTimer = Math.max(0.34, 0.86 - starState.score * 0.015);
    }

    starState.stars.forEach((star) => {
      star.y += star.speed * delta;
    });

    starState.stars = starState.stars.filter((star) => {
      const nearCatcher = star.y > canvas.height - 64 && Math.abs(star.x - starState.playerX) < 54;
      const stillVisible = star.y < canvas.height + 30;

      if (nearCatcher) {
        starState.score += 1;
        return false;
      }

      return stillVisible;
    });

    updateStarHud();
    drawStarGame();

    if (starState.timeLeft <= 0) {
      endStarGame();
      return;
    }

    starState.animationId = window.requestAnimationFrame(stepStarGame);
  }

  function startStarGame() {
    window.cancelAnimationFrame(starState.animationId);
    starState.running = true;
    starState.score = 0;
    starState.timeLeft = 30;
    starState.playerX = elements.starCanvas.width / 2;
    starState.stars = [];
    starState.spawnTimer = 0;
    starState.lastFrame = performance.now();
    elements.starFeedback.textContent = "Catch as many as you can.";
    elements.starStartBtn.textContent = "Restart game";
    updateStarHud();
    starState.animationId = window.requestAnimationFrame(stepStarGame);
  }

  function moveStarPlayerFromPointer(event) {
    const rect = elements.starCanvas.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    starState.playerX = Math.min(elements.starCanvas.width - 50, Math.max(50, ratio * elements.starCanvas.width));
    drawStarGame();
  }

  function updateLightsDisplay() {
    elements.lightsRound.textContent = lightsState.round;
    elements.lightPads.forEach((pad) => {
      pad.disabled = !lightsState.accepting;
    });
  }

  function flashLightPad(index, duration) {
    const pad = elements.lightPads[index];

    if (!pad) {
      return;
    }

    pad.classList.add("active");
    window.setTimeout(() => {
      pad.classList.remove("active");
    }, duration);
  }

  function playLightsSequence(token) {
    lightsState.accepting = false;
    elements.lightsFeedback.textContent = "Watch the pattern.";
    updateLightsDisplay();

    lightsState.sequence.forEach((padIndex, sequenceIndex) => {
      window.setTimeout(() => {
        if (token !== lightsState.playToken) {
          return;
        }

        flashLightPad(padIndex, 430);
      }, 620 * sequenceIndex);
    });

    window.setTimeout(() => {
      if (token !== lightsState.playToken) {
        return;
      }

      lightsState.inputIndex = 0;
      lightsState.accepting = true;
      elements.lightsFeedback.textContent = "Your turn. Repeat the pattern.";
      updateLightsDisplay();
    }, 620 * lightsState.sequence.length + 120);
  }

  function addLightsRound() {
    lightsState.sequence.push(Math.floor(Math.random() * elements.lightPads.length));
    lightsState.round += 1;
    lightsState.playToken += 1;
    updateLightsDisplay();
    playLightsSequence(lightsState.playToken);
  }

  function startLightsGame() {
    lightsState.sequence = [];
    lightsState.inputIndex = 0;
    lightsState.round = 0;
    lightsState.accepting = false;
    lightsState.playToken += 1;
    elements.lightsStartBtn.textContent = "Restart pattern";
    addLightsRound();
  }

  function handleLightPad(padIndex) {
    if (!lightsState.accepting) {
      return;
    }

    flashLightPad(padIndex, 180);

    if (padIndex !== lightsState.sequence[lightsState.inputIndex]) {
      lightsState.accepting = false;
      elements.lightsFeedback.textContent = `Pattern missed. You reached round ${lightsState.round}.`;
      elements.lightsStartBtn.textContent = "Try again";
      updateLightsDisplay();
      return;
    }

    lightsState.inputIndex += 1;

    if (lightsState.inputIndex < lightsState.sequence.length) {
      elements.lightsFeedback.textContent = "Good. Keep going.";
      return;
    }

    lightsState.accepting = false;
    elements.lightsFeedback.textContent = "Round cleared. Get ready for the next pattern.";

    if (lightsState.round % 3 === 0) {
      awardXp(10);
      elements.lightsFeedback.textContent = "Round cleared. You earned 10 XP.";
    }

    updateLightsDisplay();
    window.setTimeout(addLightsRound, 850);
  }

  function generateMbProblem() {
    const ops = ["+", "-", "x"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, ans;
    if (op === "+") {
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      ans = a + b;
    } else if (op === "-") {
      a = Math.floor(Math.random() * 50) + 20;
      b = Math.floor(Math.random() * 20) + 1;
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      ans = a * b;
    }
    mbState.correctAnswer = ans;
    elements.mbEquation.textContent = `${a} ${op} ${b} = ?`;
    
    const options = new Set([ans]);
    while(options.size < 4) {
      let offset = Math.floor(Math.random() * 21) - 10;
      if(offset === 0) offset = 1;
      options.add(ans + offset);
    }
    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);
    
    elements.mbOptions.innerHTML = "";
    shuffledOptions.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "mb-option-btn";
      btn.textContent = opt;
      btn.onclick = () => handleMbAnswer(opt, btn);
      elements.mbOptions.appendChild(btn);
    });
  }

  function handleMbAnswer(selected, btn) {
    if (!mbState.running) return;
    const buttons = elements.mbOptions.querySelectorAll("button");
    buttons.forEach(b => b.disabled = true);
    
    if (selected === mbState.correctAnswer) {
      btn.classList.add("correct");
      mbState.score += 10;
      elements.mbScore.textContent = mbState.score;
      elements.mbFeedback.textContent = "Correct! +10 points";
      setTimeout(() => {
        if (mbState.running) generateMbProblem();
      }, 500);
    } else {
      btn.classList.add("wrong");
      elements.mbFeedback.textContent = "Wrong! Try again.";
      setTimeout(() => {
        if (mbState.running) generateMbProblem();
      }, 800);
    }
  }

  function startMbGame() {
    mbState.running = true;
    mbState.score = 0;
    mbState.timeLeft = 30;
    elements.mbScore.textContent = "0";
    elements.mbTime.textContent = "30";
    elements.mbFeedback.textContent = "Go!";
    elements.mbStartBtn.textContent = "Restart Game";
    
    clearInterval(mbState.timerId);
    mbState.timerId = setInterval(() => {
      mbState.timeLeft--;
      elements.mbTime.textContent = mbState.timeLeft;
      if (mbState.timeLeft <= 0) {
        endMbGame();
      }
    }, 1000);
    
    generateMbProblem();
  }

  function endMbGame() {
    mbState.running = false;
    clearInterval(mbState.timerId);
    elements.mbOptions.innerHTML = "";
    elements.mbEquation.textContent = "Time's Up!";
    elements.mbFeedback.textContent = `Game Over! You scored ${mbState.score} points.`;
    awardXp(mbState.score);
  }

  function resetProgress() {
    const confirmed = window.confirm("Reset StudyQuest progress on this browser?");

    if (!confirmed) {
      return;
    }

    startFreshQuest(false, false);
  }

  function startNewSet() {
    const confirmed = window.confirm("Start a new random question set? XP and level will stay.");

    if (!confirmed) {
      return;
    }

    startFreshQuest(true, true);
  }

  function render() {
    if (!exercises.length) {
      renderEmptyState();
      return;
    }

    ensureQuestPlan();
    renderSubjectList();
    renderTopicList();
    renderQuestion();
  }

  elements.nextBtn.addEventListener("click", () => {
    setCurrentPosition(currentPosition() + 1);
    state.answeredId = null;
    saveState();
    render();
  });

  elements.resetBtn.addEventListener("click", resetProgress);
  elements.newSetBtn.addEventListener("click", startNewSet);
  elements.navButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
  elements.starStartBtn.addEventListener("click", startStarGame);
  elements.starCanvas.addEventListener("pointerdown", moveStarPlayerFromPointer);
  elements.starCanvas.addEventListener("pointermove", (event) => {
    if (event.buttons || starState.running) {
      moveStarPlayerFromPointer(event);
    }
  });
  elements.lightPads.forEach((pad) => {
    pad.addEventListener("click", () => handleLightPad(Number(pad.dataset.pad)));
  });
  elements.lightsStartBtn.addEventListener("click", startLightsGame);
  if (elements.mbStartBtn) {
    elements.mbStartBtn.addEventListener("click", startMbGame);
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
      starState.keys.left = true;
      if (starState.running) {
        event.preventDefault();
      }
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
      starState.keys.right = true;
      if (starState.running) {
        event.preventDefault();
      }
    }
  });
  document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
      starState.keys.left = false;
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
      starState.keys.right = false;
    }
  });

  // --- Snake Game ---
  function drawSnakeGame() {
    if (!snakeContext) return;
    const canvas = elements.snakeCanvas;
    const ctx = snakeContext;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#12211f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw food
    ctx.fillStyle = "#f2b84b";
    ctx.fillRect(snakeState.food.x * 20, snakeState.food.y * 20, 18, 18);
    
    // Draw snake
    ctx.fillStyle = "#28a87d";
    snakeState.snake.forEach((seg, i) => {
      ctx.fillRect(seg.x * 20, seg.y * 20, 18, 18);
    });
  }

  function endSnakeGame() {
    snakeState.running = false;
    window.cancelAnimationFrame(snakeState.animationId);
    snakeState.animationId = null;
    if (snakeState.score > snakeState.best) {
      snakeState.best = snakeState.score;
      localStorage.setItem("studyQuestSnakeBest", String(snakeState.best));
    }
    const earnedXp = Math.min(30, snakeState.score);
    if (earnedXp > 0) awardXp(earnedXp);
    
    elements.snakeFeedback.textContent = `Game over! Score: ${snakeState.score}. Earned ${earnedXp} XP.`;
    elements.snakeStartBtn.textContent = "Play again";
    elements.snakeBest.textContent = snakeState.best;
    elements.snakeScore.textContent = snakeState.score;
  }

  function stepSnakeGame(timestamp) {
    if (!snakeState.running) return;
    
    if (timestamp - snakeState.lastTick > snakeState.speed) {
      snakeState.lastTick = timestamp;
      snakeState.dir = snakeState.nextDir;
      
      const head = { ...snakeState.snake[0] };
      head.x += snakeState.dir.x;
      head.y += snakeState.dir.y;
      
      // Collision
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        endSnakeGame();
        return;
      }
      for (let i = 0; i < snakeState.snake.length; i++) {
        if (head.x === snakeState.snake[i].x && head.y === snakeState.snake[i].y) {
          endSnakeGame();
          return;
        }
      }
      
      snakeState.snake.unshift(head);
      
      if (head.x === snakeState.food.x && head.y === snakeState.food.y) {
        snakeState.score += 1;
        snakeState.speed = Math.max(50, snakeState.speed - 2);
        elements.snakeScore.textContent = snakeState.score;
        elements.snakeFeedback.textContent = "Yum!";
        snakeState.food = {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20)
        };
      } else {
        snakeState.snake.pop();
      }
      drawSnakeGame();
    }
    
    snakeState.animationId = window.requestAnimationFrame(stepSnakeGame);
  }

  function startSnakeGame() {
    window.cancelAnimationFrame(snakeState.animationId);
    snakeState.running = true;
    snakeState.score = 0;
    snakeState.snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
    snakeState.dir = {x: 1, y: 0};
    snakeState.nextDir = {x: 1, y: 0};
    snakeState.food = {x: 15, y: 10};
    snakeState.speed = 150;
    snakeState.lastTick = performance.now();
    elements.snakeScore.textContent = snakeState.score;
    elements.snakeBest.textContent = snakeState.best;
    elements.snakeFeedback.textContent = "Use arrow keys to move!";
    elements.snakeStartBtn.textContent = "Restart";
    drawSnakeGame();
    snakeState.animationId = window.requestAnimationFrame(stepSnakeGame);
  }

  if (elements.snakeStartBtn) {
    elements.snakeStartBtn.addEventListener("click", startSnakeGame);
  }

  document.addEventListener("keydown", (event) => {
    if (snakeState.running) {
      if (event.key === "ArrowUp" && snakeState.dir.y !== 1) { snakeState.nextDir = {x: 0, y: -1}; event.preventDefault(); }
      if (event.key === "ArrowDown" && snakeState.dir.y !== -1) { snakeState.nextDir = {x: 0, y: 1}; event.preventDefault(); }
      if (event.key === "ArrowLeft" && snakeState.dir.x !== 1) { snakeState.nextDir = {x: -1, y: 0}; event.preventDefault(); }
      if (event.key === "ArrowRight" && snakeState.dir.x !== -1) { snakeState.nextDir = {x: 1, y: 0}; event.preventDefault(); }
    }
  });

  loadSavedState();
  updateStarHud();
  updateLightsDisplay();
  drawStarGame();
  render();
  setView("quest");
})();
