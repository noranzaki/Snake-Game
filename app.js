const playBoard = document.querySelector("#canvas");
const playBoardWidth = playBoard.offsetWidth;
const playBoardHeight = playBoard.offsetHeight;
let foodX, foodY, snakeX=20, snakeY=20;/*when we create function to change the posisiton of the snake we will remove 20 */

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * (playBoardWidth / 30)) + 2;// we used 30 here cuz is CSS we specified the num of rows&cols with 30
    foodY = Math.floor(Math.random() * (playBoardHeight / 30)) + 2; 
  };
const initGame = () => {
  
  let addElements = `<div class="food" style='grid-area: ${foodY} / ${foodX}'></div>`;
  addElements+= `<div class="snakeHead" style='grid-area: ${snakeY} / ${snakeX}'></div>`;
  playBoard.innerHTML = addElements;
};


changeFoodPosition();
initGame();

