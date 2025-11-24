import React, { useState } from "react";
import Question from "../question/Question";
import Score from "../score/Score";
import "./Quiz.css";

function Quiz({ questions }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (answer) => {
    if (answer === questions[current].answer) setScore(score + 1);
    setCurrent(current + 1);
  };

  if (current >= questions.length) {
    return <Score score={score} total={questions.length} />;
  }

  return (
    <div className="quiz-container">
      <Question question={questions[current]} onAnswer={handleAnswer} />
    </div>
  );
}

export default Quiz;
