import * as state from "./state.js";
import { updateScore, updateTimer, endGame } from "./ui.js";
import { generateRandomQuestion } from "./questions.js";

export function startGame() {
    state.setScore(0);
    state.setTimer(300);
    updateScore();
    updateTimer();

    state.setTimerInterval(setInterval(() => {
        state.setTimer(state.getTimer() - 1);
        updateTimer();
        if (state.getTimer() <= 0) {
            clearInterval(state.getTimerInterval());
            endGame();
        }
    }, 1000));

    generateRandomQuestion();
}
