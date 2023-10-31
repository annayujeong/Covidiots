const MAX_BOX = 81;
const rows = 9;
const cols = 9;
const initialValue = 0;
let progressBarContainer = document.getElementById("progress-bar-container");
let progressBar = document.getElementById("progress-bar");
let isProgressBarActive = false;
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
  let wrapper = document.getElementById("wrapper");
  for (var i = 0; i < MAX_BOX; i++) {
    var box = document.createElement("div");
    box.className = "box";
    box.id = i;
    wrapper.appendChild(box);
  }
  wrapper.id = "board";
  initializeBoardWithDoors();
  array[startingX][startingY] = 1;
  changeCellColor(startingX, startingY);
}

function initializeBoardWithDoors() {
  // spawns doors in the middle of each side
  let middleX = Math.floor(rows / 2);
  let middleY = Math.floor(cols / 2);
  addDoor(middleX, 0);
  addDoor(middleX, cols - 1);
  addDoor(0, middleY);
  addDoor(rows - 1, middleY);
}

function addDoor(x, y) {
  let cellId = rows * x + y;
  let cell = document.getElementById(cellId);
  cell.className = "door";
}

function changeCellColor(x, y) {
  let cellId = rows * x + y;
  let cell = document.getElementById(cellId);
  if (cell.className === "target") {
    cell.className = "box";
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
  let prevX = 4;
  let prevY = 4;
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
  if (destX < 0 || destX >= rows || destY < 0 || destY >= cols) {
    return false;
  }
  if (document.getElementById(rows * destX + destY).className === "door") {
    return false;
  }
  return true;
}
