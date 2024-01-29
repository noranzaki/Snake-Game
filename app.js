const playBoard = document.querySelector("#canvas");
//let playBoard_2D_context = playBoard.getContext("2d");
//const ScoreElement = document.getElementById("scoreDisplay");
const ScoreElement = document.getElementById("score");
const scoreDisplay = document.getElementById("scoreDisplay");
const highScoreDisplay = document.getElementById("highScoreDisplay");
const gameOverMessage = document.getElementById("gameOverMessage");
const playButton = document.querySelector(".glow-on-hover");

//playBoardWidth and playBoardHeight are constants storing the width and height of the game board.
const playBoardWidth = playBoard.offsetWidth;
const playBoardHeight = playBoard.offsetHeight;

//food coordinates           //snake coordinates 
let foodX, foodY, snakeX = 20, snakeY = 20;
//velocityX and velocityY represent the current direction of the snake.
let velocityX = 0, velocityY = 0;
let snake = []; //array to store the coordinates of snake body
let score = 0;   //user current score 
let   highestScore = window.localStorage.getItem("highestScore") || undefined;  //get user_highest score if any 
let GameOver_flag = 0 ;     
let intervalId;       //var to save updateGame interval


const initGame = () => {

  gameOverMessage.style.display = "none";
  document.getElementById("scoringDiv").style.display = "block";
  changeFoodPosition();

  // updateScore(); //to be implemented by huda
  //to create a continous loop to update the game state and renders it on the screen(check snake position, handle user input, check for collisions then render)
  
  intervalId = setInterval(() => {
    updateGame();
  }, 150);
  // setInterval(() => {
  //   updateGame();
  // }, 150); //150 is the speed of game 
  //without it it will be a static screen 
};


const updateGame = () => {
  //the function to keep the game responsive it gets repeated every 150 milliseconds (update snake position, check for collisions and if bait get eaten increase score , handle user input and render the game )
  updateSnake();
  checkCollision();
  ateBait(); //to be implemented eat bait and increase score by calling function update score
  renderGame();
}


const changeFoodPosition = () => {
  //generate coordinates from 1 to 30 (within the game board)
  foodX = Math.floor(Math.random() * 29) + 1;/* we used 30 here cuz is CSS we specified the num of rows&cols with 30 */
  foodY = Math.floor(Math.random() * 29) + 1;
};

const changeSnakePosition = () => {
  //generate coordinates from 1 to 30 (within the game board)
  snakeX = Math.floor(Math.random() * 29) + 1;/* we used 30 here cuz is CSS we specified the num of rows&cols with 30 */
  snakeY = Math.floor(Math.random() * 29) + 1;
};



//to be implemented by huda
// const updateScore = () => {
//   score++; // increment score by 1
//   highScore = score >= highScore ? score : highScore; //update high score to set it in the local storage to be able to retrieve it again in case the current game is over
//   localStorage.setItem("high-score", highScore);
//   ScoreElement.innerText = `Score: ${score}`;
//   highScoreElement.innerText = `High Score: ${highScore}`;
// };

const updateSnake = () => {
  // Copy the snake array to avoid referencing issues (... : shallow copy)
  const newSnake = [...snake];
  //iterate through the elements of the snake array to shift each element of the snake's body to the position of the part in front of it. By copying the position of the previous element .
  // mimics the movement of the snake's body as it slithers forward
  for (let i = snake.length - 1; i > 0; i--) {
    newSnake[i] = [...snake[i - 1]];
  }
  //The head of the snake (at index 0) is updated with the current position ([snakeX, snakeY]
  newSnake[0] = [snakeX, snakeY];
  //complete update of the snake's positions by returning it.
  snake = newSnake;
  //update the current position of the snake's head based on the direction of the snake. This is what allows the snake to move in the specified direction.
  snakeX += velocityX;
  snakeY += velocityY;
}

const checkCollision = () => {
  // collision with walls
  if (snakeX < 0 || snakeX > 30 || snakeY < 0 || snakeY > 30) {
    gameOver();
  }
  // collision with itself 
  //comparing head of snake which is at snakeX, snakeY with it's body parts
  for (let i = 1; i < snake.length; i++) {
    if (snakeX == snake[i][0] && snakeY == snake[i][1]) {
      gameOver();
      break;
    }
  }
 };


//checks if the snake's head is in the same position as the food
const ateBait = () => {
  if (snakeX === foodX && snakeY === foodY) // to check if snake and food have the same position
  {
    changeFoodPosition();//to put food in a new random place
    snake.push([foodX, foodY]); //adds a new body part to the snake body at the food's position.
    updateScore_Playing();
  }
};
const renderGame = () => {
  let addElements = `<div class="food" style='grid-area: ${foodY} / ${foodX}'></div>`;
  for (let i = 0; i < snake.length; i++) {
    addElements += `<div class="snakeHead" style='grid-area: ${snake[i][1]} / ${snake[i][0]}'></div>`;
  }
  playBoard.innerHTML = addElements;
};


///////////////Scoring Update///////////////////////////////////////////
function updateScore_Playing() {
  score++;
  ScoreElement.innerText = score.toString().padStart(2, "0");
  
}

//update highest score and show scoreDisplay &  highScoreDisplay
function updateScore_GameOver() {
 
 //check if highestScore have changed or not 
 highestScore ? null : (highestScore = score);    // first time to play 
 score > highestScore ? (highestScore = score) : null;   // user exceed prev_highest score
 window.localStorage.setItem("highestScore", highestScore);

 // Update the score and high score displays
 scoreDisplay.textContent = `Your Score: ${score}`;
 highScoreDisplay.textContent = `Highest Score: ${highestScore}`;
  
}
///////////////////////////////////////////////////////////////////////////////





//////////////////////////////Game Over /////////////////////////////
const gameOver = () => {
 GameOver_flag++ ;
 clearInterval(intervalId);
 console.log("gameOver function == ",GameOver_flag);

 document.getElementById("scoringDiv").style.display = "none";
 // Display game over message with score and high score
 playButton.style.display = "block";
 gameOverMessage.style.display = "block";
 updateScore_GameOver();

 
};

///////////////////////////////////play Again event///////////////////////////

// To initialize all vars to startover
function playAgain(){
   clearInterval(intervalId);
    changeFoodPosition();
    changeSnakePosition();
    while(foodX==snakeX && foodY==snakeY){
      score--;
      changeSnakePosition();
    }
    velocityX = 0, velocityY = 0;
    snake = [];
    score = 0;
    ScoreElement.innerText = "00";
    highestScore = window.localStorage.getItem("highestScore") || undefined;
    initGame();

}
/////////////////////////// Keyboard Movments //////////////////////////////

//an event handler function to decide direction of snake based on arrow pressed
const changeDirection = (event) => {
  if (event.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (event.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (event.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (event.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }

};

document.addEventListener("keydown", changeDirection);
initGame();

