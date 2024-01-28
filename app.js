const playBoard = document.querySelector("#canvas");

let foodX, foodY, snakeX=20, snakeY=20;/*when we create function to change the posisiton of the snake we will remove 20 */

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 2;/* we used 30 here cuz is CSS we specified the num of rows&cols with 30 */
  foodY = Math.floor(Math.random() * 30) + 2; 
};

const initGame = () => {
  
  let addElements = `<div class="food" style='grid-area: ${foodY} / ${foodX}'></div>`;
  addElements+= `<div class="snakeHead" style='grid-area: ${snakeY} / ${snakeX}'></div>`;
  playBoard.innerHTML = addElements;
  checkCollision();
};


const checkCollision = () => {
  // collision with walls(mmkn nshelhaa)
  if (snakeX < 0 || snakeX > 30|| snakeY < 0 || snakeY > 30) {
      gameOver();
  }

  // collision with itself 
  for (let i = 1; i < snakeBody.length; i++) {
    if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
          gameOver();
      }
  }
};

const gameOver = () => {
 
  document.getElementById("scoringDiv").style.display = "none";
  // Display game over message with score and high score
  const gameOverMessage = document.getElementById("gameOverMessage");
  gameOverMessage.style.display = "block";

  // Update the score and high score displays
  document.getElementById("scoreDisplay").textContent = `Your Score: ${score}`;
  document.getElementById("highScoreDisplay").textContent = `High Score: ${highScore}`;

  updateHighScore(); // Update high score when the game is over
};




changeFoodPosition();
initGame();

