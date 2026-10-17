// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  shuffle,
  isCorrect,
  createQuiz,
  answerQuestion,
  advanceQuestion,
  isQuizFinished,
  calculatePercentage,
  isNewBestScore,
  formatTimeLeft,
  getFeedbackMessage,
  getGrade,
} = require("../src/quiz.js");

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("createQuiz initializes state with the supplied questions", () => {
  const questions = [{ answer: 0 }];
  assert.deepEqual(createQuiz(questions), {
    questions,
    current: 0,
    score: 0,
    questionFinished: false,
  });
});

test("createQuiz creates independent state for empty questions", () => {
  const first = createQuiz([]);
  const second = createQuiz([]);
  assert.notEqual(first, second);
  assert.deepEqual(first, second);
});

test("answerQuestion records a correct answer without mutating state", () => {
  const state = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(state, 1);
  assert.equal(result.correct, true);
  assert.deepEqual(result.state, {
    questions: state.questions,
    current: 0,
    score: 1,
    questionFinished: true,
  });
  assert.equal(state.score, 0);
  assert.equal(state.questionFinished, false);
});

test("answerQuestion does not increase score for an incorrect answer", () => {
  const state = { ...createQuiz([{ answer: 1 }]), score: 2 };
  const result = answerQuestion(state, 0);
  assert.equal(result.correct, false);
  assert.equal(result.state.score, 2);
  assert.equal(result.state.questionFinished, true);
});

test("advanceQuestion moves to the next question without mutating state", () => {
  const state = { ...createQuiz([{ answer: 0 }, { answer: 1 }]), questionFinished: true };
  const nextState = advanceQuestion(state);
  assert.equal(nextState.current, 1);
  assert.equal(nextState.questionFinished, false);
  assert.equal(state.current, 0);
  assert.equal(state.questionFinished, true);
});

test("isQuizFinished is false before the final question is advanced", () => {
  assert.equal(isQuizFinished(createQuiz([{ answer: 0 }])), false);
});

test("isQuizFinished is true after all questions are advanced", () => {
  const state = advanceQuestion(createQuiz([{ answer: 0 }]));
  assert.equal(isQuizFinished(state), true);
});

test("isQuizFinished is true when there are no questions", () => {
  assert.equal(isQuizFinished(createQuiz([])), true);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("isNewBestScore accepts the first score when no best exists", () => {
  assert.equal(isNewBestScore(0, null), true);
});

test("isNewBestScore accepts a higher score than the previous best", () => {
  assert.equal(isNewBestScore(81, 80), true);
});

test("isNewBestScore rejects a score equal to the previous best", () => {
  assert.equal(isNewBestScore(80, 80), false);
});

test("isNewBestScore rejects a score lower than the previous best", () => {
  assert.equal(isNewBestScore(79, 80), false);
});

test("formatTimeLeft formats a positive value with the timer icon", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
});

test("formatTimeLeft preserves zero at the countdown boundary", () => {
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("formatTimeLeft clamps negative values to zero", () => {
  assert.equal(formatTimeLeft(-1), "⏱ 0s");
});

test("formatTimeLeft treats null as zero", () => {
  assert.equal(formatTimeLeft(null), "⏱ 0s");
});

test("getFeedbackMessage confirms a correct answer", () => {
  assert.equal(getFeedbackMessage(true), "Correct!");
});

test("getFeedbackMessage explains an incorrect answer", () => {
  assert.equal(getFeedbackMessage(false), "Not quite. The correct answer is highlighted.");
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A at 90%", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade gives a B at 75%", () => {
  assert.equal(getGrade(75), "B");
});

test("getGrade gives a C at 50%", () => {
  assert.equal(getGrade(50), "C");
});

test("getGrade gives a B below 90%", () => {
  assert.equal(getGrade(89), "B");
});

test("getGrade gives a C below 75%", () => {
  assert.equal(getGrade(74), "C");
});

test("getGrade prompts practice below 50%", () => {
  assert.equal(getGrade(49), "Keep practicing");
});
