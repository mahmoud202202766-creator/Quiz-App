const DOM = {
  quizContainer: document.querySelector(".quiz-container"),
  answerContainer: document.querySelector(".answer-container"),
  questionNumbers: document.querySelectorAll(".q-number"),
  totalQuestions: document.querySelector(".total"),
  questionName: document.querySelector(".q-name"),
  header: document.querySelector(".header"),
  score: document.querySelector(".score"),
  scoreResult: document.querySelector(".score-result"),
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

let questions = [];
async function init() {
  try {
    let res = await fetch("./questions.json");
    if (!res.ok) throw new Error("Failed to load questions");
    questions = await res.json();
    render("quiz");
  } catch (err) {
    DOM.quizContainer.innerHTML = `
      <p style="color:red">
        ${err}
      </p>
    `;
  }
}
init();

function hideEl(el) {
  el.classList.add("hidden");
}
function showEl(el) {
  el.classList.remove("hidden");
}

function handleIndexCases(index, length) {
  if (index === length - 1) {
    hideEl(DOM.btns.nextBtn);
    showEl(DOM.btns.submitBtn);
  } else {
    showEl(DOM.btns.nextBtn);
    hideEl(DOM.btns.submitBtn);
  }
  if (index === 0) DOM.btns.backBtn.disabled = true;
  else DOM.btns.backBtn.disabled = false;
}

function getQuestionNumber(index) {
  DOM.questionNumbers.forEach((q) => (q.textContent = index + 1));
}

function getTotalQuestions(length) {
  DOM.totalQuestions.textContent = length;
}

function getQuestionName(data, index) {
  DOM.questionName.textContent = data[index].question;
}

function render(mode) {
  let data = questions;
  handleIndexCases(state.index, data.length);
  getQuestionNumber(state.index);
  getTotalQuestions(data.length);
  getQuestionName(data, state.index);

  let answers = data[state.index].options;
  answers.forEach((answer, i) => {
    let p = document.createElement("p");
    p.className = "answer";
    p.textContent = answer;
    DOM.answerContainer.append(p);

    if (mode === "review") {
      if (p.textContent === data[state.index].answer) {
        p.classList.add("correct");
      }
      if (
        state.selections[state.index] === i &&
        state.answers[state.index].correct
      ) {
        p.classList.add("correct");
      } else if (
        state.selections[state.index] === i &&
        state.answers[state.index].correct === false
      ) {
        p.classList.add("wrong");
      }
      console.log(state.answers[state.index].correct);
    }

    if (mode === "quiz") {
      if (state.selections[state.index] === i) {
        p.classList.add("selected");
        state.selectedStatus = true;
      }
      p.addEventListener("click", () => {
        state.selectedStatus = true;
        state.selections[state.index] = i;
        document.querySelectorAll(".answer").forEach((d) => {
          d.classList.remove("selected");
        });
        p.classList.add("selected");
        state.answers[state.index] = {
          answer: p.textContent,
          correct: p.textContent === data[state.index].answer,
        };
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
  console.log(state.answers);
}

function handleBackBtn() {
  state.index--;
  DOM.answerContainer.textContent = "";
  render(state.reviewState);
}

function handleSubmitBtn() {
  if (!state.selectedStatus) return;
  hideEl(DOM.answerContainer);
  hideEl(DOM.header);
  hideEl(DOM.btns.backBtn);
  hideEl(DOM.questionName);
  hideEl(DOM.btns.submitBtn);
  showEl(DOM.btns.retakeBtn);
  showEl(DOM.btns.reviewBtn);
  showEl(DOM.score);

  state.scoreResult = Object.values(state.answers).filter(
    (a) => a.correct,
  ).length;

  DOM.scoreResult.textContent = state.scoreResult;
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
  hideEl(DOM.score);
}

function handleReviewBtn() {
  state.reviewState = "review";
  state.index = 0;
  DOM.answerContainer.textContent = "";
  render(state.reviewState);
  showEl(DOM.header);
  showEl(DOM.questionName);
  showEl(DOM.answerContainer);
  hideEl(DOM.btns.backBtn);
  hideEl(DOM.btns.retakeBtn);
  hideEl(DOM.btns.reviewBtn);
  hideEl(DOM.btns.submitBtn);
  hideEl(DOM.score);
}
