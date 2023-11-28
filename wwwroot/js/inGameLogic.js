// "use strict";

// var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
// var infectedPlayer = null;
// document.addEventListener("DOMContentLoaded", () => {
//     connection.start().then(() => {
//         console.log("Player " + infectedPlayer + " infected");
//     });

// });

// connection.on("setFirstInfected", (playerName) => {
//     infectedPlayer = playerName;
// });