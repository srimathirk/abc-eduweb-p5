import React, { useState } from "react";
import QuizForm from "./QuizForm";
import QuizReport from "./QuizReport";

const DivisionQuiz = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  //   const [operator, setOperator] = useState('+'); // Added operator state

  const operator = "/";

  const generateRandomNumbers = () => {
    let newNum1 = Math.floor(Math.random() * 11);
    let newNum2 = Math.floor(Math.random() * 11);

    // Check if num1 is greater than or equal to num2
    while (newNum1 <= newNum2) {
      newNum1 = Math.floor(Math.random() * 11);
      newNum2 = Math.floor(Math.random() * 11);
    }

    setNum1(newNum1);
    setNum2(newNum2);
  };

  const handleAnswerSubmit = (answer) => {
    //handle answer submit
    const userAnswer = parseFloat(answer);
    const correctAnswer = num1 / num2;

    // Round both answers to one decimal place
    const userAnswerRounded = Math.round(userAnswer * 10) / 10;
    const correctAnswerRounded = Math.round(correctAnswer * 10) / 10;

    // Check if the rounded answers are equal
    if (userAnswerRounded === correctAnswerRounded) {
      setScore(score + 1);
    }

    setUserAnswers([...userAnswers, { num1, num2, userAnswer, correctAnswer }]);

    //setting only for 10 queestions
    if (currentQuestion < 10) {
      setCurrentQuestion(currentQuestion + 1);
      generateRandomNumbers(); // Generate new numbers for the next question
    } else {
      setCurrentQuestion(11); // Reset to the beginning
      setNum1(0);
      setNum2(0);
    }
  };

  //if quiz completes restart quiz
  const handleRestartQuiz = () => {
    setScore(0);
    setCurrentQuestion(1);
    setUserAnswers([]);
  };

  return (
    <div>
      {currentQuestion <= 10 ? (
        <div>
          <h2>Question {currentQuestion}</h2>
          <QuizForm //props for quiz form
            num1={num1}
            num2={num2}
            operator={operator}
            onAnswerSubmit={handleAnswerSubmit}
          />
        </div>
      ) : (
        <div>
          <QuizReport
            userAnswers={userAnswers}
            score={score}
            operator={operator}
          />
          <button onClick={handleRestartQuiz}>Restart Quiz</button>
        </div>
      )}

      {currentQuestion === 0 && (
        <button onClick={generateRandomNumbers}>Start Quiz</button>
      )}
    </div>
  );
};
export default DivisionQuiz;
