import * as state from "./state.js";
import { getRandomItem, shuffle } from "./utils.js";
import { createOption } from "./ui.js";
import { questionEl } from "./dom.js";

export function generateRandomQuestion() {
    Math.random() < 0.5 ? generateTypeQuestion() : generateRouteQuestion();
}

export function regenerateCurrentQuestionUI() {
    const current = state.getCurrentQuestion();
    if (!current) return;

    const answers = current.map(id => state.getData().Pokemons.find(p => p.id === id));
    document.getElementById("options").innerHTML = "";

    if (state.getCurrentQuestionType() === "type") {
        const type = state.getCurrentRouteOrType();
        questionEl.textContent =
            state.getCurrentLang() === "fr" ? `Quel Pokémon appartient au type ${type.name.fr} ?` :
            state.getCurrentLang() === "es" ? `¿Qué Pokémon pertenece al tipo ${type.name.es}?` :
            `Which Pokémon belongs to the ${type.name.en} type?`;
    } else if (state.getCurrentQuestionType() === "route") {
        const route = state.getCurrentRouteOrType();
        questionEl.textContent =
            state.getCurrentLang() === "fr" ? `Quel Pokémon apparaît sur ${route.name.fr} ?` :
            state.getCurrentLang() === "es" ? `¿Qué Pokémon aparece en ${route.name.es}?` :
            `Which Pokémon appears on ${route.name.en}?`;
    }

    answers.forEach(p => createOption(p, state.getCurrentCorrectId()));
}

function generateTypeQuestion() {
    const data = state.getData();
    const type = getRandomItem(data.Types);
    const matching = data.Pokemons.filter(p => p.type.includes(type.id));
    if (!matching.length) return generateRouteQuestion();

    const correct = getRandomItem(matching);
    const wrong = shuffle(data.Pokemons.filter(p => !p.type.includes(type.id))).slice(0, 3);
    const answers = shuffle([correct, ...wrong]);

    state.setCurrentQuestion(answers.map(p => p.id));
    state.setCurrentCorrectId(correct.id);
    state.setCurrentQuestionType("type");
    state.setCurrentRouteOrType(type);

    document.getElementById("options").innerHTML = "";
    questionEl.textContent =
        state.getCurrentLang() === "fr" ? `Quel Pokémon appartient au type ${type.name.fr} ?` :
        state.getCurrentLang() === "es" ? `¿Qué Pokémon pertenece al tipo ${type.name.es}?` :
        `Which Pokémon belongs to the ${type.name.en} type?`;

    answers.forEach(p => createOption(p, correct.id));
}

function generateRouteQuestion() {
    const data = state.getData();
    const routes = data.Places.filter(r => r.pokemonIds?.length);
    if (!routes.length) return generateTypeQuestion();

    const route = getRandomItem(routes);
    const routePokemons = data.Pokemons.filter(p => route.pokemonIds.includes(p.id));
    const correct = getRandomItem(routePokemons);
    const wrong = shuffle(data.Pokemons.filter(p => !route.pokemonIds.includes(p.id))).slice(0, 3);
    const answers = shuffle([correct, ...wrong]);

    state.setCurrentQuestion(answers.map(p => p.id));
    state.setCurrentCorrectId(correct.id);
    state.setCurrentQuestionType("route");
    state.setCurrentRouteOrType(route);

    document.getElementById("options").innerHTML = "";
    questionEl.textContent =
        state.getCurrentLang() === "fr" ? `Quel Pokémon apparaît sur ${route.name.fr} ?` :
        state.getCurrentLang() === "es" ? `¿Qué Pokémon aparece en ${route.name.es}?` :
        `Which Pokémon appears on ${route.name.en}?`;

    answers.forEach(p => createOption(p, correct.id));
}
