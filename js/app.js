//Module Imports
import { wordsToGuess } from "./wordsToGuess.js";

//Declaration of Variables
const headerTitle = document.querySelector("h1");
const numberOfGuesses = 6;
let remainingGuesses = numberOfGuesses;
let currentGuess = []; //Array for holding the current word by user
let nextLetter = 0;
let gameMsg = document.createElement("p");
let selectedWord =
  wordsToGuess[Math.floor(Math.random() * wordsToGuess.length)]; //Selects a random word to start playing
console.log(selectedWord);

//Function Declarations
const main = () => {
  let gameBoard = document.getElementById("gameBoard");
  //Creates a number of divs with the class name of 'letter-row', based on the value of the 'numberOfGuesses' variable
  for (let i = 0; i < numberOfGuesses; i++) {
    let rowOfLetters = document.createElement("div");
    rowOfLetters.className = "rowOfLetters";

    //Creates 5 'boxes' to contain each word, for each row using a nested for loop
    for (let j = 0; j < 5; j++) {
      let boxOfLetters = document.createElement("div");
      boxOfLetters.className = "boxOfLetters";
      rowOfLetters.appendChild(boxOfLetters);
    }

    gameBoard.appendChild(rowOfLetters);
  }
};

//Input from User Keyboard
document.addEventListener("keyup", (event) => {
  if (remainingGuesses === 0) {
    return;
  }

  //Remove letter appendChild clicking 'Backspace'
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

  let found = userInput.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    //If condition doesn't match alphabetical character or contain multiple characters, skip/ignore event.
    return;
  } else {
    insertLetter(userInput);
  }
});

const insertLetter = (userInput) => {
  //When the word limit is reached
  if (nextLetter === 5) {
    return;
  }
  userInput = userInput.toLowerCase();

  let row =
    document.getElementsByClassName("rowOfLetters")[6 - remainingGuesses];
  let box = row.children[nextLetter];
  box.textContent = userInput;
  box.classList.add("filledBox");
  currentGuess.push(userInput);
  nextLetter++;
};

const deleteLetter = () => {
  let row =
    document.getElementsByClassName("rowOfLetters")[6 - remainingGuesses];
  let box = row.children[nextLetter - 1];
  box.textContent = "";
  box.classList.remove("filledBox");
  currentGuess.pop();
  nextLetter--;
};

const checkAnswer = () => {
  let row =
    document.getElementsByClassName("rowOfLetters")[6 - remainingGuesses];
  let guessString = "";
  let rightGuess = [...selectedWord];
  //Append the user input to an empty string for checking
  for (const val of currentGuess) {
    guessString += val;
  }

  if (guessString.length !== 5) {
    gameMsg.textContent = "Not enough letters!";
    headerTitle.appendChild(gameMsg);
    // alert("Not enough letters!");
    return;
  }

  if (!wordsToGuess.includes(guessString)) {
    gameMsg.textContent = "Word does not exist in list!";
    headerTitle.appendChild(gameMsg);
    // alert("Word not in list!");
    return;
  }

  for (let i = 0; i < 5; i++) {
    let letterColor = "";
    let box = row.children[i];
    let letter = currentGuess[i];

    let letterPosition = rightGuess.indexOf(currentGuess[i]);
    // Check if letter is in the correct position
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

  if (guessString === selectedWord) {
    gameMsg.textContent =
      "Congrats! You guessed the word correctly! Game Over!";
    headerTitle.appendChild(gameMsg);
    // alert("You guessed right! Game over!");
    remainingGuesses = 0;
    return;
  } else {
    remainingGuesses--;
    currentGuess = [];
    nextLetter = 0;

    if (remainingGuesses === 0) {
      gameMsg.textContent = `You have ran out of guesses! Game Over!
      The right word was: "${selectedWord}`;
      headerTitle.appendChild(gameMsg);
      //   alert("You've run out of guesses! Game over!");
      //   alert(`The right word was: "${selectedWord}"`);
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

main();
