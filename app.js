/////////////////////////HTML Elements/////////////////////////////////
const playBoard = document.querySelector("#canvas");
const ScoreElement = document.getElementById("score");
const scoreDisplay = document.getElementById("scoreDisplay");
const highScoreDisplay = document.getElementById("highScoreDisplay");
const gameOverMessage = document.getElementById("gameOverMessage");
const playAgainButton = document.getElementById("playAgainBtn");
const controllers = document.querySelectorAll(".controllers i");
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");
let scoringDiv = document.getElementById("scoringDiv");
const scoreH2 = document.getElementById("ScoreH2");
const arrows = document.querySelector('.controllers');
///////////////////////////////////////////////////////////////////////

/////////////////////////Dynamic Start Menu////////////////////////////
const startMenu = `
<div class="startMenu">
  <br>
  <label>
    <input type="checkbox" id="displayArrows"> Display arrows in screen
  </label>

  <h1>Choose level</h1>
  <div id="levels">
    <input type="radio" name="level" id="lowLevel" value="low" checked>
    <label for="lowLevel">Low</label>

    <input type="radio" name="level" id="mediumLevel" value="medium">
    <label for="mediumLevel">Medium</label>

    <input type="radio" name="level" id="highLevel" value="high">
    <label for="highLevel">High</label>
  </div>

  <!-- Start button -->
  <br>
  <button id="StartBtn" class="glow-on-hover" type="button" onclick="checkGameSettings()">
    START
  </button>
</div>
`;
//////////////////////////////////////////////////////////////////////////

////////////////////////Code Variables///////////////////////////////////
//playBoardWidth and playBoardHeight are constants storing the width and height of the game board.
const playBoardWidth = playBoard.offsetWidth;
const playBoardHeight = playBoard.offsetHeight;
// Flag to track whether it's a play again situation
let playAgainFlag = false; 
//food coordinates           //snake coordinates 
let foodX, foodY, snakeX = 10, snakeY = 10;
//velocityX and velocityY represent the current direction of the snake.
let velocityX = 0, velocityY = 0;
//array to store the coordinates of snake body
let snake = []; 
//user current score
let score = 0; 
let level ='low'   
//get user Stored_Highest_Score if any 
let highestScoreL = window.localStorage.getItem("highestScoreL") || 0; 
let highestScoreM = window.localStorage.getItem("highestScoreM") || 0; 
let highestScoreH = window.localStorage.getItem("highestScoreH") || 0;  
// Check if gameover or not
let GameOver_flag = 0;
 //var to save updateGame interval
let intervalId;   
/////////obstacles coordinates   
const obstacles = [
  [5, 5],[5, 6],[5, 7],[5, 8],
  [5, 17],[5, 18],[5, 19],[5, 20],
  [20, 20],[20, 17],[20, 18],[20, 19],
  [20, 5],[20, 6],[20, 7],[20, 8]

  // Add more obstacle positions as needed
];

/////////////////////////////////////////////////////////////////////////

////////////////////////Functions///////////////////////////////////

//***//
//1
//***//
//Check if HTML DOM is loaded first
document.addEventListener("DOMContentLoaded", function() {
    // Append the start menu to the play board to Display it
    playBoard.innerHTML = startMenu;
});

//***//
//2
//***//
////////////////////////////////check game settings before start/////////////////////////////////////
function checkGameSettings(){
  const displayArrowsFlag = document.getElementById("displayArrows").checked;
  level = document.querySelector('input[name="level"]:checked').value;
  initGame(displayArrowsFlag, level);
}

//***//
//3
//***//
const initGame = (displayArrowsFlag,level) => {
  updateLevel(level);
  showPlayArrows(displayArrowsFlag);
  changeFoodPosition();
 

}

//***//
//4
//***//
// enhanced function to update level
const updateLevel = (level) => {
let speed;
switch (level) {
  case "high":
    speed = 70;
    break;
  case "medium":
    speed = 100;
    break;
  default:
    speed = 140;
}
intervalId = setInterval(updateGame, speed);
};

//***//
//5
//***//
const showPlayArrows = (displayArrowsFlag) =>{
      // Use setTimeout to introduce a slight delay before showing arrows
    setTimeout(() => {
    if (displayArrowsFlag) {
        arrows.style.display = 'flex';
      }

    }, 100);
    
   
}

//***//
//6
//***//
const changeFoodPosition = () => {
  do {
    foodX = Math.floor(Math.random() * 24) + 1;
    foodY = Math.floor(Math.random() * 24) + 1;
  } while (isPositionOccupied(foodX, foodY));
};

//***//
//7
//***//
// function to make sure that food position(x,y) is not generated within snake body or obstacles
const isPositionOccupied = (x, y) => {
  for (let i = 0; i < snake.length; i++) {
    if (x === snake[i][0] && y === snake[i][1]) {
      return true; // Position is occupied by snake
    }
  }

  if (level === 'high') {
   
    for (let i = 0; i < obstacles.length; i++) {
      if (x === obstacles[i][0] && y === obstacles[i][1]) {
        return true; // Position is occupied by an obstacle
      }
    }
  }

  return false;
};

//***//
//8
//***//
const updateGame = () => {
  //the function to keep the game responsive it gets repeated every { the game speed } milliseconds (update snake position, check for collisions and if bait get eaten increase score , handle user input and render the game )
  updateSnake();
  checkCollision();
  ateBait();
  renderGame();
}

//***//
//9
//***//
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

//***//
//10
//***//
const checkCollision = () => {
  // Collision with walls
  if (snakeX == 0 || snakeX > 25 || snakeY == 0 || snakeY > 25) {
    gameOver();
    return;
  }

  // Collision with obstacles
  if (level === 'high') {
    
    for (let i = 0; i < obstacles.length; i++) {
      const obstacleX = obstacles[i][0];
      const obstacleY = obstacles[i][1];
  
      if (snakeX == obstacles[i][0] && snakeY == obstacles[i][1]) {
        // Collision with obstacle, game over
        gameOver();
        return;
      }
    }
  }

  // Collision with itself
  for (let i = 1; i < snake.length; i++) {
    if (snakeX == snake[i][0] && snakeY == snake[i][1]) {
      gameOver();
      return;
    }
  }
};

//***//
//11
//***//
//checks if the snake's head is in the same position as the food
const ateBait = () => {
  if (snakeX === foodX && snakeY === foodY) // to check if snake and food have the same position
  {
    changeFoodPosition();//to put food in a new random place
    snake.push([foodX, foodY]); //adds a new body part to the snake body at the food's position
    updateScore_Playing();
    playEatSound(); // to play the eat sound here
  }
};

//***//
//12
//***//
///////////////////////////////////////////Scoring Update///////////////////////////////////////////
function updateScore_Playing() {
  score++;
  ScoreElement.innerText = score.toString().padStart(2, "0");
}

//***//
//13
//***//
const renderGame = () => {
  let addElements = '';

  if (level === "high") {
    // Render fixed obstacles for high level
    addElements += `<div class="obstacle" style='grid-area: 5 / 5'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 6 / 5'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 7 / 5'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 8 / 5'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 17 / 5'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 18 / 5'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 19 / 5'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 20/ 5'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 5 / 20'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 6 / 20'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 7 / 20'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 8 / 20'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 17 / 20'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 18 / 20'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 19 / 20'></div>`;
    addElements += `<div class="obstacle" style='grid-area: 20 / 20'></div>`;
    // Add more obstacles as needed
  }

  // Render food and snake
  addElements += `<div class="food" style='grid-area: ${foodY} / ${foodX}'></div>`;
  for (let i = 0; i < snake.length; i++) {
    addElements += `<div class="snakeHead" style='grid-area: ${snake[i][1]} / ${snake[i][0]}'></div>`;
  }


  playBoard.innerHTML = addElements;
  ScoreElement.style.display='block';
  scoreH2.style.display='block';

};

///////////////////////////////////////////Game Over///////////////////////////////////////////
//***//
//14
//***//
const gameOver = () => {

  GameOver_flag++;
  clearInterval(intervalId);
  console.log("gameOver function == ", GameOver_flag);
  setTimeout(()=>{
    updateScore_GameOver();
    playGameOverSound(); // to play the game over sound here

    // Display game over message with score and high score and play again button
    // hide Scoring area
    scoringDiv.style.display = "none";
    // show gameover message
    gameOverMessage.style.display = "block";
    // Show "PLAY AGAIN" button
    playAgainButton.style.display = "block";
  },100);
};
//***//

//***//
//15
//***//
  function updateScore_GameOver() {
    let localStorageKey = `highestScore${level.charAt(0).toUpperCase()}`;
    console.log(localStorageKey);
    
    // Use the same key consistently
    let highesLevelScore = window.localStorage.getItem(localStorageKey) || undefined;
    console.log(highesLevelScore);
    
    // Check if highestScore has changed or not
    highesLevelScore ? null : (highesLevelScore = score); // first time playing
    score > highesLevelScore ? (highesLevelScore = score) : null; // user exceeds previous highest score
    
    // Save the updated highest score in local storage
    window.localStorage.setItem(localStorageKey, highesLevelScore);
    
    // Update the score and high score displays
    scoreDisplay.textContent = `Your Score: ${score}`;
    highScoreDisplay.textContent = `Highest Score : ${highesLevelScore}`;
  }

///////////////////////////////////play Again event///////////////////////////

//***//
//16
//***//
// To initialize all vars to startover
function playAgain() {
  ClearSnakeBoard();
  clearInterval(intervalId);
  reInitializeGame();
}

//17
//***//
const ClearSnakeBoard = () => {
  gameOverMessage.style.display = "none";
  playAgainButton.style.display = "none";

  // Clear the game board
  playBoard.innerHTML = '';
  document.querySelector('.controllers').style.display = 'none';
  // and reDraw start Menu
  playBoard.innerHTML = startMenu;
  ScoreElement.style.display='none';
  scoreH2.style.display='none';
};

//***//
//18
//***//
const reInitializeGame = () =>{
  changeFoodPosition();
  changeSnakePosition();
  while (foodX == snakeX && foodY == snakeY) {
    score--;
    changeSnakePosition();
  }
  velocityX = 0;
  velocityY = 0;
  snake = [];
  score = 0;
  ScoreElement.innerText = "00";
  scoringDiv.style.display = "block";
  playAgainFlag = false;

}

//***//
//19
//***//
const changeSnakePosition = () => {
   //generate coordinates from 1 to 25 (within the game board)
  do {
    snakeX = Math.floor(Math.random() * 24) + 1;/* we used 24 here because in CSS we specified the num of rows&cols with 25 */
    snakeY = Math.floor(Math.random() * 24) + 1;
  } while (isPositionOccupied(snakeX, snakeY));
};


//***//
//20
//***//
///////////////////////////////////////////sounds///////////////////////////////////////////
// to play eat sound whenever the snake eats food
const playEatSound = () => {
  eatSound.currentTime = 0; // to reset the sound to the beginning in case it's already playing
  eatSound.play(); //to play sound
};

// to play game over sound when the game is over
const playGameOverSound = () => {
  gameOverSound.currentTime = 0;// to reset the sound to the beginning in case it's already playing
  gameOverSound.play(); //to play sound
};

//***//
//21
//***//
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

controllers.forEach(key => {
  key.addEventListener("click", () => changeDirection({ key: key.dataset.key }))
})
document.addEventListener("keydown", changeDirection);


