// Inside MathQuiz.js

import React, { useState } from 'react';
import AdditionQuiz from './AdditionQuiz';
import SubtractionQuiz from './SubtractionQuiz';
// import MultiplicationQuiz from './MultiplicationQuiz';
// import DivisionQuiz from './DivisionQuiz';

const MathQuiz = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleQuizSelection = (quizType) => {
    setSelectedQuiz(quizType);
  };

  return (
    <div>
      <h1>Math Quiz</h1>
      <div>
        <button onClick={() => handleQuizSelection('addition')}>Addition Quiz</button>
        <button onClick={() => handleQuizSelection('subtraction')}>Subtraction Quiz</button>
        <button onClick={() => handleQuizSelection('multiplication')}>Multiplication Quiz</button>
        <button onClick={() => handleQuizSelection('division')}>Division Quiz</button>
      </div>
      {selectedQuiz === 'addition' && <AdditionQuiz operator="+" />}
      {selectedQuiz === 'subtraction' && <SubtractionQuiz operator="-" />}
      {/* {selectedQuiz === 'multiplication' && <MultiplicationQuiz operator="x" />}
      {selectedQuiz === 'division' && <DivisionQuiz operator="/" />} */}
    </div>
  );
};

export default MathQuiz;
