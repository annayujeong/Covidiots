"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message)
{
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} says ${message}`;
});

// connection.on("UserConnected", (connectionId) => 
// {
//     document.getElementById("userInput").innerHTML += "j";
// });

// connection.on("UserDisconnected", (connectionId) => 
// {
//     document.getElementById("userInput").innerHTML += "j";
// });

connection.on("JoinLobby", (name) =>
{
    let ul = document.getElementById("playersList");
    ul.innerHTML += `<li>${name}</li>`;
})

connection.on("LeaveLobby", (name) =>
{   
    let ul = document.getElementById("playersList");
    let li = ul.getElementsByTagName("li");
    for(let i = 0; i < li.length; i++)
    {
        if(li[i].innerHTML == name)
        {
            ul.removeChild(li[i]);
        }
    }
})

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").innerHTML;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});


function joinButton(event)
{
    connection.invoke("JoinLobby", document.getElementById("userInput").innerHTML);
    let button = document.getElementById("joinButton");
    button.onclick = leaveButton;
    button.innerHTML = "Leave Lobby";
}

function leaveButton()
{
    connection.invoke("LeaveLobby", document.getElementById("userInput").innerHTML);
    let button = document.getElementById("joinButton");
    button.onclick = joinButton;
    button.innerHTML = "Join Lobby";
}