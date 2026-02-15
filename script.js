// --- 1. DOM ELEMENTS ---
// Here we grab all the HTML elements we need to talk to. 
// We use 'const' because these references won't change throughout the game.
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

// --- 2. DATA STRUCTURE ---
// This is an Array of Objects. Each object is a "Question Package."
const quizQuestions = [
    {
        question: "What is the capital of France?",
        answers: [
            { text: "London", correct: false },
            { text: "Berlin", correct: false },
            { text: "Paris", correct: true },
            { text: "Madrid", correct: false },
        ],
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: [
            { text: "Venus", correct: false },
            { text: "Mars", correct: true },
            { text: "Jupiter", correct: false },
            { text: "Saturn", correct: false },
        ],
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: [
            { text: "Atlantic Ocean", correct: false },
            { text: "Indian Ocean", correct: false },
            { text: "Arctic Ocean", correct: false },
            { text: "Pacific Ocean", correct: true },
        ],
    },
    {
        question: "Which of these is NOT a programming language?",
        answers: [
            { text: "Java", correct: false },
            { text: "Python", correct: false },
            { text: "Banana", correct: true },
            { text: "JavaScript", correct: false },
        ],
    },
    {
        question: "What is the chemical symbol for gold?",
        answers: [
            { text: "Go", correct: false },
            { text: "Gd", correct: false },
            { text: "Au", correct: true },
            { text: "Ag", correct: false },
        ],
    },
];

// --- 3. STATE VARIABLES ---
// These keep track of the game's progress as the user clicks.
let currentQuestionIndex = 0; // Starts at 0 (the first question in the array)
let score = 0;                // Keeps track of correct answers
let answersDisabled = false;  // A "lock" to prevent clicking multiple answers at once

// Initialize the UI with the total number of questions
totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// --- 4. EVENT LISTENERS ---
// We tell the buttons to "listen" for a click and run a specific function
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

// --- 5. FUNCTIONS ---

function startQuiz() {
    // Reset the game state back to zero for a fresh start
    currentQuestionIndex = 0;
    score = 0; // Note: Setting score to 0 ensures internal logic matches the UI
    scoreSpan.textContent = 0;

    // Toggle visibility: Hide start, show quiz
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");

    showQuestion();
}

function showQuestion() {
    // Unlock the buttons for the new question
    answersDisabled = false;

    // Get the data for the current question based on the index
    const currentQuestion = quizQuestions[currentQuestionIndex];

    // Update the "Question X of Y" text
    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    // MATH: Calculate progress bar width (e.g., 1/5 = 20%)
    const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
    progressBar.style.width = progressPercent + "%";

    // Update the H2 with the actual question text
    questionText.textContent = currentQuestion.question;

    // Clear out the buttons from the PREVIOUS question
    answersContainer.innerHTML = "";

    // Loop through the answers array and create a button for each
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.classList.add("answer-btn");

        // We store the "correctness" inside a data-attribute
        // This is hidden from the user but readable by JS
        button.dataset.correct = answer.correct;

        button.addEventListener("click", selectAnswer);
        answersContainer.appendChild(button);
    });
}

function selectAnswer(event) {
    // If the user already clicked an answer, ignore further clicks
    if (answersDisabled) return;

    answersDisabled = true; // Lock the question
    const selectedButton = event.target;
    const isCorrect = selectedButton.dataset.correct === "true"; // Check the data-attribute

    // Visual Feedback: Loop through all buttons to show Right vs Wrong
    Array.from(answersContainer.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct"); // Turn green
        } else if (button === selectedButton) {
            button.classList.add("incorrect"); // Turn red if they picked wrong
        }
    });

    // Increment score if they were right
    if (isCorrect) {
        score++;
        scoreSpan.textContent = score;
    }

    // Wait 1 second so the user can see the feedback, then move on
    setTimeout(() => {
        currentQuestionIndex++;

        // Check if we have more questions or if we hit the end
        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1000);
}

function showResult() {
    // Switch screens
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");

    finalScoreSpan.textContent = score;

    // Logic to determine which message to show based on percentage
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage === 100) {
        resultMessage.textContent = "Perfect! You're a genius!";
    } else if (percentage >= 80) {
        resultMessage.textContent = "Great job! You know your stuff!";
    } else if (percentage >= 60) {
        resultMessage.textContent = "Good effort! Keep learning!";
    } else if (percentage >= 40) {
        resultMessage.textContent = "Not bad! Try again to improve!";
    } else {
        resultMessage.textContent = "Keep studying! You'll get better!";
    }
}

function restartQuiz() {
    // Clean up the results screen and jump back to the start logic
    resultScreen.classList.remove("active");
    startQuiz();
}

