const MAX_TILES = 121;
const rows = 11;
const cols = 11;
const initialValue = 0;
const doorOpeningSpeed = 20; // in milliseconds per 1% of the progress bar width
const wrapper = document.getElementById("wrapper");
const startingX = 5;
const startingY = 5;
let progressBarContainer = document.createElement("div");
let progressBar = document.createElement("div");
let isProgressBarActive = false;

// Create a 2D array with the specified number of rows and columns
const array = Array.from({ length: rows }, () =>
  Array.from({ length: cols }, () => initialValue)
); 

function GameBoard(id) {
  this.id = id;
}

function Cell(id) {
  this.id = id;
}

function showProgressBar() {
  progressBar.style.width = "0%"; // Reset the progress bar
  progressBarContainer.style.display = "block"; // Show the progress bar container
  isProgressBarActive = true;

  let width = 0;
  let intervalId = setInterval(() => {
    if (width >= 100) { // Stop the interval when the progress bar reaches 100%
      clearInterval(intervalId);
      hideProgressBar();
    } else {
      width++; 
      progressBar.style.width = width + '%'; // Increase the progress bar width by 1%
    }
  }, doorOpeningSpeed);
}

function hideProgressBar() {
  progressBar.style.width = "0%";
  progressBarContainer.style.display = "none"; // Hide the progress bar container
  isProgressBarActive = false;
}

function initializeBoard(posX, posY) {
  for (let i = 0; i < MAX_TILES; i++) { // populate the board with tiles that can be either floor or wall or door
    let floor = document.createElement("div");
    let wall = document.createElement("div");
    let door = document.createElement("div");
    // add walls to the outer edges of the board
    if (i < rows || i > MAX_TILES - rows || i % rows === 0 || i % rows === rows - 1) {
      // add doors to the middle of the outer edges of the board
      if (i === 5 || i === 55 || i === 65 || i === MAX_TILES - 6) { // hard code LOL
        door.className = "door";
        door.id = i;
        wrapper.appendChild(door);
      } else {
        wall.className = "wall";
        wall.id = i;
        wrapper.appendChild(wall);
      }
    } else {
      floor.className = "floor";
      floor.id = i;
      wrapper.appendChild(floor);
    }
  }
  wrapper.id = "board";
  initializeProgressBar();
  array[posX][posY] = 1;
  let target = document.getElementById(rows * posX + posY);
  target.className = "target";
}

function initializeProgressBar() { // Create the progress bar div and hides it by default
  progressBarContainer.id = "progress-bar-container";
  progressBarContainer.style.display = "none";
  progressBar.id = "progress-bar";
  progressBarContainer.appendChild(progressBar);
  wrapper.appendChild(progressBarContainer);
}

document.addEventListener("DOMContentLoaded", function () {
  let prevX = startingX;
  let prevY = startingY;
  let destX = prevX;
  let destY = prevY;

  initializeBoard(prevX, prevY);

  document.addEventListener("keydown", function (event) {
    let key = event.key;
    if (key === "ArrowUp") {
      key = "w";
    }
    if (key === "ArrowDown") {
      key = "s";
    }
    if (key === "ArrowLeft") {
      key = "a";
    }
    if (key === "ArrowRight") {
      key = "d";
    }
    switch (key) {
      case "w":
        destX -= 1;
        break;
      case "s":
        destX += 1;
        break;
      case "a":
        destY -= 1;
        break;
      case "d":
        destY += 1;
        break;
      default:
        break;
    }
    if (document.getElementById(rows * destX + destY).className === "door") {
      if (!isProgressBarActive) {
        showProgressBar();
      }
    }
    // Keep the previous position if false
    if (isValidMovement(destX, destY) === false) {
      destX = prevX;
      destY = prevY;
    }
    move(prevX, prevY, destX, destY);
    prevX = destX;
    prevY = destY;
  });
});

function move(prevX, prevY, destX, destY) {
  array[prevX][prevY] = 0;
  array[destX][destY] = 1;
  switchCellClass(prevX, prevY, destX, destY);
}

switchCellClass = (prevX, prevY, destX, destY) => {
  let prevCell = document.getElementById(rows * prevX + prevY);
  let destCell = document.getElementById(rows * destX + destY);
  let tempCell = prevCell.className;
  prevCell.className = destCell.className;
  destCell.className = tempCell;
}

function isValidMovement(destX, destY) {
  // Prevent movement if colliding outside the grid
  let permittedCells = ["floor", "door"];
  let cell = document.getElementById(rows * destX + destY);
  if (!permittedCells.includes(cell.className)) {
    return false;
  }
  return true;
}
