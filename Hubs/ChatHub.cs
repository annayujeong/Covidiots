using System.Security.Claims;
using System.Text.RegularExpressions;
using Covidiots.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace Covidiots.Hubs;

public class ChatHub : Hub
{
    Lobby lobby;
    Clients clients;
    UserManager<CustomUser> userManager;
    string? ScreenName { get; set; }

    private readonly IHttpContextAccessor httpContextAccessor;

    public ChatHub(Lobby lobby, UserManager<CustomUser> userManager, IHttpContextAccessor httpContextAccessor, Clients clients)
    {
        this.lobby = lobby;
        this.userManager = userManager;
        this.httpContextAccessor = httpContextAccessor;
        this.clients = clients;
    }

    public Task SendMessage(string user, string message)
    {
        return Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    public Task JoinLobby(string user, string email)
    {
        lobby.Players.Add(email, new Player() { Name = user, Ready = false, Email = email, ConnectionId = Context.ConnectionId });
        return Clients.All.SendAsync("JoinLobby", user, email);
    }

    public Task LeaveLobby(string user, string email)
    {
        lobby.Players.Remove(email);
        return Clients.All.SendAsync("LeaveLobby", user, email);
    }

    public Task Ready(string user, string email)
    {
        lobby.Players[email].Ready = true;

        string allReady = "false";

        for (int i = 0; i < lobby.Players.Count; i++)
        {
            if (lobby.Players.ElementAt(i).Value.Ready == true)
            {
                allReady = "true";
            }
            else
            {
                allReady = "false";
                break;
            }
        }

        if (lobby.Players.Count == 1)
        {
            allReady = "false";
        }

        return Clients.All.SendAsync("Ready", user, email, allReady);
    }

    public Task Unready(string user, string email)
    {
        lobby.Players[email].Ready = false;
        return Clients.All.SendAsync("Unready", user, email);
    }

    public override Task OnConnectedAsync()
    {
        if (Context.User != null)
        {
            var user = userManager.GetUserAsync(Context.User).Result;
            if (user != null)
            {
                ScreenName = user.ScreenName;
            }
        }
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        if (Context.User?.Identity?.Name != null)
        {
            lobby.Players.Remove(Context.User.Identity.Name);
        }

        if (ScreenName != null && Context.User?.Identity?.Name != null)
        {
            Clients.All.SendAsync("LeaveLobby", ScreenName, Context.User.Identity.Name);
        }

        return base.OnDisconnectedAsync(exception);
    }

    public Task startGame()
    {
        //assign all players in lobby a random x and y position from 0 - 9
        Random rnd = new Random();
        for (int i = 0; i < lobby.Players.Count; i++)
        {

            lobby.Players.ElementAt(i).Value.xPos = rnd.Next(1, 9);
            lobby.Players.ElementAt(i).Value.yPos = rnd.Next(1, 9);
        }

        //create a list of clientids to send to the client
        List<string> clientIds = new List<string>();
        for (int i = 0; i < lobby.Players.Count; i++)
        {
            var playerValue = lobby.Players.ElementAt(i).Value;
            var playerKey = lobby.Players.ElementAt(i).Key;

            if (playerValue != null)
            {
                playerValue.yRoom = rnd.Next(1, 3);
                playerValue.xRoom = rnd.Next(1, 3);
                if (playerValue.ConnectionId != null)
                {
                    clientIds.Add(playerValue.ConnectionId);
                }
            }

            if (playerKey != null && playerValue != null)
            {
                clients.Players.Add(playerKey, playerValue);
            }
        }



        return Clients.Clients(clientIds).SendAsync("startGame");
        //return Clients.All.SendAsync("startGame");
    }
}

