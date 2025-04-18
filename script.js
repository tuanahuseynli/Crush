const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const width = 8;
const squares = [];
let score = 0;

const candyColors = [
  'url(media/red.png)',
  'url(media/yellow.png)',
  'url(media/orange.png)',
  'url(media/purple.png)',
  'url(media/green.png)',
  'url(media/blue.png)'
];

// Create board
function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    square.setAttribute('draggable', true);
    square.setAttribute('id', i);
    const randomColor = Math.floor(Math.random() * candyColors.length);
    square.style.backgroundImage = candyColors[randomColor];
    grid.appendChild(square);
    squares.push(square);
  }
}
createBoard();

// Dragging
let colorBeingDragged;
let colorBeingReplaced;
let squareIdBeingDragged;
let squareIdBeingReplaced;

squares.forEach(square => {
  square.addEventListener('dragstart', dragStart);
  square.addEventListener('dragend', dragEnd);
  square.addEventListener('dragover', dragOver);
  square.addEventListener('dragenter', dragEnter);
  square.addEventListener('dragleave', dragLeave);
  square.addEventListener('drop', dragDrop);
});

function dragStart() {
  colorBeingDragged = this.style.backgroundImage;
  squareIdBeingDragged = parseInt(this.id);
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.classList.add('drag-over');
}

function dragLeave() {
  this.classList.remove('drag-over');
}

function dragDrop() {
  this.classList.remove('drag-over');
  colorBeingReplaced = this.style.backgroundImage;
  squareIdBeingReplaced = parseInt(this.id);
  this.style.backgroundImage = colorBeingDragged;
  squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
}

function dragEnd() {
  const validMoves = [
    squareIdBeingDragged - 1,
    squareIdBeingDragged - width,
    squareIdBeingDragged + 1,
    squareIdBeingDragged + width
  ];
  const validMove = validMoves.includes(squareIdBeingReplaced);

  if (squareIdBeingReplaced && validMove) {
    squareIdBeingReplaced = null;
  } else if (squareIdBeingReplaced && !validMove) {
    squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
  } else {
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
  }
}

// Move candies down
function moveIntoSquareBelow() {
  for (let i = 0; i < 55; i++) {
    if (squares[i + width].style.backgroundImage === '') {
      squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
      squares[i].style.backgroundImage = '';
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      if (firstRow.includes(i) && squares[i].style.backgroundImage === '') {
        const randomColor = Math.floor(Math.random() * candyColors.length);
        squares[i].style.backgroundImage = candyColors[randomColor];
      }
    }
  }
}

// Match checks
function checkRowForFour() {
  const notValid = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55];
  for (let i = 0; i < 60; i++) {
    if (notValid.includes(i)) continue;

    const rowOfFour = [i, i + 1, i + 2, i + 3];
    const decidedColor = squares[i].style.backgroundImage;
    const isBlank = decidedColor === '';

    if (rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
      score += 4;
      scoreDisplay.textContent = score;
      rowOfFour.forEach(index => squares[index].style.backgroundImage = '');
    }
  }
}

function checkColumnForFour() {
  for (let i = 0; i < 39; i++) {
    const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
    const decidedColor = squares[i].style.backgroundImage;
    const isBlank = decidedColor === '';

    if (columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
      score += 4;
      scoreDisplay.textContent = score;
      columnOfFour.forEach(index => squares[index].style.backgroundImage = '');
    }
  }
}

function checkRowForThree() {
  const notValid = [6, 7, 14,15,22,23,30,31,38,39,46,47,54,55];
  for (let i = 0; i < 61; i++) {
    if (notValid.includes(i)) continue;

    const rowOfThree = [i, i + 1, i + 2];
    const decidedColor = squares[i].style.backgroundImage;
    const isBlank = decidedColor === '';

    if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
      score += 3;
      scoreDisplay.textContent = score;
      rowOfThree.forEach(index => squares[index].style.backgroundImage = '');
    }
  }
}

function checkColumnForThree() {
  for (let i = 0; i < 47; i++) {
    const columnOfThree = [i, i + width, i + width * 2];
    const decidedColor = squares[i].style.backgroundImage;
    const isBlank = decidedColor === '';

    if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
      score += 3;
      scoreDisplay.textContent = score;
      columnOfThree.forEach(index => squares[index].style.backgroundImage = '');
    }
  }
}

// Game loop
setInterval(() => {
  checkRowForFour();
  checkColumnForFour();
  checkRowForThree();
  checkColumnForThree();
  moveIntoSquareBelow();
}, 100);
