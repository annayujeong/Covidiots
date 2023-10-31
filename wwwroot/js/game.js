const MAX_TILES = 121;
const rows = 11;
const cols = 11;
const initialValue = 0;
let progressBarContainer = document.createElement("div");
let progressBar = document.createElement("div");
let wrapper = document.getElementById("wrapper");
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
  }, 20); // Increase the progress bar width every 20 milliseconds
}

function hideProgressBar() {
  progressBar.style.width = "0%";
  progressBarContainer.style.display = "none"; // Hide the progress bar container
  isProgressBarActive = false;
}

function initializeBoard(startingX, startingY) {
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
  array[startingX][startingY] = 1;
  changeCellColor(startingX, startingY);
}

function initializeProgressBar() { // Create the progress bar div and hides it by default
  progressBarContainer.id = "progress-bar-container";
  progressBarContainer.style.display = "none";
  progressBar.id = "progress-bar";
  progressBarContainer.appendChild(progressBar);
  wrapper.appendChild(progressBarContainer);
}

function changeCellColor(x, y) { // Used to indicate the player's position
  let cellId = rows * x + y;
  let cell = document.getElementById(cellId);
  if (cell.className === "target") { // target is the player
    cell.className = "floor";
  } else {
    cell.className = "target";
  }
}

function move(prevX, prevY, destX, destY) {
  array[prevX][prevY] = 0;
  array[destX][destY] = 1;
  changeCellColor(prevX, prevY);
  changeCellColor(destX, destY);
}

document.addEventListener("DOMContentLoaded", function () {
  let prevX = 5;
  let prevY = 5;
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

function isValidMovement(destX, destY) {
  // Prevent movement if colliding with wall or door
  if (destX < 1 || destX > (rows - 2) || destY < 1 || destY > (cols - 2)) {
    return false;
  }
  if (document.getElementById(rows * destX + destY).className === "door" || document.getElementById(rows * destX + destY).className === "wall") {
    return false;
  }
  return true;
}
