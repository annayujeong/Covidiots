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
			let newHud = document.getElementById(currentHudId);
			newHud.style.display = "flex";
		}
	} else {
		// display hud
        currentHudId = inputKey;
		let newHud = document.getElementById(currentHudId);
		hudContainer.style.display = "flex";
		newHud.style.display = "flex";
		isHudDisplayed = true;
	}
});

// Handle Stats
let tempStat = document.getElementById("health-progress");
tempStat.addEventListener("click", () => {
	const currentWidth = tempStat.offsetWidth;
	// Calculate the new width
	const newWidth = currentWidth * 1.1; // increase by 10%

	// Set the new width
	tempStat.style.width = newWidth + "px";
});

// Handle Inventory
let tempItems = ["Fries", "Glass", "Water", "ToiletPaper"];

function hudHandler(hudId) {
    console.log(hudId);
}

Object.defineProperty(window, 'currentHudId', {
    get: function() {
        return value;
    },
    set: function(newValue) {
        value = newValue;
        subscriptionHandler(newValue);
    }
});
