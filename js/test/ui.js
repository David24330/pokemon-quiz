import * as state from "./state.js";
import { optionsEl, scoreEl, timerEl } from "./dom.js";
import { texts } from "./texts.js";
import { generateRandomQuestion } from "./questions.js";

export function createOption(pokemon, correctId) {
    const div = document.createElement("div");
    div.className = "option";

    const img = document.createElement("img");
    img.src = state.IMAGE_PATH + pokemon.icon;
    img.alt = pokemon.name[state.getCurrentLang()];
    div.appendChild(img);

    div.onclick = () => handleAnswer(div, pokemon.id === correctId);
    optionsEl.appendChild(div);
}

export function updateScore() {
    scoreEl.textContent = `${texts.score[state.getCurrentLang()]}: ${state.getScore()}`;
}

export function updateTimer() {
    timerEl.textContent = `${texts.timer[state.getCurrentLang()]}: ${state.getTimer()}s`;
}

function handleAnswer(div, isCorrect) {
    if (isCorrect) {
        div.style.borderColor = "green";
        state.setScore(state.getScore() + 1);
        updateScore();

        const plusOne = document.createElement("span");
        plusOne.className = "plus-one";
        plusOne.textContent = "+1";
        scoreEl.appendChild(plusOne);
        setTimeout(() => plusOne.remove(), 1000);
    } else {
        div.style.borderColor = "red";
        const penalty = Math.min(10, state.getTimer());
        let i = 0;
        const interval = setInterval(() => {
            if (i < penalty) { state.setTimer(state.getTimer() - 1); updateTimer(); i++; }
            else { clearInterval(interval); }
        }, 50);
    }

    Array.from(optionsEl.children).forEach(opt => opt.style.pointerEvents = "none");
    setTimeout(generateRandomQuestion, 500);
}

export function endGame() {
    clearInterval(state.getTimerInterval());
    optionsEl.innerHTML = "";
    document.getElementById("question").textContent = texts.timeUp[state.getCurrentLang()];
    updateScore();

    const restartBtn = document.createElement("button");
    restartBtn.textContent = texts.playAgain[state.getCurrentLang()];
    restartBtn.onclick = () => window.location.reload();
    optionsEl.appendChild(restartBtn);
}
