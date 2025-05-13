//Module Imports
import { wordsToGuess } from "./wordsToGuess.js";

//Declaration of Variables
const headerTitle = document.querySelector("h1");
// const numberOfGuesses = 6;
const instructions = document.getElementById("instructions");
const resetButton = document.getElementById("resetGame");
const startButton = document.getElementById("startGame");
const keyboard = document.getElementById("keyboardLayout");
let wordlen = document.getElementById("wordlen");
let attempts = document.getElementById("attempts");
let gameBoard = document.getElementById("gameBoard");
let remainingGuesses = Number(attempts.value);
let currentGuess = []; //Array for holding the current word by user
let nextLetter = 0;
// let gameMsg = document.createElement("p");
//Selects a random word to start playing
//Outputs the answer to the console for testing purposes
//Function Declarations
//Creates the game board using a nested for loop
const main = () => {
  let selectedWord =
    wordsToGuess[Number(wordlen.value) - 4][
      Math.floor(Math.random() * wordsToGuess[Number(wordlen.value) - 4].length)
    ];
  console.log(wordlen.value);
  console.log(attempts.value);
  console.log(selectedWord);
  instructions.style.display = "none";
  keyboard.style.display = "flex";
  resetButton.style.display = "block";
  //Creates a number of divs with the class name of 'rowOfLetters', based on the value of the 'numberOfGuesses' variable
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

  //Input from User Keyboard
  document.addEventListener("keyup", (event) => {
    if (remainingGuesses === 0) {
      return;
    }

    //Remove letter when clicking/pressing 'Backspace'
    let userInput = String(event.key);
    if (userInput === "Backspace" && nextLetter !== 0) {
      deleteLetter();
      return;
    }

    //Check if the answer is correct each time 'Enter' is clicked/pressed
    if (userInput === "Enter") {
      checkAnswer();
      // gameMsg.remove();
      return;
    }

    //If condition doesn't match alphabetical character or contain multiple characters, skip/ignore event.
    let found = userInput.match(/[a-z]/gi);
    if (!found || found.length > 1) {
      return;
    } else {
      insertLetter(userInput);
    }
  });

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
    console.log(guessString.length);
    if (guessString.length !== Number(wordlen.value)) {
      toastr.error("Not enough letters!");
      return;
    }
    if (
      !wordsToGuess[Number(wordlen.value) - 4].some(
        (word) => word === guessString
      )
    ) {
      toastr.error("This is not a valid word!");
      return;
    }

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
      // gameMsg.textContent =
      //   "Congrats! You guessed the word correctly! Game Over!";
      // headerTitle.appendChild(gameMsg);
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
        // gameMsg.innerHTML = `You have ran out of guesses! Game Over!<br />
        // The right word was: "${selectedWord}"`;
        // headerTitle.appendChild(gameMsg);
        toastr.error("You have ran out of guesses! Game Over!");
        toastr.info(`The right word was: "${selectedWord}"`);
      }
    }
  };

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
  document
    .getElementById("keyboardLayout")
    .addEventListener("click", (event) => {
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
};

const resetGame = () => {
  remainingGuesses = "";
  currentGuess = []; //Array for holding the current word by user
  nextLetter = 0;
  for (const elem of document.getElementsByClassName("keyboardButton")) {
    elem.style.backgroundColor = "";
  }
  instructions.style.display = "block";
  keyboard.style.display = "none";
  resetButton.style.display = "none";
  for (let i = 0; i < Number(attempts.value); i++) {
    document.querySelector(".rowOfLetters").remove();
  }
};

startButton.addEventListener("click", main);
resetButton.addEventListener("click", resetGame);
