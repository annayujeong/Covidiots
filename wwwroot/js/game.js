import { updateResource, useItem, updateStats, updateMap } from "./hud.js";

var connection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build(); // Create a connection to the gameHub
let players;

const MAX_TILES = 121;
const rows = 11;
const cols = 11;
const doorOpeningSpeed = 1; // in milliseconds per 1% of the progress bar width
const startingX = 5;
const startingY = 5;
const items = ["fries", "toilet-paper", "water"];
const validKeys = ["w", "a", "s", "d", "1", "2", "3", "4", "5", "6", "7", "8", "m", "e", "q", " ", "z"]; // Update this so that error message is shown properly when invalid key is pressed
let progressBarContainer = document.createElement("div");
let progressBar = document.createElement("div");
let isProgressBarActive = false;
let floorArray = [];
let roomArray = [[], [], []];
let user;
let roomHeight = 3;
let isResource = false;
let resourceBlock = null;

const invalidKeyMessage = "Invalid key pressed";
const usedItemMessage = "You used item ";
const failUseItemMessage = "You cannot use item ";
const messageElement = document.getElementById("message");
const blockedMessage = "Your movement is being blocked";

// Initializes the board with tiles that have classes of floor, wall, door, or player. It is organized
// in a 1D array. The board is 11x11, so the 1D array is 121 elements long.
// Players move around the board by changing the class of the tile. The class of the tile determines
// what the tile looks like and what the player can do with it.
// Movement is done by adding x and y coordinates to the player's current position.
function initializeBoard(posX, posY)
{
	for (let y = 0; y < roomHeight; y++) 
	{
		for (let x = 0; x < roomHeight; x++)
		{
			let wrapper = document.createElement("div");
			wrapper.hidden = true;

			if (user.xRoom === x && user.yRoom === y)
			{
				wrapper.hidden = false;
			}

			wrapper.className = "board";
			container.appendChild(wrapper);
			roomArray[y][x] = wrapper;

			for (let i = 0; i < MAX_TILES; i++) 
			{
				// populate the board with tiles that can be either floor or wall or door
				let tile = document.createElement("div");
				// add walls to the outer edges of the board
				if (
					i < rows ||
					i > MAX_TILES - rows ||
					i % rows === 0 ||
					i % rows === rows - 1
				)
				{
				// add doors to the middle of the outer edges of the board
				if (i === 5 || i === 55 || i === 65 || i === MAX_TILES - 6) 
				{
					if((x === 0 && i === 5) || (x === roomHeight - 1 && i === MAX_TILES - 6) || (y === 0 && i === 65) || (y === roomHeight - 1 && i === 55))
					{
						tile.className = "wall";
					}
					else
					{
						tile.className = "door";
					}
					
				} else
				{
					tile.className = "wall";
				}
				} else
				{
					tile.className = "floor";
					floorArray.push(i + " " + x + " " + y);
				}
			
				tile.id = i + " " + x + " " + y;
				wrapper.appendChild(tile);
			}

			initializeProgressBar(wrapper);
		}

	}

	let playerPosition = rows * posX + posY + " " + user.xRoom + " " + user.yRoom;
	let player = document.getElementById(playerPosition);
	player.className = "player";
	floorArray = floorArray.filter((item) => item !== playerPosition);
	connection.invoke("LocateResources", floorArray).catch(function (err)
	{
		return console.error(err.toString());
	});
}

connection.on("locateResources", (serverRes) =>
{
	placeItemRandomlyOnBoard(serverRes);
});

function placeItemRandomlyOnBoard(serverRes)
{
	for (let resource of serverRes) 
	{
		let item = document.getElementById(resource["itemPosition"]);
		item.className = items[resource["itemIndex"]];
		item.style.backgroundColor = "gold";
	}
}

function initializeProgressBar()
{
	progressBarContainer.id = "progress-bar-container";
	progressBarContainer.style.display = "none";
	progressBar.id = "progress-bar";
	progressBarContainer.appendChild(progressBar);
	container.appendChild(progressBarContainer);
}

document.addEventListener("DOMContentLoaded", function ()
{
	connection.start().then(function ()
	{
		players = JSON.parse(
			document.getElementById("players").innerHTML.slice(0, -2)
		);
        let player = document.getElementById("user").innerHTML;

        displayTeamMessage(players[player].IsInfected, 15);
        updateMap(players[player].xRoom, players[player].yRoom);

		let prevX;
		let prevY;
		if (players[player] != null)
		{
			prevX = players[player].xPos;
			prevY = players[player].yPos;
		} else
		{
			prevX = startingX;
			prevY = startingY;
		}

		let destX = prevX;
		let destY = prevY;
		user = players[player];
		initializeBoard(prevX, prevY);

		for (let key in players)
		{
			let value = players[key];

			if (value.Email != player)
			{
				document.getElementById(
					rows * value.xPos + value.yPos + " " + value.xRoom + " " + value.yRoom
				).className = "otherPlayers";
			}
		}	

		document.addEventListener("keydown", function (event)
		{
			let key = event.key;
			switch (key)
			{
				case "w":
				case "ArrowUp":
					destX -= 1;
					break;
				case "s":
				case "ArrowDown":
					destX += 1;
					break;
				case "a":
				case "ArrowLeft":
					destY -= 1;
					break;
				case "d":
				case "ArrowRight":
					destY += 1;
					break;
				default:
					if (!isNaN(key) && key >= 1 && key <= 8) {

						let success = useItem(key);
						if (success === false)
						{
							messageElement.innerText = failUseItemMessage + key;
						} else {
							messageElement.innerText = usedItemMessage + key;
						}
						showMessage();
					}
					// print to screen that the key is invalid
					if (!validKeys.includes(key))
					{
						messageElement.innerText = invalidKeyMessage;
						showMessage();
					}
					break;
			}


			while (isProgressBarActive)
			{
				destX = prevX; // Prevent movement if progress bar is active
				destY = prevY;
				setTimeout(() => { }, 100); // Wait for progress bar to finish
				return; 
			}
			
			if (isResource && key === " ") // if the player is in front of a resource and presses spacebar, collect the resource
			{
				collectResource();
				return;
			}

            if (players[player].IsInfected && key === "z") {
                handleCoughing();
                return;
            }

			let xRoomPrev = user.xRoom;
			let yRoomPrev = user.yRoom;

			let destBlock = document.getElementById(rows * destX + destY + " " + user.xRoom + " " + user.yRoom);
			if (destBlock.className === "door")
			{
				if (!isProgressBarActive)
				{
					showProgressBar();

					let halfX = Math.floor(rows / 2);
					let halfY = Math.floor(cols / 2);
					let fullX = rows - 1;
					let fullY = cols - 1;

					if (destX === halfX && destY === 0)
					{
						user.yRoom ++;
						destY = 9;
					}
					else if (destX === 0 && destY === halfY)
					{
						user.xRoom --;
						destX = 9;
					}
					else if (destX === fullX && destY === halfY)
					{
						user.xRoom ++;
						destX = 1;
					}
					else if (destX === halfX && destY === fullY)
					{
						user.yRoom --;
						destY = 1;
					}

					destBlock = document.getElementById(rows * destX + destY + " " + user.xRoom + " " + user.yRoom);
				}
			}

			// Check if the dest block is resource
			if (items.includes(destBlock.className))
			{
				isResource = true;
				resourceBlock = destBlock;
			} 
			else
			{
				// using the last movement, check if the dest block has a resource in front of it
				let resourceX = destX;
				let resourceY = destY;
				switch (key)
					{
						case "w":
						case "ArrowUp":
							resourceX--;
							break;
						case "s":
						case "ArrowDown":
							resourceX++;
							break;
						case "a":
						case "ArrowLeft":
							resourceY--;
							break;
						case "d":
						case "ArrowRight":
							resourceY++;
							break;
					}
				let potentialResourceBlock = document.getElementById(rows * resourceX + resourceY + " " + user.xRoom + " " + user.yRoom);
				if (items.includes(potentialResourceBlock.className))
				{
					isResource = true;
					resourceBlock = potentialResourceBlock;
				} 
				else 
				{
					isResource = false;
					resourceBlock = null;
				}
			}
				
			// Keep the previous position if false
			if (isValidMovement(destX, destY) === false)
			{
				if(destX !== prevX || destY !== prevY)
				{
					messageElement.innerText = blockedMessage;
					// append to messageElement depending what is blocking the movement
					messageElement.innerText += " by " + destBlock.className;
					showMessage();
				}
				destX = prevX;
				destY = prevY;
				user.xRoom = xRoomPrev;
				user.yRoom = yRoomPrev;
			}
			prevX = destX;
			prevY = destY;
			connection // send the player's movement to the server
				.invoke( // invoke the playerMove method in the server
					"playerMove",
					player, 
					destX.toString(),
					destY.toString(),
					user.xRoom.toString(),
					user.yRoom.toString(),
					xRoomPrev.toString(),
					yRoomPrev.toString()
				)
				.catch(function (err)
				{
					return console.error(err.toString());
				});
			// hide all rooms except the current room
			for (let y = 0; y < roomHeight; y++)
			{
				for (let x = 0; x < roomHeight; x++)
				{
					roomArray[y][x].hidden = true;
				}
			}
			roomArray[user.yRoom][user.xRoom].hidden = false;
		});
	});
});

function handleCoughing() {
    let player = document.getElementById("user").innerHTML;
    let xPos = players[player].xPos.toString();
	let yPos = players[player].yPos.toString();
	let xRoom = players[player].xRoom.toString();
	let yRoom = players[player].yRoom.toString();
    connection.invoke("InfectPlayers", xPos, yPos, xRoom, yRoom).catch((err) => {
		return console.error(err.toString());
	});
}

connection.on("getCoughed", (affectedFloors) => {
    let player = document.getElementById("user").innerHTML;
    affectedFloors.forEach((id) => {
        var element = document.getElementById(id);
        let virus = document.createElement("img");
        virus.src = "/images/Virus.png";
        if (element && element.className !== "door" && element.className !== "wall") {
            element.appendChild(virus);
            setTimeout(() => {
                element.removeChild(virus);
            }, 2000);
        }
    });

    let currentXPos = players[player].xPos;
    let currentYPos = players[player].yPos;
    let currentXRoom = players[player].xRoom;
    let currentYRoom = players[player].yRoom;
    let currentPos = currentXPos * 11 + currentYPos;
    let currentPosId = currentPos + " " + currentXRoom + " " + currentYRoom;
    if (affectedFloors.includes(currentPosId)) {
        let isHealthEmpty = updateStats(-10, "health");
        let isThirstEmpty = updateStats(-10, "thirst");
        let isHungerEmpty = updateStats(-10, "hunger");

        if (!players[player].IsInfected && (isHealthEmpty || isThirstEmpty || isHungerEmpty)) {
            players[player].IsInfected = true;
            displayTeamMessage(true, 3);
            connection.invoke("IncreaseInfected").catch((err) => {
                return console.error(err.toString());
            });

        }
    }
});

connection.on("increaseInfected", (numberOfInfected) => {
    let numberOfPlayers = Object.keys(players).length;
    if (numberOfInfected > (numberOfPlayers / 2)) {
        notifiyGameOver("INFECTED");
    }
});

connection.on("allResourcesCollected", () => {
    notifiyGameOver("NON-INFECTED");
});

function notifiyGameOver(team) {
    connection.invoke("Gameover", team).catch((err) => {
		return console.error(err.toString());
	});
}

connection.on("gameOver", (winningTeam) => {
	redirectToResult(winningTeam);
});

function redirectToResult(team) {
    window.location.replace("/Result?team=" + team);
}

function collectResource() {
	Promise.resolve(showProgressBar())
		.then(function ()
		{
			resourceBlock.style.backgroundColor = ""; // reset the resource block's background color
			updateResource(resourceBlock.className); // update the resource in the HUD
			connection // send the resource block's id to the server
				.invoke("UpdateResources", resourceBlock.id) // invoke the UpdateResources method in the server
				.catch(function (err) 
				{
					return console.error(err.toString());
				});
			isResource = false;
		})
		.catch(function (error)
		{
			console.error(error);
		});
}

connection.on("updateResource", (id) =>
{
	let resBlock = document.getElementById(id);
	resBlock.className = "floor";
});

function showProgressBar()
{
	progressBar.style.width = "0%"; // Reset the progress bar
	progressBarContainer.style.display = "block"; // Show the progress bar container
	isProgressBarActive = true;
	let width = 0;
	let intervalId = setInterval(() =>
	{
		if (width >= 100)
		{
			// Stop the interval when the progress bar reaches 100%
			clearInterval(intervalId); // Stop the interval
			progressBar.style.width = "0%"; // Reset the progress bar
			progressBarContainer.style.display = "none"; // Hide the progress bar container
			isProgressBarActive = false;
		} else
		{
			width++;
			progressBar.style.width = width + "%"; // Increase the progress bar width by 1%
		}
	}, doorOpeningSpeed);
}

const switchCellClass = (prevX, prevY, destX, destY, xRoom, yRoom, xRoomPrev, yRoomPrev) =>
{
	let prevCell = document.getElementById(rows * prevX + prevY + " " + xRoomPrev + " " + yRoomPrev); // Gets the previous cellID
	let destCell = document.getElementById(rows * destX + destY + " " + xRoom + " " + yRoom); // Gets the destination cellID

	let tempCell = prevCell.className;
	prevCell.className = destCell.className;
	destCell.className = tempCell;
	changePlayerFacingDirection(prevX, prevY, destX, destY, prevCell, destCell);
};

function isValidMovement(destX, destY)
{
	// Prevent movement if colliding outside the grid
	let permittedCells = ["floor", "door"];
	let cell = document.getElementById(rows * destX + destY + " " + user.xRoom + " " + user.yRoom);
	if (!permittedCells.includes(cell.className))
	{
		return false;
	}
	return true;
}

connection.on("playerMove", (playerName, x, y, xRoom, yRoom, xRoomPrev, yRoomPrev) =>
{
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
    updateMap(xRoom, yRoom);
});

connection.on("update", () => { });

connection.on("LeaveGame", (playerKey) => 
{
	delete players[playerKey];
});

function showMessage()
{
	messageElement.style.display = "block"; 
	setTimeout(function ()
	{
		messageElement.style.opacity = "0";
		setTimeout(function ()
		{
			messageElement.style.display = "none";
			messageElement.style.opacity = "1";
		}, 100);
	}, 500);
}

function changePlayerFacingDirection(prevX, prevY, destX, destY, prevCell, destCell) 
{
	let baseCharacterURL = "/images/characters/1/";
	// switch background image depending on the direction of movement 
	if (prevX > destX)
	{
		baseCharacterURL += "character-up.png";
		destCell.style.backgroundImage = "url('" + baseCharacterURL + "')";
	} else if (prevX < destX)
	{
		baseCharacterURL += "character-down.png";
		destCell.style.backgroundImage = "url('" + baseCharacterURL + "')";
	} else if (prevY > destY)
	{
		baseCharacterURL += "character-left.png";
		destCell.style.backgroundImage = "url('" + baseCharacterURL + "')";
	} else if (prevY < destY)
	{
		baseCharacterURL += "character-right.png";
		destCell.style.backgroundImage = "url('" + baseCharacterURL + "')";
	}
	// Remove background image if true
	if (prevX !== destX || prevY !== destY) // checks movement
	{
		prevCell.style.backgroundImage = "";
	}
}

function displayTeamMessage(IsInfected, second) {
    let msgTeamElement = document.getElementById("msg-team");
    let msgContainer = document.getElementById("msg-container");
    msgContainer.style.display = "flex";
    let msgDescriptionElement = document.getElementById("msg-description");
    if (IsInfected) {
        msgTeamElement.innerHTML = "You are <span class='text-stress'>infected</span> to COVID-19.";
        msgDescriptionElement.innerHTML = "Try <span class='text-stress'>spreading virus</span> to as many players as possible to win!";
    } else {
        msgTeamElement.innerHTML = "You are <span class='text-stress'>COVID-19 safe</span> for now.";
        msgDescriptionElement.innerHTML = "<span class='text-stress'>Avoid contact</span> with players and <span class='text-stress'>gather all resources</span> to win!";
    }
    startCountdown(second);
}

function startCountdown(seconds) {
    var countdownElement = document.getElementById('countdown');
    function updateCountdown() {
        seconds--;
        countdownElement.textContent = seconds;
        if (seconds <= 0) {
            document.getElementById('msg-container').style.display = 'none';
        } else {
            setTimeout(updateCountdown, 1000);
        }
    }
    updateCountdown();
}
