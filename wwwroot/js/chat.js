﻿"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message)
{
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.textContent = `${user}: ${message}`;
});

connection.on("JoinLobby", (name, email) =>
{
    let ul = document.getElementById("playersList");
    ul.innerHTML += `<li id="${email}">${name}</li>`;

    document.getElementById("startButton").disabled = true;
})

connection.on("LeaveLobby", (user, email) =>
{   
    document.getElementById(email).remove();

    let li = document.getElementById("playersList");

    if(li.children.length <= 1)
    {
        document.getElementById("startButton").disabled = true;
    }
    else
    {
        document.getElementById("startButton").disabled = false;
    }


})

connection.on("Ready", (user, email, allReady) =>
{
    let li = document.getElementById(email);
    li.innerHTML += " - Ready";

    if(allReady == "true")
    {
        document.getElementById("startButton").disabled = false;
    }
})

connection.on("Unready", (user, email) =>
{
    let li = document.getElementById(email);
    li.innerHTML = user;

    document.getElementById("startButton").disabled = true;
})

connection.on("RedirectToHome", () =>
{
    window.location.href = "https://localhost:5001";
})

connection.start().then(function () {
    leaveButton();
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

connection.on("startGame", () =>
{
    window.location.replace("/Game");

})
// when pressing enter in the message input box, click the send button
document.getElementById("messageInput").addEventListener("keyup", function (event) 
{
    if (event.keyCode === 13) // keycode 13 is the enter key
    {
        event.preventDefault();
        document.getElementById("sendButton").click();
    }
});
document.getElementById("sendButton").addEventListener("click", function (event) 
{
    var user = document.getElementById("userInput").innerHTML;
    var message = document.getElementById("messageInput").value;
    // clear message input box
    document.getElementById("messageInput").value = "";
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    
    event.preventDefault();
});


function joinButton(event)
{
    connection.invoke("JoinLobby", document.getElementById("userInput").innerHTML, document.getElementById("userEmail").innerHTML);
    let button = document.getElementById("joinButton");
    button.onclick = leaveButton;
    button.innerHTML = "Leave Lobby";
    document.getElementById("readyButton").disabled = false;
}

function leaveButton()
{
    connection.invoke("LeaveLobby", document.getElementById("userInput").innerHTML, document.getElementById("userEmail").innerHTML);
    let button = document.getElementById("joinButton");
    button.onclick = joinButton;
    button.innerHTML = "Join Lobby";

    let readybutton = document.getElementById("readyButton");
    readybutton.onclick = readyButton;
    readybutton.innerHTML = "Ready";
    readybutton.disabled = true;
}

function readyButton()
{
    connection.invoke("Ready", document.getElementById("userInput").innerHTML, document.getElementById("userEmail").innerHTML);
    let button = document.getElementById("readyButton");
    button.onclick = unreadyButton;
    button.innerHTML = "Unready";
}

function unreadyButton()
{
    connection.invoke("Unready", document.getElementById("userInput").innerHTML, document.getElementById("userEmail").innerHTML);
    let button = document.getElementById("readyButton");
    button.onclick = readyButton;
    button.innerHTML = "Ready";
}

function checkButtonStates()
{
    if(document.getElementById(connection.connectionId) != null)
    {
        let button = document.getElementById("joinButton");
        button.onclick = leaveButton;
        button.innerHTML = "Leave Lobby";
        document.getElementById("readyButton").disabled = false;
    }
}

function startGame()
{
    connection.invoke("startGame");
}