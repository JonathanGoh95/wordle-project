//Module Imports
import { wordsToGuess } from "./wordsToGuess";

//Declaration of Variables
const numberOfGuesses = 6;
let remainingGuesses = numberOfGuesses;
let currentGuess = []; //Array for holding the current word by user
let nextLetter = 0;
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

main();
