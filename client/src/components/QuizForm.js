import React, { useState } from 'react';

const QuizForm = ({ num1, num2, operator, onAnswerSubmit }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnswerSubmit(answer);
    setAnswer('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {num1} {operator} {num2} =
      </div>
      <input
        type="number"
        step="0.01" //for decimal float values
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default QuizForm;
