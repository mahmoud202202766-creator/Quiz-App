const DOM = {
  quizContainer: document.querySelector(".quiz-container"),
  answerContainer: document.querySelector(".answer-container"),
  questionNumbers: document.querySelectorAll(".q-number"),
  totalQuestions: document.querySelector(".total"),
  questionName: document.querySelector(".q-name"),
  header: document.querySelector(".header"),
  scoreDisplay: document.querySelector(".score-display"),
  scoreResult: document.querySelector(".score-result"),
  totalResult: document.querySelector(".total-result"),
  scorePercentage: document.querySelector(".score-percentage"),
  btns: {
    nextBtn: document.getElementById("next-btn"),
    backBtn: document.getElementById("back-btn"),
    submitBtn: document.getElementById("submit-btn"),
    retakeBtn: document.getElementById("retake-btn"),
    reviewBtn: document.getElementById("review-btn"),
  },
};

const state = {
  index: 0,
  scoreResult: 0,
  selectedStatus: false,
  reviewState: "quiz",
  selections: {},
  answers: {},
};

const fallbackQuestions = [
  {
    "question": "What does `typeof null` return in JavaScript?",
    "options": ["null", "undefined", "object", "string"],
    "answer": "object"
  },
  {
    "question": "Which method removes the last element of an array?",
    "options": ["shift()", "pop()", "splice()", "slice()"],
    "answer": "pop()"
  },
  {
    "question": "What is the output of `0.1 + 0.2 === 0.3`?",
    "options": ["true", "false", "undefined", "NaN"],
    "answer": "false"
  },
  {
    "question": "What does `===` check?",
    "options": ["value only", "type only", "value and type", "reference"],
    "answer": "value and type"
  },
  {
    "question": "Which keyword declares a block-scoped variable?",
    "options": ["var", "let", "both", "none"],
    "answer": "let"
  },
  {
    "question": "What does `Array.isArray([])` return?",
    "options": ["false", "true", "null", "undefined"],
    "answer": "true"
  },
  {
    "question": "What is a closure?",
    "options": [
      "A loop that closes itself",
      "A function with access to its outer scope",
      "A way to close the browser",
      "An error handler"
    ],
    "answer": "A function with access to its outer scope"
  },
  {
    "question": "Which of these is NOT a JS data type?",
    "options": ["symbol", "boolean", "float", "bigint"],
    "answer": "float"
  },
  {
    "question": "What does `map()` return?",
    "options": ["the original array", "a new array", "an object", "undefined"],
    "answer": "a new array"
  },
  {
    "question": "What is `NaN === NaN`?",
    "options": ["true", "false", "undefined", "error"],
    "answer": "false"
  }
];

let questions = [];

async function init() {
  try {
    let res = await fetch("./questions.json");
    if (!res.ok) throw new Error("Failed to load questions via fetch");
    questions = await res.json();
    console.log("Loaded questions dynamically via JSON fetch");
  } catch (err) {
    console.warn("Dynamic fetch failed or blocked by CORS. Falling back to local static questions:", err);
    questions = fallbackQuestions;
  } finally {
    render("quiz");
  }
}
init();

function hideEl(el) {
  if (el) el.classList.add("hidden");
}
function showEl(el) {
  if (el) el.classList.remove("hidden");
}

function handleIndexCases(index, length) {
  if (state.reviewState === "review") {
    hideEl(DOM.btns.submitBtn);
    if (index === length - 1) {
      hideEl(DOM.btns.nextBtn);
      showEl(DOM.btns.retakeBtn);
    } else {
      showEl(DOM.btns.nextBtn);
      hideEl(DOM.btns.retakeBtn);
    }
  } else {
    hideEl(DOM.btns.retakeBtn);
    hideEl(DOM.btns.reviewBtn);
    if (index === length - 1) {
      hideEl(DOM.btns.nextBtn);
      showEl(DOM.btns.submitBtn);
      
      // Submit is disabled unless an answer is already selected for the last question
      if (state.selections[index] !== undefined) {
        DOM.btns.submitBtn.disabled = false;
      } else {
        DOM.btns.submitBtn.disabled = true;
      }
    } else {
      showEl(DOM.btns.nextBtn);
      hideEl(DOM.btns.submitBtn);
    }
  }
  
  if (index === 0) {
    DOM.btns.backBtn.disabled = true;
  } else {
    DOM.btns.backBtn.disabled = false;
  }
}

function getQuestionNumber(index) {
  DOM.questionNumbers.forEach((q) => (q.textContent = index + 1));
}

function getTotalQuestions(length) {
  if (DOM.totalQuestions) DOM.totalQuestions.textContent = length;
}

function getQuestionName(data, index) {
  if (DOM.questionName) DOM.questionName.textContent = data[index].question;
}

function render(mode) {
  let data = questions;
  
  if (!data || data.length === 0) return;
  
  handleIndexCases(state.index, data.length);
  getQuestionNumber(state.index);
  getTotalQuestions(data.length);
  getQuestionName(data, state.index);

  // Clear answer list
  DOM.answerContainer.textContent = "";

  let answers = data[state.index].options;
  answers.forEach((answer, i) => {
    // Generate native focusable button elements for superior keyboard accessibility
    let btn = document.createElement("button");
    btn.className = "answer";
    btn.type = "button";
    btn.textContent = answer;
    
    // Accessibility roles
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", "false");
    
    DOM.answerContainer.append(btn);

    if (mode === "review") {
      btn.disabled = true; // Non-interactive in review mode
      
      // Add visual success/failure indicator
      if (answer === data[state.index].answer) {
        btn.classList.add("correct");
        btn.setAttribute("aria-label", `${answer} - Correct Answer`);
      }
      
      if (state.selections[state.index] === i) {
        btn.setAttribute("aria-checked", "true");
        if (state.answers[state.index]?.correct) {
          btn.classList.add("correct");
          btn.setAttribute("aria-label", `${answer} - Your Correct Answer`);
        } else {
          btn.classList.add("wrong");
          btn.setAttribute("aria-label", `${answer} - Your Selection (Incorrect)`);
        }
      }
    }

    if (mode === "quiz") {
      if (state.selections[state.index] === i) {
        btn.classList.add("selected");
        btn.setAttribute("aria-checked", "true");
        state.selectedStatus = true;
      }
      
      btn.addEventListener("click", () => {
        state.selectedStatus = true;
        state.selections[state.index] = i;
        document.querySelectorAll(".answer").forEach((el) => {
          el.classList.remove("selected");
          el.setAttribute("aria-checked", "false");
        });
        btn.classList.add("selected");
        btn.setAttribute("aria-checked", "true");
        state.answers[state.index] = {
          answer: answer,
          correct: answer === data[state.index].answer,
        };
        
        // Enable Submit button if this is the last question
        if (state.index === data.length - 1) {
          DOM.btns.submitBtn.disabled = false;
        }
      });
    }
  });
}

DOM.btns.nextBtn.addEventListener("click", handleNextBtn);
DOM.btns.backBtn.addEventListener("click", handleBackBtn);
DOM.btns.submitBtn.addEventListener("click", handleSubmitBtn);
DOM.btns.retakeBtn.addEventListener("click", handleRetakeBtn);
DOM.btns.reviewBtn.addEventListener("click", handleReviewBtn);

function handleNextBtn() {
  if (state.reviewState === "quiz" && !state.selectedStatus) return;
  state.index++;
  state.selectedStatus = false;
  DOM.answerContainer.textContent = "";
  render(state.reviewState);
}

function handleBackBtn() {
  if (state.index > 0) {
    state.index--;
    DOM.answerContainer.textContent = "";
    render(state.reviewState);
  }
}

function handleSubmitBtn() {
  if (!state.selectedStatus) return;
  
  // Hide question view elements
  hideEl(DOM.answerContainer);
  hideEl(DOM.header);
  hideEl(DOM.btns.backBtn);
  hideEl(DOM.questionName);
  hideEl(DOM.btns.submitBtn);
  
  // Show score elements & review triggers
  showEl(DOM.btns.retakeBtn);
  showEl(DOM.btns.reviewBtn);
  showEl(DOM.scoreDisplay);
  
  state.scoreResult = Object.values(state.answers).filter(
    (a) => a.correct,
  ).length;

  if (DOM.scoreResult) DOM.scoreResult.textContent = state.scoreResult;
  if (DOM.totalResult) DOM.totalResult.textContent = questions.length;
  
  const percentage = Math.round((state.scoreResult / questions.length) * 100);
  if (DOM.scorePercentage) {
    let message = "";
    if (percentage === 100) message = "Perfect Score! 🌟 You are a JS Master!";
    else if (percentage >= 80) message = "Excellent work! 🚀 Deep JS understanding!";
    else if (percentage >= 50) message = "Good job! 👍 Keep practicing to master it.";
    else message = "Keep studying! 📚 You'll get better with practice.";
    
    DOM.scorePercentage.textContent = `${percentage}% - ${message}`;
  }
}

function handleRetakeBtn() {
  state.reviewState = "quiz";
  state.index = 0;
  state.scoreResult = 0;
  state.answers = {};
  state.selections = {};
  state.selectedStatus = false;
  
  DOM.answerContainer.textContent = "";
  render(state.reviewState);
  
  showEl(DOM.header);
  showEl(DOM.questionName);
  showEl(DOM.answerContainer);
  showEl(DOM.btns.backBtn);
  
  hideEl(DOM.btns.submitBtn);
  hideEl(DOM.btns.retakeBtn);
  hideEl(DOM.btns.reviewBtn);
  hideEl(DOM.scoreDisplay);
}

function handleReviewBtn() {
  state.reviewState = "review";
  state.index = 0;
  DOM.answerContainer.textContent = "";
  render(state.reviewState);
  
  showEl(DOM.header);
  showEl(DOM.questionName);
  showEl(DOM.answerContainer);
  
  showEl(DOM.btns.backBtn); // Enable back-navigation in review mode
  hideEl(DOM.btns.retakeBtn);
  hideEl(DOM.btns.reviewBtn);
  hideEl(DOM.btns.submitBtn);
  hideEl(DOM.scoreDisplay);
}
