// COLOR CONSTANTS
const CANVAS_COLOR = '#006000';
const PRIMARY_COLOR = '#00FF00';

// Select canvas element and access it's context
const CANVAS = document.getElementById('canvas');
const ctx = CANVAS.getContext('2d');

// Array of current snake segments
let snake = [
  {x: 200, y: 200},
  {x: 190, y: 200},
  {x: 180, y: 200},
  {x: 170, y: 200},
];

let score = 0;
const pageScore = document.getElementById('score').textContent = score.toString();

let food;
createFood();

// State of direction change event
let directionChange = false;

// State of current game
let gameOver = true;

// Current x and y movement
let xMovement = 10;
let yMovement = 0;

clearCanvas();
renderSnake();
renderFood();

// Start game
function startGame(e) {
  if (e.type === 'click' || e.keyCode == 13 && gameOver) {
    gameOver = false;
    score = 0;
    document.getElementById('score').textContent = score.toString();
    snake = [
      {x: 200, y: 200},
      {x: 190, y: 200},
      {x: 180, y: 200},
      {x: 170, y: 200},
    ];
    xMovement = 10;
    yMovement = 0;

    document.getElementById('game-over').style.display = 'none';
    document.getElementById('start-game').style.display = 'none';

    clearCanvas();
    createFood();
    renderSnake();
    renderFood();
    game();
  }
}

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('play-again').addEventListener('click', startGame);
document.addEventListener('keydown', startGame);
document.addEventListener('keydown', startGame);

document.addEventListener('keydown', checkDirectionChange);

function game() {
  if (gameOver) return;
  directionChange = false;

  setTimeout(() => {
    checkGameOver();
    if (gameOver) {
      document.getElementById('game-over').style.display = 'flex';
      return;
    }
    clearCanvas();
    moveSnake();
    renderSnake();
    renderFood();
    game();
  }, 100);
}

function clearCanvas() {
  ctx.fillStyle = CANVAS_COLOR;
  ctx.strokeStyle = PRIMARY_COLOR;

  ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
  ctx.strokeRect(0, 0, CANVAS.width, CANVAS.height);
}

function renderSnake() {
  ctx.fillStyle = PRIMARY_COLOR;
  ctx.strokeStyle = CANVAS_COLOR;

  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, 10, 10);
    ctx.strokeRect(segment.x, segment.y, 10, 10);
  });
}

function checkDirectionChange(e) {
  const LEFT_KEY = 37;
  const UP_KEY = 38;
  const RIGHT_KEY = 39;
  const DOWN_KEY = 40;

  if (directionChange) return;
  directionChange = true;

  const movingUp = yMovement === -10;
  const movingDown = yMovement === 10;
  const movingLeft = xMovement === -10;
  const movingRight = xMovement === 10;

  if (e.keyCode == LEFT_KEY && !movingRight) {
    xMovement = -10;
    yMovement = 0;
  }
  if (e.keyCode == UP_KEY && !movingDown) {
    xMovement = 0;
    yMovement = -10;
  }
  if (e.keyCode == RIGHT_KEY && !movingLeft) {
    xMovement = 10;
    yMovement = 0;
  }
  if (e.keyCode == DOWN_KEY && !movingUp) {
    xMovement = 0;
    yMovement = 10;
  }
}

function moveSnake() {
  const head = { x: snake[0].x + xMovement, y: snake[0].y + yMovement };
  const eating = checkEat();
  if (eating) {
    snake.unshift(head);
    score += 10;
    createFood();
    document.getElementById('score').textContent = score;
  } else {
    snake.unshift(head);
    snake.pop();
  }
}

function getAvailableLocations() {
  const allLocations = [];
  for (let x = 0; x < CANVAS.width; x += 10) {
    for (let y = 0; y < CANVAS.height; y += 10) {
      allLocations.push({ x: x, y: y });
    }
  }

  const snakePositions = new Set(snake.map(segment => `${segment.x},${segment.y}`));
  const availableLocations = allLocations.filter(loc => !snakePositions.has(`${loc.x},${loc.y}`));

  return availableLocations;
}

function createFood() {
  const availableLocations = getAvailableLocations();
  if (availableLocations.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * availableLocations.length);

  food = availableLocations[randomIndex];
}

function renderFood() {
  ctx.fillStyle = PRIMARY_COLOR;
  ctx.strokeStyle = CANVAS_COLOR;
  ctx.fillRect(food.x, food.y, 10, 10);
  ctx.strokeRect(food.x, food.y, 10, 10);
}

function checkEat() {
  const currentFood = `${food.x},${food.y}`;
  return snake.some(segment => `${segment.x},${segment.y}` === currentFood);
}

function checkGameOver() {
  if (snake[0].x >= CANVAS.width || snake[0].x < 0 ||
      snake[0].y >= CANVAS.height || snake[0].y < 0) {
    gameOver = true;
    return;
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      gameOver = true;
      return;
    }
  }
}