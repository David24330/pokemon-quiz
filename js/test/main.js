import { loadGameData } from "./dataLoader.js";
import { languageSelect, startBtn, welcomeScreen, quizScreen } from "./dom.js";
import { setCurrentLang, getCurrentLang } from "./state.js";
import { updateAllTexts } from "./language.js";
import { startGame } from "./game.js";
import { initRegionSelection } from "./regions.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadGameData(); // charger toutes les régions par défaut
    updateAllTexts(getCurrentLang());

    languageSelect.onchange = () => {
        setCurrentLang(languageSelect.value);
        updateAllTexts(getCurrentLang());
    };

    startBtn.onclick = () => {
        welcomeScreen.style.display = "none";
        quizScreen.style.display = "block";
        startGame();
    };

    initRegionSelection();
});
