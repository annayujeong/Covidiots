"use strict";

let currentHudId = null;
let isHudDisplayed = false;

document.addEventListener("keydown", function (event) {
	let inputKey = null;

	switch (event.key) {
		case "s":
			inputKey = "hud-stats";
			break;
		case "i":
			inputKey = "hud-inventory";
			break;
		case "m":
			inputKey = "hud-map";
			break;
		default:
			return;
	}

	let hudContainer = document.getElementById("hud");
	if (isHudDisplayed) {
		// Handle when any hud is already displayed
		let currentHud = document.getElementById(currentHudId);
		if (inputKey === currentHudId) {
			// close current hud if the same key was pressed
			currentHud.style.display = "none";
			hudContainer.style.display = "none";
			isHudDisplayed = false;
			currentHudId = null;
		} else {
			// switch hud if different key was pressed
			currentHud.style.display = "none";
			currentHudId = inputKey;
			setCurrentHudUI(currentHudId);
			let newHud = document.getElementById(currentHudId);
			newHud.style.display = "flex";
		}
	} else {
		// display hud
		currentHudId = inputKey;
		setCurrentHudUI(currentHudId);
		let newHud = document.getElementById(currentHudId);
		hudContainer.style.display = "flex";
		newHud.style.display = "flex";
		isHudDisplayed = true;
	}
});

function setCurrentHudUI(hudId) {
	switch (hudId) {
		case "hud-stats":
			setStatsHudUI();
		case "hud-inventory":
			setInventoryHud();
	}
}

function setStatsHudUI() {
	let tempHealth = 60; // TODO: Get this data from the DB
	let tempHunger = 10;
	let tempThirst = 100;
	let healthProgress = document.getElementById("health-progress");
	let hungerProgress = document.getElementById("hunger-progress");
	let thirstProgress = document.getElementById("thirst-progress");

	healthProgress.style.width = tempHealth + "%";
	hungerProgress.style.width = tempHunger + "%";
	thirstProgress.style.width = tempThirst + "%";

	healthProgress.innerText = tempHealth + "%";
	hungerProgress.innerText = tempHunger + "%";
	thirstProgress.innerText = tempThirst + "%";
}

function setInventoryHud() {
	let tempItems = { // TODO: Get this data from the DB
		Fries: 2,
		Water: 5,
		ToiletPaper: 2,
		Glass: 1,
	};
	let itemContainers = document.getElementsByClassName("item-container");
	let itemKeys = Object.keys(tempItems);

	for (let i = 0; i < itemKeys.length; i++) {
        var itemImage = itemContainers[i].querySelector("img");
		itemImage.src = "/images/" + itemKeys[i] + ".png";
		itemImage.alt = itemKeys[i];

        let itemQuantity = itemContainers[i].querySelector("span");
        itemQuantity.innerText = tempItems[itemKeys[i]];
        itemQuantity.style.display = "inline";
	}
}

// TODO: event - when get the resource, action - update DB & progress bar
// tempStat.addEventListener("click", () => {
// 	const currentWidth = tempStat.offsetWidth;
// 	// Calculate the new width
// 	const newWidth = currentWidth * 1.1; // increase by 10%

// 	// Set the new width
// 	tempStat.style.width = newWidth + "px";
// });
