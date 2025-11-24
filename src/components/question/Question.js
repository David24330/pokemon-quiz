import React from "react";
import Option from "../Options/Option";
import "./Question.css";

function Question({ question, onAnswer }) {
  return (
    <div className="question-container">
      <h2>{question.text}</h2>
      {question.image && (
        <img
          src={`/images/${question.image}`}
          alt="pokemon"
          className="pokemon-img"
        />
      )}
      <div>
        {question.options.map((opt) => (
          <Option key={opt} text={opt} onClick={onAnswer} />
        ))}
      </div>
    </div>
  );
}

export default Question;
