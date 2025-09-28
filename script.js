// script.js
const CORRECT_ANSWERS = {
  q1: "Paris",
  q2: "4",
  q3: "Mars",
  q4: "push()",
  q5: "/* */"
};

const QUESTIONS_CONTAINER = document.getElementById("questions");
const SUBMIT_BTN = document.getElementById("submit");
const SCORE_DIV = document.getElementById("score");
const PROGRESS_KEY = "progress";
const SCORE_KEY = "score";

function readProgress() {
  try {
    const raw = sessionStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn("Failed to parse sessionStorage.progress:", e);
    return {};
  }
}

function writeProgress(obj) {
  try {
    sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(obj));
  } catch (e) {
    console.warn("Failed to write sessionStorage.progress:", e);
  }
}

function trimQuestionTexts() {
  const questionTextDivs = QUESTIONS_CONTAINER.querySelectorAll(".question > div:first-child");
  questionTextDivs.forEach(div => {
    if (div && typeof div.textContent === "string") {
      div.textContent = div.textContent.trim();
    }
  });
}

function attachChangeListeners() {
  const radios = QUESTIONS_CONTAINER.querySelectorAll("input[type='radio']");
  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      const q = radio.name;
      const val = radio.value;

      const progress = readProgress();
      progress[q] = val;
      writeProgress(progress);

      const group = document.getElementsByName(q);
      group.forEach(inp => {
        if (inp === radio) {
          inp.checked = true;
          inp.setAttribute("checked", "true");
        } else {
          inp.checked = false;
          inp.removeAttribute("checked");
        }
      });
    });
  });
}

function restoreSelections() {
  const progress = readProgress();
  if (!progress) return;
  Object.keys(progress).forEach(qid => {
    const value = progress[qid];
    const selector = `input[name="${qid}"][value="${CSS.escape(value)}"]`;
    const input = document.querySelector(selector);
    if (input) {
      input.checked = true;
      input.setAttribute("checked", "true");
      const group = document.getElementsByName(qid);
      group.forEach(inp => {
        if (inp !== input) inp.removeAttribute("checked");
      });
    }
  });
}

function calculateAndStoreScore() {
  const progress = readProgress();
  let correctCount = 0;
  const totalQuestions = Object.keys(CORRECT_ANSWERS).length;

  Object.keys(CORRECT_ANSWERS).forEach(qid => {
    const userAnswer = progress[qid];
    const correct = CORRECT_ANSWERS[qid];
    if (userAnswer !== undefined && userAnswer === correct) correctCount++;
  });

  SCORE_DIV.textContent = `Your score is ${correctCount} out of ${totalQuestions}.`;

  try {
    localStorage.setItem(SCORE_KEY, String(correctCount));
  } catch (e) {
    console.warn("Failed to write localStorage.score:", e);
  }
}

function showStoredScoreIfAny() {
  try {
    const saved = localStorage.getItem(SCORE_KEY);
    if (saved !== null) {
      if (!SCORE_DIV.textContent) {
        SCORE_DIV.textContent = `Your score is ${saved} out of ${Object.keys(CORRECT_ANSWERS).length}.`;
      }
    }
  } catch (e) {
    console.warn("Failed to read localStorage.score:", e);
  }
}

function init() {
  trimQuestionTexts();
  attachChangeListeners();
  restoreSelections();
  showStoredScoreIfAny();

  SUBMIT_BTN.addEventListener("click", (e) => {
    e.preventDefault();
    calculateAndStoreScore();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
