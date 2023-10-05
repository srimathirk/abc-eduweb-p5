import React, { useState } from 'react';
import QuizForm from './QuizForm';
import QuizReport from './QuizReport';

const AdditionQuiz = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [operator, setOperator] = useState('+'); // Added operator state
  
  const generateRandomNumbers = () => {
    // const newOperator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
    // setOperator(newOperator);

    setNum1(Math.floor(Math.random() * 11));
    setNum2(Math.floor(Math.random() * 11));
  };

  const handleAnswerSubmit = (answer) => {
    const userAnswer = parseInt(answer, 10);
    const correctAnswer = num1 + num2;

    setUserAnswers([...userAnswers, { num1, num2, userAnswer, correctAnswer }]);
    if (userAnswer === correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < 10) {
      setCurrentQuestion(currentQuestion + 1);
      generateRandomNumbers(); // Generate new numbers for the next question
    } else {
      setCurrentQuestion(11); // Reset to the beginning
      setNum1(0);
      setNum2(0);
    }
  };
  // const handleOperatorChange = (newOperator) => {
  //   setOperator(newOperator);
  // };
  const handleRestartQuiz = () => {
    setScore(0);
    setCurrentQuestion(1);
    setUserAnswers([]);
  };

  // ... (previous code)

return (
  <div>
    {currentQuestion <= 10 ? (
      <div>
        <h2>Question {currentQuestion}</h2>
        <QuizForm
          num1={num1}
          num2={num2}
          operator={operator}
          onAnswerSubmit={handleAnswerSubmit}
        />
        {/* <div>
            <button onClick={() => handleOperatorChange('+')}>+</button>
            <button onClick={() => handleOperatorChange('-')}>-</button>
            <button onClick={() => handleOperatorChange('*')}>*</button>
            <button onClick={() => handleOperatorChange('/')}>/</button>
          </div> */}
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
export default AdditionQuiz;
