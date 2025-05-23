//Module Imports
import { wordsToGuess } from "./wordsToGuess.js";

//Declaration of Variables from HTML Elements
const headerTitle = document.querySelector("h1");
const instructions = document.getElementById("instructions");
const resetButton = document.getElementById("resetGame");
const startButton = document.getElementById("startGame");
const muteButton = document.getElementById("mute");
const keyboard = document.getElementById("keyboardLayout");
const toggleModeButton = document.getElementById("toggleMode");
const statsButton = document.getElementById("stats");
const resetStatsButton = document.getElementById("resetStats");
//Music File Variables
const music1 = new Audio("music/chill-work-lofi-cozy-chill-music-336572.mp3");
const music2 = new Audio("music/better-day-186374.mp3");
const music3 = new Audio("music/good-night-lofi-cozy-chill-music-160166.mp3");
const music4 = new Audio("music/chill-lofi-music-interior-lounge-256260.mp3");
const music5 = new Audio("music/lofi-chill-music-297444.mp3");
const confettisfx = new Audio("music/confetti_sound_effect.mp3");
//Consolidate into an Array
const musicArr = [music1, music2, music3, music4, music5];
let selectedMusic;
let wordlen = document.getElementById("wordlen");
let attempts = document.getElementById("attempts");
let gameBoard = document.getElementById("gameBoard");
let started = false;
//Array for holding the current word by user
let currentGuess = [];
let nextLetter = 0;
let remainingGuesses;
let selectedWord;

//Function Declarations
const main = () => {
  started = true;
  //Selects a track randomly and plays it in a loop at 50% volume. Changes the music track after each reset.
  selectedMusic = musicArr[Math.floor(Math.random() * musicArr.length)];
  selectedMusic.play();
  selectedMusic.loop = true;
  selectedMusic.volume = 0.5;
  //Mute Button Event Listener for muting/unmuting the background music.
  muteButton.addEventListener("click", toggleMusic);
  //Adds 'KeyUp' Event Listener for checking input
  document.addEventListener("keyup", handleKeyUp);
  //Selects a random word to start playing
  selectedWord =
    wordsToGuess[Number(wordlen.value) - 4][
      Math.floor(Math.random() * wordsToGuess[Number(wordlen.value) - 4].length)
    ];
  // console.log(wordlen.value);
  // console.log(attempts.value);
  //Outputs the answer to the console for testing purposes
  console.log(selectedWord);
  remainingGuesses = Number(attempts.value);
  console.log(remainingGuesses);
  //Hides the instructions and displays the on-screen keyboard and Reset Game button
  instructions.style.display = "none";
  keyboard.style.display = "flex";
  resetButton.style.display = "block";
  //Creates the game board using a nested for loop
  //Creates a number of divs with the class name of 'rowOfLetters', based on the value of the 'attempts' variable
  for (let i = 0; i < Number(attempts.value); i++) {
    let rowOfLetters = document.createElement("div");
    rowOfLetters.className = "rowOfLetters";
    //Creates 'boxes' to contain each word for each row
    for (let j = 0; j < Number(wordlen.value); j++) {
      let boxOfLetters = document.createElement("div");
      boxOfLetters.className = "boxOfLetters";
      rowOfLetters.appendChild(boxOfLetters);
    }
    gameBoard.appendChild(rowOfLetters);
  }
};

//Input from User Keyboard
const handleKeyUp = (event) => {
  //Once number of attempts reaches 0, it will exit this function
  if (remainingGuesses === 0) {
    return;
  }

  //Remove letter when clicking/pressing 'Backspace'
  let userInput = String(event.key);
  if (userInput === "Backspace" && nextLetter !== 0) {
    deleteLetter();
    return;
  }

  //Checks if the answer is correct each time 'Enter' is clicked/pressed
  if (userInput === "Enter") {
    checkAnswer();
    return;
  }

  //If condition doesn't match alphabetical character or contain multiple characters, no characters will be inserted.
  let found = userInput.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(userInput);
  }
};

const insertLetter = (userInput) => {
  //When the word limit is reached
  if (nextLetter === Number(wordlen.value)) {
    return;
  }
  userInput = userInput.toLowerCase();

  let row =
    document.getElementsByClassName("rowOfLetters")[
      Number(attempts.value) - remainingGuesses
    ];
  let box = row.children[nextLetter];
  animateCSS(box, "heartBeat");
  box.textContent = userInput;
  box.classList.add("filledBox");
  currentGuess.push(userInput);
  nextLetter++;
};

const deleteLetter = () => {
  let row =
    document.getElementsByClassName("rowOfLetters")[
      Number(attempts.value) - remainingGuesses
    ];
  let box = row.children[nextLetter - 1];
  box.textContent = "";
  box.classList.remove("filledBox");
  currentGuess.pop();
  nextLetter--;
};

const checkAnswer = () => {
  let row =
    document.getElementsByClassName("rowOfLetters")[
      Number(attempts.value) - remainingGuesses
    ];
  let guessString = "";
  let rightGuess = [...selectedWord];
  for (const val of currentGuess) {
    guessString += val;
  }
  if (guessString.length !== Number(wordlen.value)) {
    toastr.error("Not enough letters!");
    return;
  }
  if (
    !wordsToGuess[Number(wordlen.value) - 4].some(
      (word) => word === guessString
    )
  ) {
    toastr.error("This word is not in the list!");
    return;
  }

  // First pass: mark greens
  //Remaining letters after the second pass will be shaded grey.
  let letterColors = Array(Number(wordlen.value)).fill("grey");
  for (let i = 0; i < Number(wordlen.value); i++) {
    if (currentGuess[i] === rightGuess[i]) {
      letterColors[i] = "green";
      rightGuess[i] = null; // Mark as used
    }
  }

  // Second pass: mark yellows
  for (let i = 0; i < Number(wordlen.value); i++) {
    if (letterColors[i] === "grey") {
      let letterIndex = rightGuess.indexOf(currentGuess[i]);
      if (letterIndex !== -1 && currentGuess[i] !== selectedWord[i]) {
        letterColors[i] = "yellow";
        rightGuess[letterIndex] = null; // Mark as used
      }
    }
  }

  // Animate shading
  for (let i = 0; i < Number(wordlen.value); i++) {
    let box = row.children[i];
    let letter = currentGuess[i];
    let letterColor = letterColors[i];
    let delay = 350 * i;
    setTimeout(() => {
      animateCSS(box, "flip");
      box.style.backgroundColor = letterColor;
      shadeKeyboard(letter, letterColor);
    }, delay);
  }

  //Win Scenario
  if (guessString === selectedWord) {
    updateStats(true);
    toastr.success("Congrats! You guessed the word correctly! Game Over!");
    // Confetti celebration with customization and SFX!
    confettisfx.play();
    if (typeof confetti === "function") {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
    remainingGuesses = 0;
    return;
    //Lose Scenario
  } else {
    remainingGuesses--;
    currentGuess = [];
    nextLetter = 0;
    if (remainingGuesses === 0) {
      updateStats(false);
      selectedWord = [...selectedWord]
        .map((word) => word.toUpperCase())
        .join("");
      toastr.error("You have ran out of guesses! Game Over!");
      toastr.info(`The right word was: "${selectedWord}"`);
    }
  }
};

//Shades the on-screen keyboard accordingly
const shadeKeyboard = (letter, color) => {
  for (const elem of document.getElementsByClassName("keyboardButton")) {
    if (elem.textContent === letter) {
      let oldColor = elem.style.backgroundColor;
      //Do nothing if key is already green
      if (oldColor === "green") {
        return;
      }
      //Same as above but for yellow
      if (oldColor === "yellow" && color !== "green") {
        return;
      }
      //Sets the background color to grey if both conditions above are not met
      elem.style.backgroundColor = color;
      break;
    }
  }
};

//Input from On-Screen Keyboard
document.getElementById("keyboardLayout").addEventListener("click", (event) => {
  const target = event.target;
  if (!target.classList.contains("keyboardButton")) {
    return;
  }
  let key = target.textContent;

  if (key === "Del") {
    key = "Backspace";
  }

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});

const setMode = (mode) => {
  document.body.classList.remove("light-mode", "dark-mode");
  document.body.classList.add(mode + "-mode");
  // Optionally update button text/icon
  toggleModeButton.textContent =
    mode === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  // Save preference to local storage
  localStorage.setItem("colorMode", mode);
};

// Toggle Light/Dark Mode
toggleModeButton.addEventListener("click", () => {
  const currentMode = document.body.classList.contains("dark-mode")
    ? "dark"
    : "light";
  setMode(currentMode === "dark" ? "light" : "dark");
});

// On page load, set mode from saved preference or default to light
window.addEventListener("DOMContentLoaded", () => {
  const savedMode = localStorage.getItem("colorMode") || "light";
  setMode(savedMode);
});

const toggleMusic = () => {
  //Mute/Unmute Music and change icon accordingly
  if (!selectedMusic.muted) {
    selectedMusic.muted = true;
    muteButton.src = "images/unmute_icon.png";
  } else {
    selectedMusic.muted = false;
    muteButton.src = "images/mute_icon.png";
  }
};

const resetGame = () => {
  remainingGuesses = "";
  currentGuess = []; //Array for holding the current word by user
  nextLetter = 0;
  for (const elem of document.getElementsByClassName("keyboardButton")) {
    elem.style.backgroundColor = "";
  }
  //Unhides the instructions and hides the keyboard and Reset Game button
  instructions.style.display = "block";
  keyboard.style.display = "none";
  resetButton.style.display = "none";
  //Removes the grid of rows and boxes
  const rows = document.querySelectorAll(".rowOfLetters");
  rows.forEach((row) => {
    row.remove();
  });
  //Removes the Event Listener when Reset Game button is clicked/pressed. Start Button will add it back in the main() function.
  document.removeEventListener("keyup", handleKeyUp);
  //Pauses the music after the reset and removes the event listener for the mute button. No music should be playing when the game has not yet started.
  selectedMusic.pause();
  selectedMusic.currentTime = 0;
  muteButton.removeEventListener("click", toggleMusic);
  started = false;
};

//Animate CSS Library (Code verbatim from Source)
const animateCSS = (element, animation, prefix = "animate__") =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element;
    node.style.setProperty("--animate-duration", "0.3s");

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

const getStats = () => {
  const stats = JSON.parse(localStorage.getItem("wordleStats"));
  return (
    stats || {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      bestStreak: 0,
    }
  );
};

const saveStats = (stats) => {
  localStorage.setItem("wordleStats", JSON.stringify(stats));
};

const updateStats = (win) => {
  let stats = getStats();
  stats.gamesPlayed++;
  if (win) {
    stats.gamesWon++;
    stats.currentStreak++;
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
  } else {
    stats.currentStreak = 0;
  }
  saveStats(stats);
};

const showStats = () => {
  const stats = getStats();
  const existingStats = document.getElementById("statsInfo");
  const rows = document.querySelectorAll(".rowOfLetters");

  if (existingStats) {
    // Hide stats and restore UI
    existingStats.remove();
    if (started) {
      rows.forEach((row) => {
        row.style.display = "flex";
      });
      keyboard.style.display = "flex";
    } else {
      instructions.style.display = "block";
    }
    return;
  }

  if (started) {
    rows.forEach((row) => {
      row.style.display = "none";
    });
    keyboard.style.display = "none";
  } else {
    instructions.style.display = "none";
  }
  let statsInfo = document.createElement("div");
  statsInfo.id = "statsInfo";
  let gamesPlayed = document.createElement("p");
  let gamesWon = document.createElement("p");
  let winPercent = document.createElement("p");
  let currentStreak = document.createElement("p");
  let bestStreak = document.createElement("p");
  const statsArr = [
    gamesPlayed,
    gamesWon,
    winPercent,
    currentStreak,
    bestStreak,
  ];
  for (let i = 0; i < statsArr.length; i++) {
    statsInfo.appendChild(statsArr[i]);
  }
  instructions.after(statsInfo);
  gamesPlayed.textContent = `Games Played: ${stats.gamesPlayed}`;
  gamesWon.textContent = `Games Won: ${stats.gamesWon}`;
  winPercent.textContent = `Win %: ${
    stats.gamesPlayed
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0
  }`;
  currentStreak.textContent = `Current Streak: ${stats.currentStreak}`;
  bestStreak.textContent = `Best Streak: ${stats.bestStreak}`;
};

const resetStats = () => {
  toastr.info(
    "Game Statistics have been reset/cleared. Click the 📊 Stats Button to return to the main page."
  );
  localStorage.clear();
};

startButton.addEventListener("click", main);
resetButton.addEventListener("click", resetGame);
statsButton.addEventListener("click", showStats);
resetStatsButton.addEventListener("click", resetStats);
