const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const overlay = document.getElementById('overlay');
const subText = document.getElementById('subText');
const highScoreEl = document.getElementById('highScore');

const GRID = 20;
const COLS = canvas.width / GRID;
const ROWS = canvas.height / GRID;

let snake, dir, food, score, bestScore = 0, gameLoop, playing = false;

function init() {
  snake = [{ x: 10, y: 10 }];
  dir = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = '0';
  placeFood();
}

function placeFood() {
  do {
    food = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS)
    };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // grid
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      ctx.strokeRect(i * GRID, j * GRID, GRID, GRID);
    }
  }

  // food
  ctx.shadowColor = '#ff6b6b';
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#ff6b6b';
  ctx.beginPath();
  ctx.arc(food.x * GRID + GRID/2, food.y * GRID + GRID/2, GRID/2 - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // snake
  snake.forEach((seg, i) => {
    const alpha = 1 - (i / snake.length) * 0.6;
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = i === 0 ? 12 : 6;
    ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
    ctx.beginPath();
    ctx.roundRect(seg.x * GRID + 1, seg.y * GRID + 1, GRID - 2, GRID - 2, 4);
    ctx.fill();
  });
  ctx.shadowBlur = 0;
}

function update() {
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
      snake.some(s => s.x === head.x && s.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function gameOver() {
  clearInterval(gameLoop);
  playing = false;
  bestScore = Math.max(bestScore, score);
  subText.textContent = '아무 키나 눌러 재시작';
  highScoreEl.textContent = `최고 점수: ${bestScore}`;
  overlay.classList.remove('hidden');
}

function start() {
  init();
  overlay.classList.add('hidden');
  playing = true;
  const speed = 120;
  gameLoop = setInterval(update, speed);
}

function changeDir(x, y) {
  if (dir.x === -x || dir.y === -y) return;
  dir = { x, y };
}

document.addEventListener('keydown', (e) => {
  if (!playing) { start(); return; }
  const map = { ArrowUp: [0,-1], ArrowDown: [0,1], ArrowLeft: [-1,0], ArrowRight: [1,0] };
  if (map[e.key]) {
    e.preventDefault();
    changeDir(...map[e.key]);
  }
});

// Mobile controls
document.getElementById('upBtn').addEventListener('click', () => { if (!playing) start(); else changeDir(0, -1); });
document.getElementById('downBtn').addEventListener('click', () => { if (!playing) start(); else changeDir(0, 1); });
document.getElementById('leftBtn').addEventListener('click', () => { if (!playing) start(); else changeDir(-1, 0); });
document.getElementById('rightBtn').addEventListener('click', () => { if (!playing) start(); else changeDir(1, 0); });

init();
draw();