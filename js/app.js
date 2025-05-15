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
//Music File Variables
const music1 = new Audio(
  "../music/chill-work-lofi-cozy-chill-music-336572.mp3"
);
const music2 = new Audio("../music/better-day-186374.mp3");
const music3 = new Audio(
  "../music/good-night-lofi-cozy-chill-music-160166.mp3"
);
const music4 = new Audio(
  "../music/chill-lofi-music-interior-lounge-256260.mp3"
);
const music5 = new Audio("../music/lofi-chill-music-297444.mp3");
//Consolidate into an Array
const musicArr = [music1, music2, music3, music4, music5];
let selectedMusic;
let wordlen = document.getElementById("wordlen");
let attempts = document.getElementById("attempts");
let gameBoard = document.getElementById("gameBoard");
//Array for holding the current word by user
let currentGuess = [];
let nextLetter = 0;
let remainingGuesses;
let selectedWord;

//Function Declarations
const main = () => {
  //Selects a track randomly and plays it in a loop at 50% volume. Changes the music track after each reset.
  selectedMusic = musicArr[Math.floor(Math.random() * musicArr.length)];
  selectedMusic.play();
  selectedMusic.loop = true;
  selectedMusic.volume = 0.5;
  //Mute Button Event Listener for muting/unmuting the music.
  muteButton.addEventListener("click", toggleMusic);
  //Adds 'KeyUp' Event Listener for checking input
  document.addEventListener("keyup", handleKeyUp);
  //Selects a random word to start playing
  selectedWord =
    wordsToGuess[Number(wordlen.value) - 4][
      Math.floor(Math.random() * wordsToGuess[Number(wordlen.value) - 4].length)
    ];
  console.log(wordlen.value);
  console.log(attempts.value);
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
  //Converts the selected word/answer from the wordsToGuess.js file to an array for checking against the user input
  let rightGuess = [...selectedWord];
  //Appends the user input to an empty string for checking
  for (const val of currentGuess) {
    guessString += val;
  }
  //When the user did not enter enough letters to fill up the word limit
  if (guessString.length !== Number(wordlen.value)) {
    toastr.error("Not enough letters!");
    return;
  }
  //When the word input a word that does not exist in the respective word length array
  if (
    !wordsToGuess[Number(wordlen.value) - 4].some(
      (word) => word === guessString
    )
  ) {
    toastr.error("This word is not in the list!");
    return;
  }

  //Compares the user input with the word array for validation
  for (let i = 0; i < Number(wordlen.value); i++) {
    let letterColor = "";
    let box = row.children[i];
    let letter = currentGuess[i];

    let letterPosition = rightGuess.indexOf(currentGuess[i]);
    // Check if letter is in the correct position. If letter does not exist in word, shade it grey.
    if (letterPosition === -1) {
      letterColor = "grey";
    } else {
      if (currentGuess[i] === rightGuess[i]) {
        // Shades the letter box green if letter is in the correct position
        letterColor = "green";
      } else {
        // Shades the letter box yellow if letter is in the word but in the wrong position
        letterColor = "yellow";
      }
      rightGuess[letterPosition] = "#";
    }
    //Shade Animation
    let delay = 500 * i;
    setTimeout(() => {
      //shade box
      box.style.backgroundColor = letterColor;
      shadeKeyboard(letter, letterColor);
    }, delay);
  }

  //Win Scenario
  if (guessString === selectedWord) {
    toastr.success("Congrats! You guessed the word correctly! Game Over!");
    remainingGuesses = 0;
    return;
    //Lose Scenario
  } else {
    remainingGuesses--;
    currentGuess = [];
    nextLetter = 0;
    if (remainingGuesses === 0) {
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
  // Save preference
  localStorage.setItem("colorMode", mode);
};

// Toggle event
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
};

startButton.addEventListener("click", main);
resetButton.addEventListener("click", resetGame);
