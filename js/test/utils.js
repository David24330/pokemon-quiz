export const getRandomItem = arr => arr[Math.floor(Math.random() * arr.length)];
export const shuffle = arr => arr.sort(() => Math.random() - 0.5);
