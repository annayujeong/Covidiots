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
	array[startingX][startingY] = 1;
	changeCellColor(startingX, startingY);
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
		switch (event.key) {
			case "ArrowUp":
				destX -= 1;
				break;
			case "ArrowDown":
				destX += 1;
				break;
			case "ArrowLeft":
				destY -= 1;
				break;
			case "ArrowRight":
				destY += 1;
				break;
			default:
				break;
		}
        move(prevX, prevY, destX, destY);
        prevX = destX;
        prevY = destY;
	});
});
