import { updateResource, useItem } from "./hud.js";

var connection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();
let players;

const MAX_TILES = 121;
const rows = 11;
const cols = 11;
const doorOpeningSpeed = 20; // in milliseconds per 1% of the progress bar width
const wrapper = document.getElementById("wrapper");
const startingX = 5;
const startingY = 5;
const items = ["fries", "toilet-paper", "water"];

let progressBarContainer = document.createElement("div");
let progressBar = document.createElement("div");
let isProgressBarActive = false;
let floorArray = [];

function initializeBoard(posX, posY) {
	for (let i = 0; i < MAX_TILES; i++) {
		// populate the board with tiles that can be either floor or wall or door
		let floor = document.createElement("div");
		let wall = document.createElement("div");
		let door = document.createElement("div");
		// add walls to the outer edges of the board
		if (
			i < rows ||
			i > MAX_TILES - rows ||
			i % rows === 0 ||
			i % rows === rows - 1
		) {
			// add doors to the middle of the outer edges of the board
			if (i === 5 || i === 55 || i === 65 || i === MAX_TILES - 6) {
				// hard code LOL
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
			floorArray.push(i);
			wrapper.appendChild(floor);
		}
	}
	wrapper.id = "board";
	initializeProgressBar();
	let targetPosition = rows * posX + posY;	
	let target = document.getElementById(targetPosition);
	target.className = "target";

	floorArray = floorArray.filter((item) => item !== targetPosition);
	connection.invoke("LocateResources", floorArray).catch(function (err) {
		return console.error(err.toString());
	});
}

connection.on("locateResources", (serverRes) => {
	placeItemRandomlyOnBoard(serverRes);
});

function placeItemRandomlyOnBoard(serverRes) {
	for (let resource of serverRes) {
		let item = document.getElementById(resource["itemPosition"]);
		item.className = items[resource["itemIndex"]];
		itemPositions.push(resource["itemPosition"]); // Keep track of item positions
	}
}

function initializeProgressBar() {
	// Create the progress bar div and hides it by default
	progressBarContainer.id = "progress-bar-container";
	progressBarContainer.style.display = "none";
	progressBar.id = "progress-bar";
	progressBarContainer.appendChild(progressBar);
	wrapper.appendChild(progressBarContainer);
}

let isResource = false;
let resourceBlock = null;

document.addEventListener("DOMContentLoaded", function () {
	connection.start().then(function () {
		players = JSON.parse(
			document.getElementById("players").innerHTML.slice(0, -2)
		);
		let player = document.getElementById("user").innerHTML;

		let prevX;
		let prevY;
		if (players[player] != null) {
			prevX = players[player].xPos;
			prevY = players[player].yPos;
		} else {
			prevX = startingX;
			prevY = startingY;
		}

		let destX = prevX;
		let destY = prevY;
		console.log(prevX, prevY);
		initializeBoard(prevX, prevY);

		for (let key in players) {
			let value = players[key];

			if (value.Email != player) {
				document.getElementById(
					rows * value.xPos + value.yPos
				).className = "otherPlayer";
			}
		}

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
					// Use number keys to use items
					if (!isNaN(key) && key >= 1 && key <= 8) {
						useItem(key);
					}
					break;
			}
			while (isProgressBarActive) {
				// Prevent movement while the progress bar is active
				destX = prevX;
				destY = prevY;
				// check if the progress bar is active every 100ms
				setTimeout(() => {}, 100);
				return;
			}

			// Collect resource if it is resource block and spacebar is pressed
			if (isResource && key === " ") {
				collectResource();
				return;
			}

			let destBlock = document.getElementById(rows * destX + destY);
			if (destBlock.className === "door") {
				if (!isProgressBarActive) {
					showProgressBar();
				}
			}

			// Check if the dest block is resource
			if (items.includes(destBlock.className)) {
				isResource = true;
				resourceBlock = destBlock;
			} else {
				isResource = false;
				resourceBlock = null;
			}

			// Keep the previous position if false
			if (isValidMovement(destX, destY) === false) {
				destX = prevX;
				destY = prevY;
			}
			switchCellClass(prevX, prevY, destX, destY);
			prevX = destX;
			prevY = destY;
			connection
				.invoke(
					"playerMove",
					player,
					destX.toString(),
					destY.toString()
				)
				.catch(function (err) {
					return console.error(err.toString());
				});
		});
	});
});

function collectResource() {
	Promise.resolve(showProgressBar())
		.then(function () {
			updateResource(resourceBlock.className);
			connection
				.invoke("UpdateResources", resourceBlock.id)
				.catch(function (err) {
					return console.error(err.toString());
				});
			isResource = false;
		})
		.catch(function (error) {
			console.error(error);
		});
}

connection.on("updateResource", (id) => {
    let resBlock = document.getElementById(id);
    resBlock.className = "floor";
});

function showProgressBar() {
	progressBar.style.width = "0%"; // Reset the progress bar
	progressBarContainer.style.display = "block"; // Show the progress bar container
	isProgressBarActive = true;
	let width = 0;
	let intervalId = setInterval(() => {
		if (width >= 100) {
			// Stop the interval when the progress bar reaches 100%
			clearInterval(intervalId); // Stop the interval
			progressBar.style.width = "0%"; // Reset the progress bar
			progressBarContainer.style.display = "none"; // Hide the progress bar container
			isProgressBarActive = false;
		} else {
			width++;
			progressBar.style.width = width + "%"; // Increase the progress bar width by 1%
		}
	}, doorOpeningSpeed);
}

const switchCellClass = (prevX, prevY, destX, destY) => {
	let prevCell = document.getElementById(rows * prevX + prevY);
	let destCell = document.getElementById(rows * destX + destY);
	let tempCell = prevCell.className;
	prevCell.className = destCell.className;
	destCell.className = tempCell;
};

function isValidMovement(destX, destY) {
	// Prevent movement if colliding outside the grid
	let permittedCells = ["floor", "door"];
	let cell = document.getElementById(rows * destX + destY);
	if (!permittedCells.includes(cell.className)) {
		return false;
	}
	return true;
}

connection.on("playerMove", (playerName, x, y) => {
	console.log("playerMove");
	let intX = parseInt(x);
	let intY = parseInt(y);
	switchCellClass(
		players[playerName].xPos,
		players[playerName].yPos,
		intX,
		intY
	);
	players[playerName].xPos = intX;
	players[playerName].yPos = intY;
});

connection.on("update", () => {});

connection.on("LeaveGame", (playerKey) => 
{
	delete players[playerKey];
});