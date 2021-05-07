// declaring variables
const canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d');

const width = canvas.width,
  height = canvas.height;

const blockSize = 10,
  widthInBlocks = width / blockSize,
  heightInBlocks = height / blockSize;

let score = 0;

// drawBorder
const drawBorder = () => {
  ctx.fillStyle = 'LightSlateGray';
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
};

// drawCircle
const circle = (x, y, radius, fillCircle) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  if (fillCircle) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

// drawScore
const drawScore = () => {
  ctx.font = '16px "Press Start 2P", Consolas, monospace';
  ctx.fillStyle = 'Black';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Score: ' + score, blockSize, blockSize);
};

// gameOver
const gameOver = () => {
  playing = false;
  ctx.font = '40px "Press Start 2P", Consolas, monospace';
  ctx.fillStyle = 'Black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Game over', width / 2, height / 2);
};

// constructor Block
class Block {
  constructor(col, row) {
    this.col = col;
    this.row = row;
  }
  drawSquare(color) {
    const x = this.col * blockSize;
    const y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
  }
  drawCircle(color) {
    const centerX = this.col * blockSize + blockSize / 2;
    const centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
  }
  equal(otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
  }
};

// constructor Snake
class Snake {
  constructor() {
    this.segments = [
      new Block(7, 5),
      new Block(6, 5),
      new Block(5, 5),
    ];
    this.direction = 'right';
    this.nextDirection = 'right';
  }
  draw() {
    for (let i = 0; i < this.segments.length; i++) {
      if (i === 0) {
        this.segments[i].drawSquare('DarkSlateGray');
      } else if (i % 2) {
        this.segments[i].drawSquare('SteelBlue');
      } else {
        this.segments[i].drawSquare('DarkSeaGreen');
      }
    }
  }
  move() {
    let head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    switch (this.direction) {
      case 'right':
        newHead = new Block(head.col + 1, head.row);
        break;
      case 'down':
        newHead = new Block(head.col, head.row + 1  );
        break;
      case 'left':
        newHead = new Block(head.col - 1, head.row);
        break;
      case 'up':
        newHead = new Block(head.col, head.row - 1  );
        break;
      default:
        break;
    }

    if (this.checkCollision(newHead)) {
      gameOver();
      return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
      score++;
      if (score < 17 ) {
        animationTime -= 5;
      } else {
        animationTime = 15;
      }
      apple.move(this.segments);
    } else {
      this.segments.pop();
    }
  }
  checkCollision(head) {
    const leftCollision = (head.col === 0);
    const topCollision = (head.row === 0);
    const rightCollision = (head.col === widthInBlocks - 1);
    const bottomCollision = (head.row === heightInBlocks - 1);

    const wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

    let selfCollision = false;

    for (let i = 0; i < this.segments.length; i++) {
      if (head.equal(this.segments[i])) {
        selfCollision = true;
      }
    }

    return wallCollision || selfCollision;
  }
  setDirection(newDirection) {
    if (this.direction === "up" && newDirection === "down") {
      return;
    } else if (this.direction === "right" && newDirection === "left") {
      return;
    } else if (this.direction === "down" && newDirection === "up") {
      return;
    } else if (this.direction === "left" && newDirection === "right") {
      return;
    }

    this.nextDirection = newDirection;
  }
};

// constructor Apple
class Apple {
  constructor() {
    this.position = new Block(10, 10);
  }
  draw() {
    this.position.drawCircle('SeaGreen');
  }
  move(otherBlock) {
    let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);

    let index = otherBlock.length - 1;
      while ( index >= 0 ) {
        if (this.position.equal(otherBlock[index])) {
          this.move(otherBlock);
          return;
        }
        index--;
      }
  }
}

const snake = new Snake();
const apple = new Apple();

// setTimeout
let animationTime = 100;
let playing = true;

const gameLoop = () => {
  ctx.clearRect(0, 0, width, height);
  drawScore();
  snake.move();
  snake.draw();
  apple.draw();
  drawBorder();
  if (playing) {
    setTimeout(gameLoop, animationTime);
  }
};

gameLoop();

// keyboard events
const directions = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

const body = document.querySelector('body');

body.addEventListener('keydown', (e) => {
  const newDirection = directions[e.keyCode];

  if (newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
})