const CORRECT_ANSWERS = {
  q1: "B", 
  q2: "A", 
  q3: "B", 
  q4: "A", 
  q5: "B"  
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

function attachChangeListeners() {
  const radios = QUESTIONS_CONTAINER.querySelectorAll("input[type='radio']");
  radios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      const q = radio.name;
      const val = radio.value;
      const progress = readProgress();
      progress[q] = val;
      writeProgress(progress);
    });
  });
}

function restoreSelections() {
  const progress = readProgress();
  if (!progress) return;
  Object.keys(progress).forEach(qid => {
    const value = progress[qid];
    const selector = `input[name="${qid}"][value="${value}"]`;
    const input = document.querySelector(selector);
    if (input) input.checked = true;
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
