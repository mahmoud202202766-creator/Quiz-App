let questionNumber = document.querySelectorAll(".q-number");
let totalQuestions = document.querySelector(".total");
let questionName = document.querySelector(".q-name");
let answerContainer = document.querySelector(".answer-container");
let nextBtn = document.getElementById("next-btn");
let backBtn = document.getElementById("back-btn");
let submitBtn = document.getElementById("submit-btn");
let quizContainer = document.querySelector(".quiz-container");
console.log(questionNumber);

let index = 0;
let score = 0;

function getData() {
  fetch("./questions.json")
    .then((response) => response.json())
    .then((data) => {
      if (index === data.length - 1) {
        nextBtn.style.display = "none";
        submitBtn.style.display = "block";
      } else {
        nextBtn.style.display = "block";
        submitBtn.style.display = "none";
      }

      if (index === 0) backBtn.disabled = true;
      else backBtn.disabled = false;

      questionNumber.forEach((q) => (q.textContent = index + 1));
      totalQuestions.textContent = data.length;
      questionName.textContent = data[index].question;

      let answers = data[index].options;
      answers.forEach((answer) => {
        let p = document.createElement("p");
        p.className = "answer";
        p.textContent = answer;
        answerContainer.append(p);
        p.addEventListener("click", () => {
          console.log(p);
          if (p.textContent === data[index].answer) {
            score++;
          }
        });
      });
    });
}

getData();

nextBtn.addEventListener("click", () => {
  index++;
  answerContainer.textContent = "";
  getData();
});
backBtn.addEventListener("click", () => {
  index--;
  answerContainer.textContent = "";
  getData();
});

submitBtn.addEventListener("click", () => {
  quizContainer.textContent = `your score is ${score}`;
});
