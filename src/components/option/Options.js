import React from "react";
import "./Option.css";

function Option({ text, onClick }) {
  return (
    <button className="option-btn" onClick={() => onClick(text)}>
      {text}
    </button>
  );
}

export default Option;
