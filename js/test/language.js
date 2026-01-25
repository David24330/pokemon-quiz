import { getCurrentLang } from "./state.js";
import { texts } from "./texts.js";
import { welcomeScreen, startBtn } from "./dom.js";
import { updateScore, updateTimer, regenerateCurrentQuestionUI } from "./ui.js";

export function updateWelcomeScreen(currentLang) {
    document.getElementById("welcome-title").textContent = texts.welcomeTitle[currentLang];
    document.getElementById("welcome-text").textContent = texts.welcomeText[currentLang];
    startBtn.textContent = texts.startBtn[currentLang];
}

export function updateAllTexts(currentLang) {
    if (welcomeScreen.style.display !== "none") updateWelcomeScreen(currentLang);
    updateScore();
    updateTimer();
    regenerateCurrentQuestionUI();
}
