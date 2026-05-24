let quizContainer = document.querySelector(".quiz-container");
let answerContainer = document.querySelector(".answer-container");
let questionNumber = document.querySelectorAll(".q-number");
let totalQuestions = document.querySelector(".total");
let questionName = document.querySelector(".q-name");
let header = document.querySelector(".header");
let index = 0;
let scoreResult = 0;
let review = [];

let correct = false;

let selectedIndex = 0;
let selectedStatus = false;

let reviewState = false;

async function getData() {
  let response = await fetch("./questions.json");
  let data = await response.json();

  if (index === data.length - 1) {
    hideEl(nextBtn);
    showEl(submitBtn);
  } else {
    showEl(nextBtn);
    hideEl(submitBtn);
  }

  if (index === 0) backBtn.disabled = true;
  else backBtn.disabled = false;

  questionNumber.forEach((q) => (q.textContent = index + 1));
  totalQuestions.textContent = data.length;
  questionName.textContent = data[index].question;

  let answers = data[index].options;
  answers.forEach((answer, i) => {
    let p = document.createElement("p");
    p.className = "answer";

    document.querySelectorAll(".answer").forEach((d) => {
      d.classList.remove("correct");
      d.classList.remove("wrong");
    });

    p.textContent = answer;
    answerContainer.append(p);
    p.addEventListener("click", () => {
      selectedStatus = true;

      document.querySelectorAll(".answer").forEach((d) => {
        d.classList.remove("selected");
      });
      p.classList.add("selected");
      if (p.textContent === data[index].answer) {
        correct = true;
        selectedIndex = i;
      } else {
        correct = false;
        selectedIndex = i;
      }
    });
  });
}

getData();

let nextBtn = document.getElementById("next-btn");

nextBtn.addEventListener("click", (e) => {
  if (selectedStatus) {
    if (correct) {
      ++scoreResult;
      review.push({ index: selectedIndex, correct: true });
    } else {
      review.push({ index: selectedIndex, correct: false });
    }
    index++;
    selectedStatus = false;
    correct = false;
    answerContainer.textContent = "";
    if (reviewState === false) {
      getData();
    } else {
      selectedStatus = true;
      showData();
      if (index === 9) {
        showEl(retakeBtn);
      } else {
        hideEl(retakeBtn);
      }
    }
  } else {
    e.preventDefault();
  }
});

let backBtn = document.getElementById("back-btn");
backBtn.addEventListener("click", () => {
  index--;
  answerContainer.textContent = "";
  getData();
});

let submitBtn = document.getElementById("submit-btn");
let score = document.querySelector(".score");
hideEl(score);
submitBtn.addEventListener("click", () => {
  if (correct) {
    ++scoreResult;
    review.push({ index: selectedIndex, correct: true });
  } else {
    review.push({ index: selectedIndex, correct: false });
  }
  showEl(score);
  document.querySelector(".score-result").textContent = scoreResult;
  hideEl(header);
  hideEl(questionName);
  hideEl(answerContainer);
  hideEl(backBtn);
  hideEl(submitBtn);
  showEl(retakeBtn);
  showEl(reviewBtn);
});

let retakeBtn = document.getElementById("retake-btn");
hideEl(retakeBtn);
retakeBtn.addEventListener("click", (e) => {
  reviewState = false;
  if (selectedStatus) {
    index = 0;
    scoreResult = 0;
    answerContainer.textContent = "";
    getData();
    header.style.display = "flex";
    showEl(questionName);
    showEl(answerContainer);
    showEl(backBtn);
    showEl(submitBtn);
    hideEl(retakeBtn);
    hideEl(reviewBtn);
    hideEl(score);
  } else {
    e.preventDefault();
  }
});

function hideEl(el) {
  el.classList.add("hidden");
}
function showEl(el) {
  el.classList.remove("hidden");
}

let reviewBtn = document.getElementById("review-btn");
hideEl(reviewBtn);
reviewBtn.addEventListener("click", () => {
  reviewState = true;
  index = 0;
  scoreResult = 0;
  answerContainer.textContent = "";
  showData();
  header.style.display = "flex";
  showEl(questionName);
  showEl(answerContainer);
  hideEl(backBtn);
  hideEl(retakeBtn);
  hideEl(reviewBtn);
  hideEl(submitBtn);
  hideEl(score);
});

async function showData() {
  answerContainer.textContent = "";
  let response = await fetch("./questions.json");
  let data = await response.json();

  if (index === data.length - 1) {
    hideEl(nextBtn);
  } else {
    showEl(nextBtn);
  }

  if (index === 0) backBtn.disabled = true;
  else backBtn.disabled = false;

  questionNumber.forEach((q) => (q.textContent = index + 1));
  totalQuestions.textContent = data.length;
  questionName.textContent = data[index].question;
  let answers = data[index].options;
  answers.forEach((answer, i) => {
    let p = document.createElement("p");
    p.className = "answer";
    p.textContent = answer;
    answerContainer.append(p);
    if (reviewState) {
      if (p.textContent === data[index].answer) {
        p.classList.add("correct");
      }
      if (review[index].index === i && review[index].correct) {
        p.classList.add("correct");
      } else if (review[index].index === i && review[index].correct === false) {
        p.classList.add("wrong");
      }
    }
  });
}
