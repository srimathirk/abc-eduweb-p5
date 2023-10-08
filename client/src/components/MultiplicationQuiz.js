import React, { useState } from 'react';
import QuizForm from './QuizForm';
import QuizReport from './QuizReport';

const MultiplicationQuiz = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
//   const [operator, setOperator] = useState('×'); // Added operator state
  const operator = '×'
  const generateRandomNumbers = () => { //Generating random numbers for quiz
    
    setNum1(Math.floor(Math.random() * 11));
    setNum2(Math.floor(Math.random() * 11));
  };

  const handleAnswerSubmit = (answer) => { //handle answer submit
    const userAnswer = parseInt(answer, 10);
    const correctAnswer = num1 * num2;

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
export default MultiplicationQuiz;
