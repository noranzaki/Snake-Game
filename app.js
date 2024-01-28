let replay = document.querySelector("#replay");
let score = document.querySelector("#score");
let canvas = document.createElement("canvas");
document.querySelector("#board").appendChild(canvas);
let boardGrid = canvas.getContext("2d");

const width = (canvas.width = 500);
const height = (canvas.height = 400);
let cells = 20;
function drawGrid() {
    boardGrid.lineWidth = 1.1;
    boardGrid.strokeStyle = "#181825";
    boardGrid.shadowBlur = 0;
    for (let i = 1; i < cells; i++) {
      let f = (width / cells) * i;
      boardGrid.beginPath();
      boardGrid.moveTo(f, 0);
      boardGrid.lineTo(f, height);
      boardGrid.stroke();
      boardGrid.beginPath();
      boardGrid.moveTo(0, f);
      boardGrid.lineTo(width, f);
      boardGrid.stroke();
      boardGrid.closePath();
    }
  }
 drawGrid();