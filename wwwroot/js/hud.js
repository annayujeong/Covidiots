"use strict";

let currentHudId = null;
let isHudDisplayed = false;
let resourceDictionary = {
	water: "Water",
	"toilet-paper": "ToiletPaper",
	fries: "Fries",
};

let resourceList = {};
let statsList = {
	// TODO: change values
	health: 50,
	thirst: 50,
	hunger: 50,
};
let currentLocation = null;

document.addEventListener("keydown", function (event) {
	let inputKey = null;
	switch (event.key) {
		case "e":
			inputKey = "hud-stats";
			break;
		case "q":
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
			setStatsHud();
		case "hud-inventory":
			setInventoryHud();
	}
}

function setStatsHud() {
	let health = statsList["health"];
	let hunger = statsList["hunger"];
	let thirst = statsList["thirst"];
	let healthProgress = document.getElementById("health-progress");
	let hungerProgress = document.getElementById("hunger-progress");
	let thirstProgress = document.getElementById("thirst-progress");

	healthProgress.style.width = health + "%";
	hungerProgress.style.width = hunger + "%";
	thirstProgress.style.width = thirst + "%";

	healthProgress.innerText = health + "%";
	hungerProgress.innerText = hunger + "%";
	thirstProgress.innerText = thirst + "%";
}

function updateResource(resourceName) {
	let value = resourceList[resourceName];
	if (!value) {
		resourceList[resourceName] = 1;
	} else {
		resourceList[resourceName]++;
	}
	setInventoryHud();
}

function resetInventoryElements() {
	var parentDiv = document.getElementById("hud-inventory");
	var items = parentDiv.querySelectorAll(
		".item-container img, .item-container span"
	);
	items.forEach(function (item) {
		item.style.display = "none";
	});
}

function setInventoryHud() {
	let itemContainers = document.getElementsByClassName("item-container");
	resetInventoryElements();

	let itemKeys = Object.keys(resourceList);

	for (let i = 0; i < itemKeys.length; i++) {
		let itemImage = itemContainers[i].querySelector("img");
		itemImage.src = "/images/" + resourceDictionary[itemKeys[i]] + ".png";
		itemImage.alt = itemKeys[i];
		itemImage.style.display = "inline";

		let itemQuantity = itemContainers[i].querySelector("span");
		itemQuantity.innerText = resourceList[itemKeys[i]];
		itemQuantity.style.display = "inline";
	}
}

function useItem(itemIndex) {
	let item = null;
	try {
		item = Object.entries(resourceList)[itemIndex - 1][0];
	} catch {
		return false; // If the item doesn't exist, return false (which will be used to display an error message)
	}
	if (!item) {
		return;
	}
	switch (item) {
		case "toilet-paper":
			updateStats(10, "health"); // TODO: use const for numbers
			break;
		case "fries":
			updateStats(12, "hunger");
			break;
		case "water":
			updateStats(15, "thirst");
			break;
		default:
			break;
	}
	resourceList[item]--;
	if (resourceList[item] == 0) {
		delete resourceList[item];
	}
	setInventoryHud();
}

function updateStats(statsEffect, statsName) {
	let updatedValue = statsList[statsName] + statsEffect;
	if (updatedValue >= 100) {
		statsList[statsName] = 100;
	} else {
		statsList[statsName] = updatedValue;
	}
	setStatsHud();
}

export { updateResource, useItem };
