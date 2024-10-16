const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// সাপের বৈশিষ্ট্য
let snake = [{x: 200, y: 200}];
let direction = {x: 10, y: 0};
let food = {x: 300, y: 300};
let score = 0;
let baseSpeed = 300;  // প্রাথমিক গতি
let speed = baseSpeed; // চলমান গতি
let fastSpeed = 100;  // অ্যারো চেপে ধরলে দ্রুত গতি
let gameLoopInterval = null; // গেম লুপ শুরুতে নাল রাখা হয়েছে
let isPaused = false;  // গেমটি PAUSE অবস্থায় আছে কিনা তা নির্ধারণ করবে

function gameLoop() {
  update();
  draw();
}

// সাপের অবস্থান আপডেট করা
function update() {
  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10};

    // প্রতিটি খাবার খাওয়ার পর গতি ১ পয়েন্ট করে বাড়বে
    baseSpeed = Math.max(baseSpeed - 10, 50); // প্রতিটি খাবার পর গতি বাড়বে, তবে সর্বনিম্ন ৫০ রাখা হয়েছে
    speed = baseSpeed;  // নতুন গতির সাথে মানানসই
    
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, speed); // নতুন গতির সাথে গেম লুপ চলবে
  } else {
    snake.pop();
  }

  // দেয়ালে আঘাত লাগলে গেম ওভার
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    alert('গেম ওভার! আপনার স্কোর: ' + score);
    resetGame();
  }
}

// গেম রিসেট করা
function resetGame() {
  snake = [{x: 200, y: 200}];
  direction = {x: 10, y: 0};
  score = 0;
  baseSpeed = 300; // রিসেটের পর প্রাথমিক গতি পুনরায় শুরু
  speed = baseSpeed;
  clearInterval(gameLoopInterval);
  gameLoopInterval = null;
  isPaused = false; // গেম শুরু হলে PAUSE নয়
  draw(); // রিসেট করার পর আবার ক্যানভাসে আঁকা হবে
}

// সাপ আঁকা
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.forEach((part, index) => {
    const color = index === 0 ? 'darkgreen' : 'lime';
    ctx.fillStyle = color;
    ctx.fillRect(part.x, part.y, 10, 10);
  });
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, 10, 10);
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 20);
}

// অ্যারো বাটন চেপে ধরলে দ্রুত গতি
let arrowPressed = false;

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' && direction.y === 0) direction = {x: 0, y: -10};
  if (event.key === 'ArrowDown' && direction.y === 0) direction = {x: 0, y: 10};
  if (event.key === 'ArrowLeft' && direction.x === 0) direction = {x: -10, y: 0};
  if (event.key === 'ArrowRight' && direction.x === 0) direction = {x: 10, y: 0};
});

// অ্যারো বাটন চেপে ধরলে গতি দ্রুত হবে
document.addEventListener('keydown', (event) => {
  if (!arrowPressed && (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    arrowPressed = true;
    speed = fastSpeed;  // দ্রুত গতি সেট করা
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, speed); // দ্রুত গতি সহ গেম লুপ
  }
});

// অ্যারো বাটন ছেড়ে দিলে আগের গতি ফিরে আসবে
document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    arrowPressed = false;
    speed = baseSpeed;  // আগের গতি ফিরিয়ে আনা
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, speed); // গেম লুপ আগের গতিতে চলবে
  }
});

// SPACEBAR দিয়ে PLAY এবং PAUSE নিয়ন্ত্রণ করা
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !arrowPressed) {
    if (!isPaused) {
      // PAUSE করা
      clearInterval(gameLoopInterval); 
      gameLoopInterval = null;
      isPaused = true;
    } else {
      // PLAY করা
      gameLoopInterval = setInterval(gameLoop, speed); 
      isPaused = false;
    }
  }
});

// PLAY এবং PAUSE বোতামের জন্য ইভেন্ট লিসেনার
document.getElementById('playBtn').addEventListener('click', () => {
  if (!gameLoopInterval) {
    gameLoopInterval = setInterval(gameLoop, speed); // গেম লুপ শুরু
    isPaused = false; // গেম শুরু হলে PAUSE নয়
  }
});

document.getElementById('pauseBtn').addEventListener('click', () => {
  clearInterval(gameLoopInterval); // গেম লুপ বন্ধ করা (Pause)
  gameLoopInterval = null;
  isPaused = true;
});
