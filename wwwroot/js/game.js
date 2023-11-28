import { updateResource, useItem } from "./hud.js";

var connection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();
let players;

const MAX_TILES = 121;
const rows = 11;
const cols = 11;
const doorOpeningSpeed = 2; // in milliseconds per 1% of the progress bar width
const wrapper = document.getElementById("wrapper");
const startingX = 5;
const startingY = 5;
const items = ["fries", "toilet-paper", "water"];
const validKeys = ["w", "a", "s", "d", "1", "2", "3", "4", "5", "6", "7", "8", "m", "e", "q"]; // Update this so that error message is shown properly when invalid key is pressed

let progressBarContainer = document.createElement("div");
let progressBar = document.createElement("div");
let isProgressBarActive = false;
let floorArray = [];
let roomArray = [[], [], []];
let user;
let roomHeight = 3;

// Initializes the board with tiles that have classes of floor, wall, door, or player. It is organized
// in a 1D array. The board is 11x11, so the 1D array is 121 elements long.
// Players move around the board by changing the class of the tile. The class of the tile determines
// what the tile looks like and what the player can do with it.
// Movement is done by adding x and y coordinates to the player's current position.
function initializeBoard(posX, posY) {
	let count = 0;
	for (let y = 0; y < roomHeight; y++) 
	{
		for (let x = 0; x < roomHeight; x++) {
			let wrapper = document.createElement("div");
			wrapper.hidden = true;

			if(user.xRoom === x && user.yRoom === y)
			{
				wrapper.hidden = false;
			}

			wrapper.className = "board";
			container.appendChild(wrapper);
			roomArray[y][x] = wrapper;

			for (let i = 0; i < MAX_TILES; i++) 
			{
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
						// hard code LOL, haha super awesome good to work with
						door.className = "door";
						door.id = i + " " + x + " " + y;
						wrapper.appendChild(door);
					} else {
						wall.className = "wall";
						wall.id = i + " " + x + " " + y;
						wrapper.appendChild(wall);
					}
				} else {
					floor.className = "floor";
					floor.id = i + " " + x + " " + y;
				
					floorArray.push(i + " " + x + " " + y);
					wrapper.appendChild(floor);
				}
			}

			initializeProgressBar(wrapper);
		}
		
	}

	let playerPosition = rows * posX + posY + " " + user.xRoom + " " + user.yRoom;
	let player = document.getElementById(playerPosition);
	player.className = "player";

	floorArray = floorArray.filter((item) => item !== playerPosition);
	connection.invoke("LocateResources", floorArray).catch(function (err) {
		return console.error(err.toString());
	}); 
}

connection.on("locateResources", (serverRes) => {
	placeItemRandomlyOnBoard(serverRes);
});

function placeItemRandomlyOnBoard(serverRes) {

	for (let resource of serverRes) 
	{
		let item = document.getElementById(resource["itemPosition"]);
		console.log(item);
		item.className = items[resource["itemIndex"]];
		item.style.backgroundColor = "gold";
		//this made it not work?
		//itemPositions.push(resource["itemPosition"]); // Keep track of item positions
	}
}

function initializeProgressBar() {
	// Create the progress bar div and hides it by default
	progressBarContainer.id = "progress-bar-container";
	progressBarContainer.style.display = "none";
	progressBar.id = "progress-bar";
	progressBarContainer.appendChild(progressBar);
	container.appendChild(progressBarContainer);
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
		user = players[player];
		initializeBoard(prevX, prevY);

		for (let key in players) {
			let value = players[key];

			if (value.Email != player) {
				document.getElementById(
					rows * value.xPos + value.yPos + " " + value.xRoom + " " + value.yRoom
				).className = "otherPlayers";
			}
		}

		document.addEventListener("keydown", function (event) {
			let key = event.key;
			let messageElement = document.getElementById("message");
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
				case !isNaN(key):
					if (key >= 1 && key <= 8) {
						useItem(key);
					}
				default:
					// print to screen that the key is invalid
					if (!validKeys.includes(key)) {
						messageElement.innerText = "Invalid key pressed";
						messageElement.style.display = "block"; // Show the message
						setTimeout(function() {
							messageElement.style.opacity = "0";
							// Hide the message after the fade out animation is complete
							setTimeout(function() {
								messageElement.style.display = "none";
								messageElement.style.opacity = "1";
							}, 1000); // Assuming the fade out animation takes 1 second
						}, 100);	
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


			let xRoomPrev = user.xRoom;
			let yRoomPrev = user.yRoom;
			
			let destBlock = document.getElementById(rows * destX + destY + " " + user.xRoom + " " + user.yRoom);
			if (destBlock.className === "door") {
				if (!isProgressBarActive) {
					showProgressBar();

					if(destX === 5 && destY === 0)
					{
						players[player].yRoom = (players[player].yRoom + 1) % 3;
						destY = 9;
					}
					else if(destX === 0 && destY === 5)
					{
						let x = players[player].xRoom - 1;
						if(x < 0)
						{
							x = 2;
						}
						players[player].xRoom = x;
						destX = 9;
					}
					else if(destX === 10 && destY === 5)
					{
						players[player].xRoom = (players[player].xRoom + 1) % 3;
						destX = 1;
					}
					else if(destX === 5 && destY === 10)
					{
						let y = players[player].yRoom - 1;
						if(y < 0)
						{
							y = 2;
						}
						players[player].yRoom = y;
						destY = 1;
					}

					destBlock = document.getElementById(rows * destX + destY + " " + user.xRoom + " " + user.yRoom);
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
			prevX = destX;
			prevY = destY;
			connection
				.invoke(
					"playerMove",
					player,
					destX.toString(),
					destY.toString(),
					players[player].xRoom.toString(),
					players[player].yRoom.toString(),
					xRoomPrev.toString(),
					yRoomPrev.toString()
				)
				.catch(function (err) {
					return console.error(err.toString());
				});
						// hide all rooms except the current room
			for (let y = 0; y < roomHeight; y++) {
				for (let x = 0; x < roomHeight; x++) {
					roomArray[y][x].hidden = true;
				}
			}
			roomArray[user.yRoom][user.xRoom].hidden = false;
		});
	});
});

function collectResource() {
	Promise.resolve(showProgressBar())
		.then(function () {
			// remove background color
			resourceBlock.style.backgroundColor = "";
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

const switchCellClass = (prevX, prevY, destX, destY, xRoom, yRoom, xRoomPrev, yRoomPrev) => {
	let prevCell = document.getElementById(rows * prevX + prevY + " " + xRoomPrev + " " + yRoomPrev);
	let destCell = document.getElementById(rows * destX + destY + " " + xRoom + " " + yRoom);

	let tempCell = prevCell.className;
	prevCell.className = destCell.className;
	destCell.className = tempCell;
	let baseCharacterURL = "/images/characters/1/"; // temp

	// switch background image depending on the direction of movement (Refactor so that other players have a different sprite)
	if (prevX > destX) {
		baseCharacterURL += "character-up.png";
		destCell.style.backgroundImage = "url('" + baseCharacterURL + "')";
	} else if (prevX < destX) {
		baseCharacterURL += "character-down.png";
		destCell.style.backgroundImage = "url('" + baseCharacterURL + "')";
	} else if (prevY > destY) {
		baseCharacterURL += "character-left.png";
		destCell.style.backgroundImage = "url('" + baseCharacterURL + "')";
	} else if (prevY < destY) {
		baseCharacterURL += "character-right.png";
		destCell.style.backgroundImage = "url('" + baseCharacterURL + "')";
	}
	destCell.style.backgroundSize = "cover";
	destCell.style.backgroundRepeat = "no-repeat";
	// element style should be removed for the previous cell
	// check if there was any movement before making the previous cell blank
	if (prevX !== destX || prevY !== destY) {
		prevCell.style.backgroundImage = "";
	}

};

function isValidMovement(destX, destY) {
	// Prevent movement if colliding outside the grid
	let permittedCells = ["floor", "door"];
	let cell = document.getElementById(rows * destX + destY + " " + user.xRoom + " " + user.yRoom);
	if (!permittedCells.includes(cell.className)) {
		return false;
	}
	return true;
}

connection.on("playerMove", (playerName, x, y, xRoom, yRoom, xRoomPrev, yRoomPrev) => {
	let intX = parseInt(x);
	let intY = parseInt(y);
	switchCellClass(
		players[playerName].xPos,
		players[playerName].yPos,
		intX,
		intY,
		xRoom,
		yRoom,
		xRoomPrev,
		yRoomPrev
	);
	players[playerName].xRoom = parseInt(xRoom);
	players[playerName].yRoom = parseInt(yRoom);
	players[playerName].xPos = intX;
	players[playerName].yPos = intY;
	//console.log(playerName + " x:" + players[playerName].xPos + " y:" + players[playerName].yPos + " xRoom:" + players[playerName].xRoom + " yRoom:" + players[playerName].yRoom);
});

connection.on("update", () => {});

connection.on("LeaveGame", (playerKey) => 
{
	delete players[playerKey];
});