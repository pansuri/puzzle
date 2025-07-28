const board = document.getElementById("game-board");
const pieces = [];

for (let i = 0; i < 9; i++) {
  const div = document.createElement("div");
  div.classList.add("piece");
  div.setAttribute("draggable", true);

  const row = Math.floor(i / 3);
  const col = i % 3;
  div.style.backgroundImage = "url('images/puzzle1.jpg')";
  div.style.backgroundPosition = `-${col * 200}px -${row * 200}px`;

  div.dataset.correctIndex = i;
  pieces.push(div);
}

// Shuffle
pieces.sort(() => Math.random() - 0.5);
pieces.forEach((p, i) => {
  p.dataset.index = i;
  board.appendChild(p);
});

// Drag logic
let dragged;

document.querySelectorAll(".piece").forEach(piece => {
  piece.addEventListener("dragstart", e => {
    dragged = piece;
  });

  piece.addEventListener("dragover", e => {
    e.preventDefault();
  });

  piece.addEventListener("drop", e => {
    e.preventDefault();
    if (dragged === piece) return;

    const draggedIndex = dragged.dataset.index;
    const targetIndex = piece.dataset.index;

    const temp = document.querySelector(`[data-index='${targetIndex}']`);
    dragged.dataset.index = targetIndex;
    temp.dataset.index = draggedIndex;

    board.insertBefore(dragged, temp);
    board.insertBefore(temp, board.children[draggedIndex]);
  });
});
