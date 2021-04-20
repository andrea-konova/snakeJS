// declaring variables
const canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d');

const width = canvas.width,
  height = canvas.height;

const blockSize = 10,
  widthInBlock = width / blockSize,
  heightInBlock = height / blockSize;

let score = 0;

// drawBorder
const drawBorder = () => {
  ctx.fillStyle = 'Gray';
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
}



// drawScore
const drawScore = () => {
  ctx.font = '20px Courier'
  ctx.fillStyle = 'Black';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Счёт: ' + score, blockSize, blockSize);
}

const gameOver = () => {
  clearInterval(intervalId);
  ctx.font = '60px Courier'
  ctx.fillStyle = 'Black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Конец игры', width / 2, height / 2);
}

// setInterval
const intervalId = setInterval(() =>{
  ctx.clearRect(0, 0, width, height);
  score++;
  if (score === 100) {
    gameOver();
    score = 0;
  }
  drawBorder();
  drawScore();
}, 100)


