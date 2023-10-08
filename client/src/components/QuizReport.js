import React from "react";

const QuizReport = ({ userAnswers, score, operator }) => {
  return (
    <div>
      <h2>Quiz Report</h2>
      <div>
        <div>Score: {score}/10</div>
        <ul>
          {userAnswers.map((answer, index) => (
            <li key={index}>
              Question {index + 1}: {answer.num1} {operator} {answer.num2} ={" "}
              {answer.userAnswer} (
              {Math.round(answer.userAnswer * 10) / 10 ===
              Math.round(answer.correctAnswer * 10) / 10
                ? `Correct (Answer: ${
                    Math.round(answer.correctAnswer * 10) / 10
                  })`
                : `Incorrect (Answer: ${
                    Math.round(answer.correctAnswer * 10) / 10
                  })`}
              )
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuizReport;
