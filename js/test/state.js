// ======================== Variables globales ========================
let _data = null;
let _score = 0;
let _timer = 300;
let _timerInterval = null;
let _currentLang = "en";

let _currentQuestion = null;
let _currentCorrectId = null;
let _currentQuestionType = null;
let _currentRouteOrType = null;

export const IMAGE_PATH = "pictures/pokemon/icons/";

// ======================== Getters/Setters ========================
export function getData() { return _data; }
export function setData(d) { _data = d; }

export function getScore() { return _score; }
export function setScore(v) { _score = v; }

export function getTimer() { return _timer; }
export function setTimer(v) { _timer = v; }

export function getTimerInterval() { return _timerInterval; }
export function setTimerInterval(interval) { _timerInterval = interval; }

export function getCurrentLang() { return _currentLang; }
export function setCurrentLang(lang) { _currentLang = lang; }

export function getCurrentQuestion() { return _currentQuestion; }
export function setCurrentQuestion(q) { _currentQuestion = q; }

export function getCurrentCorrectId() { return _currentCorrectId; }
export function setCurrentCorrectId(id) { _currentCorrectId = id; }

export function getCurrentQuestionType() { return _currentQuestionType; }
export function setCurrentQuestionType(t) { _currentQuestionType = t; }

export function getCurrentRouteOrType() { return _currentRouteOrType; }
export function setCurrentRouteOrType(o) { _currentRouteOrType = o; }
