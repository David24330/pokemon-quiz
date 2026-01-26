// ======================== Variables ========================
let data = null;
let score = 0;
let timer = 300;
let timerInterval = null;
let currentLang = "en";

let currentQuestion = null; // stocke la question actuelle
let currentCorrectId = null;
let currentQuestionType = null; // "type" ou "route"
let currentRouteOrType = null; // stocke l'objet type ou route utilisé

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");

const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const startBtn = document.getElementById("start-quiz-btn");
const languageSelect = document.getElementById("language-select");

const IMAGE_PATH = "pictures/pokemon/icons/";

// ======================== Texte multilingue ========================
const texts = {
    welcomeTitle: { en: "Welcome to the Pokémon Quiz!", fr: "Bienvenue au Quiz Pokémon !", es: "¡Bienvenido al Quiz Pokémon!" },
    welcomeText: { en: "Test your knowledge of Pokémon. Can you answer all the questions?", fr: "Teste tes connaissances sur les Pokémon. Peux-tu répondre à toutes les questions ?", es: "Pon a prueba tus conocimientos sobre Pokémon. ¿Puedes responder a todas las preguntas?" },
    startBtn: { en: "Start Quiz", fr: "Commencer le Quiz", es: "Iniciar Quiz" },
    score: { en: "Score", fr: "Score", es: "Puntos" },
    timer: { en: "Time left", fr: "Temps restant", es: "Tiempo restante" },
    playAgain: { en: "Play Again", fr: "Rejouer", es: "Jugar de Nuevo" },
    timeUp: { en: "Time's up!", fr: "Temps écoulé !", es: "¡Se acabó el tiempo!" }
};

// ======================== Utils ========================
function getRandomItem(array) { return array[Math.floor(Math.random() * array.length)]; }
function shuffle(array) { return array.sort(() => Math.random() - 0.5); }

// ======================== Question registry ========================
const questionGenerators = [];

function registerQuestion(generatorFn) {
    questionGenerators.push(generatorFn);
}


// ======================== Charger JSON ========================
async function loadGameData(regions = []) {
    const regionFetches = [];

    if (regions.length === 0) {
        // Mode "tout"
        regionFetches.push(
            fetch("data/region/kanto.json").then(r => r.json()),
            fetch("data/region/johto.json").then(r => r.json())
            // tu ajouteras Hoenn, Sinnoh, etc ici
        );
    } else {
        regions.forEach(region => {
            regionFetches.push(
                fetch(`data/region/${region}.json`).then(r => r.json())
            );
        });
    }

    const [regionsData, typesData, trainersData] = await Promise.all([
        Promise.all(regionFetches),
        fetch("data/types/types.json").then(r => r.json()),
        fetch("data/trainers/trainers.json").then(r => r.json())
    ]);

    data = {
        Pokemons: regionsData.flatMap(r => r.Pokemons),
        Places: regionsData.flatMap(r => r.Places),
        Types: typesData.types,
        Trainers: trainersData.Trainers
    };
}



// ======================== Sélection région ========================
let selectedRegions = [];

// Gestion du clic sur chaque lien de région
document.querySelectorAll("a[data-region]").forEach(link => {
    link.addEventListener("click", async (e) => {
        e.preventDefault();

        const region = link.dataset.region;

        // Toggle sélection : si déjà sélectionnée, on retire ; sinon on ajoute
        if (selectedRegions.includes(region)) {
            selectedRegions = selectedRegions.filter(r => r !== region);
            link.classList.remove("active");
        } else {
            selectedRegions.push(region);
            link.classList.add("active");
        }

        // Charge les données pour toutes les régions sélectionnées
        if (selectedRegions.length === 0) {
            await loadGameData(); // aucune sélection = toutes les régions
        } else {
            await loadGameData(selectedRegions);
        }

        // Si le quiz est déjà lancé, régénère une question avec les nouvelles données
        if (quizScreen.style.display !== "none") {
            generateRandomQuestion();
        }
    });
});


// ======================== Menu langue ========================
languageSelect.onchange = () => {
    currentLang = languageSelect.value;
    updateAllTexts();
};

// ======================== Met à jour tous les textes ========================
function updateAllTexts() {
    // Accueil
    if (welcomeScreen.style.display !== "none") updateWelcomeScreen();

    // Score et timer
    updateScore();
    updateTimer();

    // Question en cours
    if (quizScreen.style.display !== "none" && currentQuestion) {
        regenerateCurrentQuestion();
    }
}

// ======================== Accueil ========================
function updateWelcomeScreen() {
    document.getElementById("welcome-title").textContent = texts.welcomeTitle[currentLang];
    document.getElementById("welcome-text").textContent = texts.welcomeText[currentLang];
    startBtn.textContent = texts.startBtn[currentLang];
}

// ======================== Start Quiz ========================
startBtn.onclick = () => {
    welcomeScreen.style.display = "none";
    quizScreen.style.display = "block";
    startGame();
};

function startGame() {
    score = 0;
    timer = 300;
    updateScore();
    updateTimer();

    timerInterval = setInterval(() => {
        timer--;
        updateTimer();
        if (timer <= 0) endGame();
    }, 1000);

    generateRandomQuestion();
}

// ======================== Génération de questions ========================
function generateRandomQuestion() {
    if (questionGenerators.length === 0) return;

    const generator = getRandomItem(questionGenerators);
    generator();
}




//======================== Gestion question description ========================
function generateRandomDescriptionQuestion() {
    optionsEl.innerHTML = "";

    currentQuestionType = "description";

    // 1️⃣ Pokémon ayant une description dans la langue courante
    const validPokemons = data.Pokemons.filter(
        p => p.description && p.description[currentLang]
    );

    if (validPokemons.length < 4) {
        generateRandomTypeQuestion();
        return;
    }

    // 2️⃣ Pokémon correct
    const correctPokemon = getRandomItem(validPokemons);
    currentCorrectId = correctPokemon.id;

    // 3️⃣ Mauvaises réponses
    const wrongPokemons = shuffle(
        validPokemons.filter(p => p.id !== correctPokemon.id)
    ).slice(0, 3);

    const answers = shuffle([correctPokemon, ...wrongPokemons]);
    currentQuestion = answers.map(p => p.id);

    currentRouteOrType = correctPokemon;

    // 4️⃣ Texte de la question
    questionEl.textContent =
        currentLang === "fr"
            ? `Quel est ce Pokémon ?`
            : currentLang === "es"
            ? `¿Qué Pokémon es este?`
            : `Which Pokémon is this?`;

    // 5️⃣ Affichage de la description
    const desc = document.createElement("p");
    desc.className = "pokemon-description";
    desc.textContent = correctPokemon.description[currentLang];
    questionEl.appendChild(desc);

    // 6️⃣ Affichage des réponses
    answers.forEach(pokemon =>
        createOption(pokemon, correctPokemon.id)
    );
}


//======================== Création question statistique ========================
function generateRandomStatQuestion() {
    optionsEl.innerHTML = "";
    currentQuestionType = "stat";

    const statsList = [
        { key: "hp", fr: "PV", en: "HP", es: "PS" },
        { key: "attack", fr: "l'attaque", en: "attack", es: "el ataque" },
        { key: "defense", fr: "la défense", en: "defense", es: "la defensa" },
        { key: "specialAttack", fr: "l'attaque spéciale", en: "special attack", es: "el ataque especial" },
        { key: "specialDefense", fr: "la défense spéciale", en: "special defense", es: "la defensa especial" },
        { key: "speed", fr: "la vitesse", en: "speed", es: "la velocidad" }
    ];

    const stat = getRandomItem(statsList);
    currentRouteOrType = stat;

    const pokemons = shuffle(
        data.Pokemons.filter(
            p => p.baseStats && p.baseStats[stat.key] !== undefined
        )
    ).slice(0, 4);

    if (pokemons.length < 4) {
        generateRandomTypeQuestion();
        return;
    }

    // 🔀 NOUVEAU : choix aléatoire (haut ou bas)
    const isHighest = Math.random() < 0.5;

    const sorted = [...pokemons].sort((a, b) =>
        isHighest
            ? b.baseStats[stat.key] - a.baseStats[stat.key]
            : a.baseStats[stat.key] - b.baseStats[stat.key]
    );

    const correctPokemon = sorted[0];
    currentCorrectId = correctPokemon.id;

    currentQuestion = pokemons.map(p => p.id);

    // 📝 Texte dynamique
    questionEl.textContent =
        currentLang === "fr"
            ? isHighest
                ? `Lequel de ces Pokémon a le plus de ${stat.fr} ?`
                : `Lequel de ces Pokémon a le moins de ${stat.fr} ?`
            : currentLang === "es"
            ? isHighest
                ? `¿Cuál de estos Pokémon tiene más ${stat.es}?`
                : `¿Cuál de estos Pokémon tiene menos ${stat.es}?`
            : isHighest
                ? `Which of these Pokémon has the highest ${stat.en}?`
                : `Which of these Pokémon has the lowest ${stat.en}?`;

    shuffle(pokemons).forEach(pokemon =>
        createOption(pokemon, correctPokemon.id)
    );
}



//======================== Génération question entraîneur ========================
function generateRandomTrainerQuestion() {
    optionsEl.innerHTML = "";

    const trainer = getRandomItem(data.Trainers);
    currentQuestionType = "trainer";
    currentRouteOrType = trainer;

    const trainerPokemons = data.Pokemons.filter(p => trainer.Pokemons.includes(p.id));
    if (!trainerPokemons.length) { 
        generateRandomTypeQuestion(); 
        return; 
    }

    const correctPokemon = getRandomItem(trainerPokemons);
    currentCorrectId = correctPokemon.id;

    const wrongPokemons = shuffle(data.Pokemons.filter(p => !trainer.Pokemons.includes(p.id))).slice(0, 3);
    const answers = shuffle([correctPokemon, ...wrongPokemons]);
    currentQuestion = answers.map(p => p.id);

    questionEl.textContent = currentLang === "fr" ? `Quel Pokémon appartient à ${trainer.name} ?` :
                            currentLang === "es" ? `¿Qué Pokémon pertenece a ${trainer.name}?` :
                            `Which Pokémon belongs to ${trainer.name}?`;

    answers.forEach(pokemon => createOption(pokemon, correctPokemon.id));
}

//======================== Génération question type ========================
function generateRandomTypeQuestion() {
    optionsEl.innerHTML = "";
    const type = getRandomItem(data.Types);
    currentQuestionType = "type";
    currentRouteOrType = type;

    const matchingPokemons = data.Pokemons.filter(p => p.type.includes(type.id));
    if (!matchingPokemons.length) { generateRandomRouteQuestion(); return; }

    const correctPokemon = getRandomItem(matchingPokemons);
    currentCorrectId = correctPokemon.id;

    const wrongPokemons = shuffle(data.Pokemons.filter(p => !p.type.includes(type.id))).slice(0, 3);
    const answers = shuffle([correctPokemon, ...wrongPokemons]);

    currentQuestion = answers.map(p => p.id); // stocke les ids pour regénération

    questionEl.textContent = currentLang === "fr" ? `Quel Pokémon appartient au type ${type.name.fr} ?` :
                            currentLang === "es" ? `¿Qué Pokémon pertenece al tipo ${type.name.es}?` :
                            `Which Pokémon belongs to the ${type.name.en} type?`;

    answers.forEach(pokemon => createOption(pokemon, correctPokemon.id));
}

//======================== Génération question route ========================
function generateRandomRouteQuestion() {
    optionsEl.innerHTML = "";

    const routesWithPokemon = data.Places.filter(r => Array.isArray(r.pokemonIds) && r.pokemonIds.length > 0);
    if (!routesWithPokemon.length) { generateRandomTypeQuestion(); return; }

    const route = getRandomItem(routesWithPokemon);
    currentQuestionType = "route";
    currentRouteOrType = route;

    const routePokemons = data.Pokemons.filter(p => route.pokemonIds.includes(p.id));
    if (!routePokemons.length) { generateRandomTypeQuestion(); return; }

    const correctPokemon = getRandomItem(routePokemons);
    currentCorrectId = correctPokemon.id;

    const wrongPokemons = shuffle(data.Pokemons.filter(p => !route.pokemonIds.includes(p.id))).slice(0,3);
    const answers = shuffle([correctPokemon, ...wrongPokemons]);
    currentQuestion = answers.map(p => p.id);

    questionEl.textContent = currentLang === "fr" ? `Quel Pokémon apparaît sur ${route.name.fr} ?` :
                            currentLang === "es" ? `¿Qué Pokémon aparece en ${route.name.es}?` :
                            `Which Pokémon appears on ${route.name.en}?`;

    answers.forEach(pokemon => createOption(pokemon, correctPokemon.id));
}

// ======================== Créer une option ========================
function createOption(pokemon, correctId) {
    const div = document.createElement("div");
    div.className = "option";

    const img = document.createElement("img");
    img.src = IMAGE_PATH + pokemon.icon;
    img.alt = pokemon.name[currentLang];
    div.appendChild(img);

    div.onclick = () => handleAnswer(div, pokemon.id === correctId);

    optionsEl.appendChild(div);
}

// ======================== Re-générer la question actuelle ========================
function regenerateCurrentQuestion() {
    const answers = currentQuestion.map(id => data.Pokemons.find(p => p.id === id));
    optionsEl.innerHTML = "";

    if (currentQuestionType === "type") {
        const type = currentRouteOrType;
        questionEl.textContent = currentLang === "fr" ? `Quel Pokémon appartient au type ${type.name.fr} ?` :
                                currentLang === "es" ? `¿Qué Pokémon pertenece al tipo ${type.name.es}?` :
                                `Which Pokémon belongs to the ${type.name.en} type?`;
    } else if (currentQuestionType === "route") {
        const route = currentRouteOrType;
        questionEl.textContent = currentLang === "fr" ? `Quel Pokémon apparaît sur ${route.name.fr} ?` :
                                currentLang === "es" ? `¿Qué Pokémon aparece en ${route.name.es}?` :
                                `Which Pokémon appears on ${route.name.en}?`;
    } else if (currentQuestionType === "trainer") {
        const trainer = currentRouteOrType;
        questionEl.textContent = currentLang === "fr" ? `Quel Pokémon appartient à ${trainer.name} ?` :
                                currentLang === "es" ? `¿Qué Pokémon pertenece a ${trainer.name}?` :
                                `Which Pokémon belongs to ${trainer.name}?`;
    } else if (currentQuestionType === "stat") {
        const stat = currentRouteOrType;
        questionEl.textContent =
            currentLang === "fr"
                ? `Lequel de ces Pokémon a le plus de ${stat.fr} ?`
                : currentLang === "es"
                ? `¿Cuál de estos Pokémon tiene más ${stat.es}?`
                : `Which of these Pokémon has the highest ${stat.en}?`;
    } else if (currentQuestionType === "description") {
        const pokemon = currentRouteOrType;

        questionEl.textContent =
            currentLang === "fr"
                ? `Quel est ce Pokémon ?`
                : currentLang === "es"
                ? `¿Qué Pokémon es este?`
                : `Which Pokémon is this?`;

        const desc = document.createElement("p");
        desc.className = "pokemon-description";
        desc.textContent = pokemon.description[currentLang];
        questionEl.appendChild(desc);
    }


    answers.forEach(pokemon => createOption(pokemon, currentCorrectId));
}

// ======================== Score & Timer ========================
function updateScore() { scoreEl.textContent = `${texts.score[currentLang]}: ${score}`; }
function updateTimer() { timerEl.textContent = `${texts.timer[currentLang]}: ${timer}s`; }

// ======================== Gestion réponse ========================
function handleAnswer(div, isCorrect) {
    if (isCorrect) {
        div.style.borderColor = "green";
        score++;
        updateScore();

        const plusOne = document.createElement("span");
        plusOne.className = "plus-one";
        plusOne.textContent = "+1";
        scoreEl.appendChild(plusOne);
        setTimeout(() => plusOne.remove(), 1000);
    } else {
        div.style.borderColor = "red";
        const penalty = Math.min(10, timer);
        let i = 0;
        const interval = setInterval(() => {
            if (i < penalty) { timer--; updateTimer(); i++; } 
            else { clearInterval(interval); }
        }, 50);
    }

    Array.from(optionsEl.children).forEach(opt => opt.style.pointerEvents = "none");
    setTimeout(() => generateRandomQuestion(), 500);
}

// ======================== Fin du jeu ========================
function endGame() {
    clearInterval(timerInterval);
    optionsEl.innerHTML = "";
    questionEl.textContent = texts.timeUp[currentLang];
    scoreEl.textContent = `${texts.score[currentLang]}: ${score}`;

    const restartBtn = document.createElement("button");
    restartBtn.textContent = texts.playAgain[currentLang];
    restartBtn.onclick = () => startGame();
    optionsEl.appendChild(restartBtn);
}

// ======================== Enregistrement des questions ========================
registerQuestion(generateRandomTypeQuestion);
registerQuestion(generateRandomRouteQuestion);
registerQuestion(generateRandomTrainerQuestion);
registerQuestion(generateRandomStatQuestion);
registerQuestion(generateRandomDescriptionQuestion);


// ======================== Initialisation ========================
document.addEventListener("DOMContentLoaded", async () => {
    languageSelect.value = currentLang;
    updateAllTexts();

    
    // 🔥 Chargement par défaut : TOUTES les régions
    await loadGameData();
});
