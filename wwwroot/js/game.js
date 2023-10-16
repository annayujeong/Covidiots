class GameBoard {
	constructor(id) {
		this.id = id;
	}
}

class Cell {
	constructor(id) {
		this.id = id;
	}
}

class User {
	constructor(id) {
		this.id = id;
	}
}

const MAX_BOX = 160;
const rows = 10;
const cols = 16;
const initialValue = 0;

const array = Array.from({ length: cols }, () =>
	Array.from({ length: rows }, () => initialValue)
);

function initializeBoard(startingX, startingY) {
	let wrapper = document.getElementById("wrapper");
	for (var i = 0; i < MAX_BOX; i++) {
		var box = document.createElement("div");
		box.className = "box";
		box.id = i;
		box.innerHTML = i;
		wrapper.appendChild(box);
	}
	wrapper.id = "board";
	array[startingX][startingY] = 1;

	// Add user to the starting point
	changeCellColor(startingX, startingY);
}

function changeCellColor(x, y) {
	let cellId = cols * y + x;
	console.log(cellId);
	let cell = document.getElementById(cellId);

	// if (cell.className === "target") {
	// 	cell.className = "box";
	// } else {
	// 	cell.className = "target";
	// }

	// TODO: need to factor this out in the object
	if (cell.hasChildNodes()) {
        let user = document.getElementById("user");
        cell.removeChild(user);
        console.log("yes removed");
	} else {
        let newUser = document.createElement("div");
        newUser.id = "user";
        newUser.style.zIndex = "1";
		cell.appendChild(newUser);
        console.log("no appened");
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
				destY -= 1;
				break;
			case "ArrowDown":
				destY += 1;
				break;
			case "ArrowLeft":
				destX -= 1;
				break;
			case "ArrowRight":
				destX += 1;
				break;
			default:
				break;
		}
		console.log(prevX, prevY, destX, destY);
		move(prevX, prevY, destX, destY);
		prevX = destX;
		prevY = destY;
	});
});
