const board = document.getElementById("board");
const statusText = document.getElementById("status");
const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");

let cells = Array(9).fill(null);
let currentPlayer = "X";
let gameActive = true;
let scores = { X: 0, O: 0 };

function createBoard() {
  board.innerHTML = "";
  cells.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  });
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!cells[index] && gameActive) {
    cells[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    if (checkWin()) {
      scores[currentPlayer]++;
      updateScores();
      launchConfetti();
      showPopup(`🎉 Player ${currentPlayer} Wins! 🎉`);
      gameActive = false;
    } else if (cells.every(cell => cell)) {
      showPopup("It's a Draw!");
      gameActive = false;
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

function checkWin() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diagonals
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => cells[index] === currentPlayer)
  );
}

function resetGame() {
  cells.fill(null);
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Player X's turn";
  createBoard();
}

function updateScores() {
  xScoreEl.textContent = scores.X;
  oScoreEl.textContent = scores.O;
}

function showPopup(message) {
  popupMessage.textContent = message;
  popup.style.display = "flex";
}

function closePopup() {
  popup.style.display = "none";
  resetGame();
}

// 🎉 Confetti / Popsicle Blast Effect
function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let confetti = [];
  for (let i = 0; i < 150; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 100,
      color: "hsl(" + Math.random() * 360 + ",100%,50%)",
      tilt: Math.floor(Math.random() * 10) - 10
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach((c) => {
      ctx.beginPath();
      ctx.fillStyle = c.color;
      ctx.fillRect(c.x, c.y, c.r, c.r * 2);
      ctx.fill();
    });
    update();
  }

  function update() {
    confetti.forEach((c) => {
      c.y += Math.cos(c.d) + 2;
      c.x += Math.sin(c.d);
      if (c.y > canvas.height) c.y = -10;
    });
  }

  let interval = setInterval(draw, 20);
  setTimeout(() => {
    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 4000);
}

createBoard();
