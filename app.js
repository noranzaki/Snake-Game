const playBoard = document.querySelector("#canvas");
const ScoreElement = document.getElementById("scoreDisplay");
const highScoreElement = document.getElementById("highScoreDisplay");
let foodX, foodY, snakeX=20, snakeY=20, snakeBody = [],score = 0;/*when we create function to change the posisiton of the snake we will remove 20 */

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 2;/* we used 30 here cuz is CSS we specified the num of rows&cols with 30 */
  foodY = Math.floor(Math.random() * 30) + 2; 
};

const initGame = () => {
  
  let addElements = `<div class="food" style='grid-area: ${foodY} / ${foodX}'></div>`;
  addElements+= `<div class="snakeHead" style='grid-area: ${snakeY} / ${snakeX}'></div>`;
  playBoard.innerHTML = addElements;
  checkCollision();
 ateBait();

};

function ateBait  ()
{
    // to check if the snake ate the bait and update the score and the high score
    if(snakeX === foodX && snakeY === foodY) // to check if snake and food have the same position
    {
       updateFoodPosition();//to put food in a new random place
       score++; // increment score by 1
       highScore = score >= highScore ? score : highScore; //update high score to set it in the local storage to be able to retrieve it again in case the current game is over
       localStorage.setItem("high-score", highScore);
       ScoreElement.innerText = `Score: ${score}`;
     
   }
}

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
  ScoreElement.textContent = `Your Score: ${score}`;
  highScoreElement.textContent = `High Score: ${highScore}`;

  updateHighScore(); // Update high score when the game is over
};




changeFoodPosition();
initGame();

