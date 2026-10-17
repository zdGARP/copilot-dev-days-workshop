# Repository Guidelines

## Build, test, and run

- No build or lint scripts are configured.
- Run the full test suite with `npm test` (Node.js built-in test runner; no install step).
- Run one test file with `node --test tests/quiz.test.js` or `node --test tests/questions.test.js`.
- Run a single named test with `node --test --test-name-pattern="getGrade gives an A for exactly 90%" tests/quiz.test.js` (replace the pattern as needed).
- Start the app with `npm start`; it serves `src/` at `http://localhost:8080` using `http-server` via `npx`.

## Architecture

This is a static, dependency-light browser quiz. The repository-root `index.html` redirects GitHub Pages visitors to `src/index.html`. That page loads `questions.js`, `quiz.js`, and then `app.js` as classic scripts; the order matters because the UI uses their globals. `app.js` owns DOM rendering and interaction state, while `quiz.js` contains browser-independent quiz logic. `questions.js` provides the question data. The logic and question files expose CommonJS exports behind a browser-safe `module` check so Node tests can require them.

See [README.md](../README.md) for the project and [workshops/](../workshops/) for the guided and self-paced workflows.

## Code conventions

- Keep DOM access and event handling in `src/app.js`; keep reusable quiz calculations in `src/quiz.js` so they remain testable without a browser.
- Quiz question objects use `question`, `options` (exactly four choices), and `answer`, a zero-based index into `options`. Keep these constraints covered by `tests/questions.test.js`.
- The starter intentionally has one failing test: the `getGrade` boundary at exactly 90% in `tests/quiz.test.js`. This is the planted Chapter 4 debugging exercise; do not fix it preemptively unless the requested task includes that exercise or bug.
- Preserve the classic-script load order in `src/index.html` when adding browser code.
