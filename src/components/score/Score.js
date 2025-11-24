import React from "react";
import "./Score.css";

function Score({ score, total }) {
  return (
    <div className="score-container">
      <h2>Quiz terminé !</h2>
      <p>
        Votre score : {score} / {total}
      </p>
      <button
        className="replay-btn"
        onClick={() => window.location.reload()}
      >
        Rejouer
      </button>
    </div>
  );
}

export default Score;
