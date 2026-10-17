// Core quiz logic.
// This file has NO browser (DOM) code so it can be tested with Node.js.

/**
 * Returns a new array with the items in random order.
 * The original array is not changed.
 */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns true when the selected option is the correct one.
 */
function isCorrect(question, selectedIndex) {
  return question.answer === selectedIndex;
}

/**
 * Creates fresh state for a quiz using the supplied questions.
 */
function createQuiz(questions) {
  return {
    questions,
    current: 0,
    score: 0,
    questionFinished: false,
  };
}

/**
 * Records an answer without changing the existing quiz state.
 */
function answerQuestion(state, selectedIndex) {
  const correct = isCorrect(state.questions[state.current], selectedIndex);
  return {
    state: {
      ...state,
      score: state.score + (correct ? 1 : 0),
      questionFinished: true,
    },
    correct,
  };
}

/**
 * Advances to the next question without changing the existing quiz state.
 */
function advanceQuestion(state) {
  return {
    ...state,
    current: state.current + 1,
    questionFinished: false,
  };
}

/**
 * Returns true when the quiz has no remaining question to display.
 */
function isQuizFinished(state) {
  return state.current >= state.questions.length;
}

/**
 * Converts a score into a whole-number percentage (0-100).
 */
function calculatePercentage(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

/**
 * Formats remaining time as a nonnegative whole number of seconds.
 */
function formatTimeLeft(seconds) {
  const remaining = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `⏱ ${remaining}s`;
}

/**
 * Returns feedback for a selected answer.
 */
function getFeedbackMessage(correct) {
  return correct ? "Correct!" : "Not quite. The correct answer is highlighted.";
}

/**
 * Turns a percentage into a grade.
 * A = 90% or more, B = 75% or more, C = 50% or more.
 */
function getGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 75) return "B";
  if (percentage >= 50) return "C";
  return "Keep practicing";
}

// Lets Node.js tests load this file. Browsers ignore this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    shuffle,
    isCorrect,
    createQuiz,
    answerQuestion,
    advanceQuestion,
    isQuizFinished,
    calculatePercentage,
    formatTimeLeft,
    getFeedbackMessage,
    getGrade,
  };
}
