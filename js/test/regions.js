import { loadGameData } from "./dataLoader.js";
import { getCurrentQuestionType, setCurrentQuestion, setCurrentCorrectId } from "./state.js";
import { generateRandomQuestion } from "./questions.js";

let selectedRegions = [];

export function initRegionSelection() {
    document.querySelectorAll("a[data-region]").forEach(link => {
        link.addEventListener("click", async e => {
            e.preventDefault();
            selectedRegions = [link.dataset.region];
            await loadGameData(selectedRegions);

            // regénérer la question si quiz déjà lancé
            generateRandomQuestion();
        });
    });
}
