// Bulls and Cows
const prompt = require('prompt-sync')({ sigint: true });
const colors = require('colors');
var emoji = require("node-emoji");

//function to create secret number
function secretNumber() {
  let secretArray = [];
  do {
    let randNum = Math.floor(Math.random() * 9) + 1;
    if (!secretArray.includes(randNum)) {
      secretArray.push(randNum);
    }
    //here it checks the array length is less than 4. if it is not it will execute the above condition again until the while condition return true.
  } while (secretArray.length < 4);
  return Number(secretArray.join(''));
}

console.log("Instructions to play the game :".magenta);
console.log("1. Enter your name to play (optional)");
console.log("2. Choose the level you want to play. Easy or Hard.(default mode is easy)");
console.log("3. If you choose hard level, you get to guess only 15 times and exit the game.");
console.log("4. If you choose Easy level, you can play the game until you win.");
console.log("5. You always have to provide a 4-digit number. The digits must be unique between 1 and 9.");
console.log(`6. If the matching digits are in their right positions, they are "bulls", if they are in incorrect positions, they are "cows".`);



//enter player name. Print this name to congratulate when the player wins the game
let yourName = prompt("Enter your name : ".blue);
if (yourName === "") {
  yourName = "Player";
}

//Decide easy or hard game. If it is hard set the number of attempts is 15
let hardOrEasyGame = prompt("Choose your level. Enter easy or hard : ".red);


let secret = secretNumber();
console.log(secret);

let attempts = 0;
let bulls = 0;
let cows = 0;
let round = 0;

//object to track the round and attempts
let roundTracker = {};

//function to play the game again when the player wins the game and the number of attempts are over.
function playAgain(win) {

  roundTracker[round] = {
    "attempts": attempts,
    "win": win
  }

  //count the number of rounds played.
  round++
  let playAgain = prompt("Do you want to play again? Enter y / n : ".green);

  //if the player wants to play again reset the secret number,attempts, cows and bulls.
  if (playAgain === 'y') {
    hardOrEasyGame = prompt("Choose your level. Enter easy or hard : ".red);
    secret = secretNumber();
    attempts = 0;
    cows = 0;
    bulls = 0;
    console.log(`New game ${emoji.get("fire")}`.yellow);
    return true;
  }
  return false;
}


//function to print the status of the game when the player exits the game.
function printRoundStats() {
  let statusOfGame;
  for (const key in roundTracker) {
    if (roundTracker[key]["win"]) {
      statusOfGame = "Won";
    }
    else {
      statusOfGame = "Failed";
    }
    console.log(`Round - ${Number(key) + 1} : attempts ${roundTracker[key]["attempts"]}, Status of the game : ${statusOfGame}`);
  }
}


// The real game happens here
do {
  attempts++;
  //set number of attempts for hard game and print the attempts are over.
  if (hardOrEasyGame === "hard" && attempts === 5) {
    console.log(` Your number of attempts is over ${emoji.get("broken_heart")}`.red);

    //when the number of attempts are over ask to play the game again. If it is yes(true) it will continue the game.If it is no(false) it will exit and print the status of the game.
    let repeatGame = playAgain(false);
    if (repeatGame === true) {
      continue;
    }
    printRoundStats();
    break;
  }

  //prompt to guess the number
  let guessNumber = prompt('Guess the Number : '.cyan);


  //When the player's number match with secret number, ask again to play. if yes continue the game. if no exit and print the status of the game.
  if (Number(guessNumber) === secret) {
    console.log(`Congratulations ${yourName.toUpperCase()}. You won the game and you took ${attempts} attempts to finish the game.`.rainbow);

    let repeatGame = playAgain(true);
    if (repeatGame === true) {
      continue;
    }
    printRoundStats();
    break;
  }


  // If the player should not enter the 4 digits number, console.log() and continue the game.
  if (guessNumber.length !== 4) {
    console.log("You must enter a number with 4 digits".cyan);
    continue;
  }

  // distinctness check
  //set is the data structure where you can store unique values. In this case it will remove all the duplicates from the user input and 
  //if the length of the original input is not equal to the size of the set, then we assume there are duplicates in the user input.
  let s1 = new Set(guessNumber);
  if (guessNumber.length !== s1.size) {
    console.log("It must be 4 unique digits".red);
    continue;
  }

  let secretString = secret.toString();
  bulls = 0;
  cows = 0;
  //count bulls and cows.
  for (let i = 0; i < 4; i++) {
    if (secretString[i] === guessNumber[i]) {
      bulls++;
    }
    else if (secretString.includes(guessNumber[i])) {
      cows++;
    }
  }
  console.log(`Hint: ${bulls} bull and ${cows} cows`);
  let funMessages = ["😆", "😅", "😂", "🤭", "🥴", "😤", "🙆"];
  if (bulls === 0 && cows === 0) {
    let randEmoji = funMessages[Math.floor(Math.random() * funMessages.length)];
    console.log(randEmoji, "Try again!".magenta);
  }
} while (true);
