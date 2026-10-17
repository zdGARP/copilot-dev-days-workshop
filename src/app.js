// UI code: connects the quiz logic (quiz.js) to the page (index.html).

let state = createQuiz([]);
let timeLeft = 15;
let timerId = null;
const bestScoreStorageKey = "dev-days-quiz-best-score";

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const timerText = document.getElementById("timer");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const feedbackText = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");
const bestScoreStartText = document.getElementById("best-score-start");
const bestScoreResultText = document.getElementById("best-score-result");
const newBestMessage = document.getElementById("new-best-message");

function readBestScore() {
  try {
    const storedScore = localStorage.getItem(bestScoreStorageKey);
    if (storedScore === null) return { available: true, score: null };

    const score = Number(storedScore);
    if (!Number.isInteger(score) || score < 0 || score > 100) {
      return { available: true, score: null };
    }
    return { available: true, score };
  } catch (error) {
    console.warn("Unable to read the best score from localStorage.", error);
    return { available: false, score: null };
  }
}

function saveBestScore(score) {
  try {
    localStorage.setItem(bestScoreStorageKey, String(score));
    return true;
  } catch (error) {
    console.warn("Unable to save the best score to localStorage.", error);
    return false;
  }
}

function renderBestScore(element, bestScore) {
  if (!bestScore.available) {
    element.textContent = "Best score unavailable.";
  } else if (bestScore.score === null) {
    element.textContent = "No best score yet.";
  } else {
    element.textContent = `Best score: ${bestScore.score}%`;
  }
}

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function startQuiz() {
  stopTimer();
  state = createQuiz(shuffle(QUESTIONS));
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  stopTimer();
  timeLeft = 15;
  const question = state.questions[state.current];
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  updateTimerDisplay();
  questionText.textContent = question.question;
  feedbackText.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });

  startTimer();
}

function updateTimerDisplay() {
  timerText.textContent = formatTimeLeft(timeLeft);
  timerText.classList.toggle("timer--urgent", timeLeft <= 5);
}

function startTimer() {
  timerId = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft === 0) {
      handleTimeExpired();
    }
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function selectAnswer(selectedIndex, selectedButton) {
  if (state.questionFinished) return;
  stopTimer();
  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));
  const result = answerQuestion(state, selectedIndex);
  state = result.state;

  if (result.correct) {
    selectedButton.classList.add("correct");
    feedbackText.textContent = getFeedbackMessage(true);
  } else {
    selectedButton.classList.add("wrong");
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = getFeedbackMessage(false);
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function handleTimeExpired() {
  if (state.questionFinished) return;
  stopTimer();
  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));
  state = answerQuestion(state, -1).state;
  buttons[question.answer].classList.add("correct");
  feedbackText.textContent = "Time's up!";
  nextButton.hidden = false;
  nextButton.focus();
}

function nextQuestion() {
  stopTimer();
  state = advanceQuestion(state);
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  stopTimer();
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  const bestScore = readBestScore();
  let currentBestScore = bestScore;
  let isNewBest = false;

  if (bestScore.available && isNewBestScore(percentage, bestScore.score)) {
    if (saveBestScore(percentage)) {
      currentBestScore = { available: true, score: percentage };
      isNewBest = true;
    } else {
      currentBestScore = { available: false, score: null };
    }
  }

  renderBestScore(bestScoreResultText, currentBestScore);
  newBestMessage.hidden = !isNewBest;
  showScreen(resultScreen);
}

renderBestScore(bestScoreStartText, readBestScore());

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
