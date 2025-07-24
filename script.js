let playerName = "";
let timer = 0;
let timerInterval;

function setLevel(level) {
  const gridSelect = document.getElementById("gridSize");
  gridSelect.innerHTML = "";

  let min = 3, max = 5;
  if (level === "advanced") { min = 6; max = 10; }
  else if (level === "expert") { min = 11; max = 15; }

  for (let i = min; i <= max; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${i} x ${i}`;
    gridSelect.appendChild(opt);
  }

  document.documentElement.style.setProperty('--grid-size', min); // default ukuran awal
}

function startGame() {
  playerName = document.getElementById("playerName").value.trim();
  if (playerName === "") return alert("Masukkan nama dulu ya!");

  const selectedSize = parseInt(document.getElementById("gridSize").value);
  document.documentElement.style.setProperty('--grid-size', selectedSize);

  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  document.getElementById("greeting").textContent = `Halo, ${playerName}!`;

  createPuzzle(selectedSize);
  startTimer();
}

function startTimer() {
  timer = 0;
  document.getElementById("timer").textContent = timer;
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function createPuzzle(size) {
  const container = document.getElementById("puzzle-container");
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${size}, var(--tile-size))`;
  container.style.gridTemplateRows = `repeat(${size}, var(--tile-size))`;

  const positions = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      positions.push({ x, y });
    }
  }

  const shuffled = [...positions].sort(() => Math.random() - 0.5);

  shuffled.forEach((shuffledPos, index) => {
    const correctPos = positions[index];
    const div = document.createElement("div");
    div.className = "tile";
    div.draggable = true;
    div.dataset.correct = `${correctPos.x},${correctPos.y}`;
    div.dataset.current = `${shuffledPos.x},${shuffledPos.y}`;
    div.style.backgroundPosition = `-${shuffledPos.x * 80}px -${shuffledPos.y * 80}px`;
    div.addEventListener("dragstart", dragStart);
    div.addEventListener("dragover", dragOver);
    div.addEventListener("drop", drop);
    container.appendChild(div);
  });
}

let draggedTile = null;

function dragStart(e) {
  draggedTile = e.target;
  draggedTile.classList.add("dragging");
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (!draggedTile || draggedTile === e.target) return;

  // swap posisi background
  const tempBG = draggedTile.style.backgroundPosition;
  draggedTile.style.backgroundPosition = e.target.style.backgroundPosition;
  e.target.style.backgroundPosition = tempBG;

  // swap posisi data current
  const tempCurrent = draggedTile.dataset.current;
  draggedTile.dataset.current = e.target.dataset.current;
  e.target.dataset.current = tempCurrent;

  draggedTile.classList.remove("dragging");

  checkWin();
}

function checkWin() {
  const tiles = document.querySelectorAll(".tile");
  for (let tile of tiles) {
    if (tile.dataset.current !== tile.dataset.correct) return;
  }
  stopTimer();
  setTimeout(() => {
    alert(`🎉 Hebat ${playerName}! Kamu menyelesaikan puzzle dalam ${timer} detik!`);
  }, 300);
}

function restartGame() {
  stopTimer();
  const size = parseInt(document.getElementById("gridSize").value);
  createPuzzle(size);
  startTimer();
}

function showHint() {
  const hintOverlay = document.getElementById("hintOverlay");

  hintOverlay.classList.remove("hint-hidden");

  setTimeout(() => {
    hintOverlay.classList.add("hint-hidden");
  }, 5000);
}

