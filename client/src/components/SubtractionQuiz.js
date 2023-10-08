import React, { useState } from 'react';
import QuizForm from './QuizForm';
import QuizReport from './QuizReport';

const SubtractionQuiz = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
//   const [operator, setOperator] = useState('-'); // Subtraction operator state
  const operator = '-';
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
  

  const handleAnswerSubmit = (answer) => { //handle answer submit
    const userAnswer = parseInt(answer, 10);
    const correctAnswer = num1 - num2;

    //if answer is correct increase score
    setUserAnswers([...userAnswers, { num1, num2, userAnswer, correctAnswer }]);
    if (userAnswer === correctAnswer) {
      setScore(score + 1);
    }

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
        <QuizForm  //props for quiz form
           num1={num1}
          num2={num2}
          operator={operator}
          onAnswerSubmit={handleAnswerSubmit}
        />
        
      </div>
    ) : (
      <div> 
         <QuizReport userAnswers={userAnswers} score={score} operator={operator}/> 
        <button onClick={handleRestartQuiz}>Restart Quiz</button>
      </div>
    )}

    {currentQuestion === 0 && (
      <button onClick={generateRandomNumbers}>Start Quiz</button>
    )}
  </div>
);
    }
export default SubtractionQuiz;
