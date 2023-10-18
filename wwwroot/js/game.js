function GameBoard(id) {
	this.id = id;
}

function Cell(id) {
	this.id = id;
}

const MAX_BOX = 81;
const rows = 9;
const cols = 9;
const initialValue = 0;

const array = Array.from({ length: rows }, () =>
	Array.from({ length: cols }, () => initialValue)
);

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
	const middleX = Math.floor(rows / 2);
	const middleY = Math.floor(cols / 2);

	addDoor(middleX, 0);
	addDoor(middleX, cols - 1);
	addDoor(0, middleY);
	addDoor(rows - 1, middleY);
}

function addDoor (x, y) {
	let cellId = rows * x + y;
	let cell = document.getElementById(cellId);
	cell.className = "door";
}

// change the color of the cell
function changeCellColor(x, y) { 
	let cellId = rows * x + y;
	let cell = document.getElementById(cellId);

	if (cell.className === "target") { // target is the player
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
		// check if user is using Arrow keys to move
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
		// Prevent movement if the user tries to move out of bounds; keep the previous position
		if (destX < 0 || destX >= rows || destY < 0 || destY >= cols) {
			destX = prevX;
			destY = prevY;
		} 
		// Prevent movement if it is a door
		else if (document.getElementById(rows * destX + destY).className === "door") {
			destX = prevX;
			destY = prevY;
		}
		
        move(prevX, prevY, destX, destY);
        prevX = destX;
        prevY = destY;
	});
});
