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
    UserManager<CustomUser> userManager;
    string? ScreenName { get; set; }

    private readonly IHttpContextAccessor httpContextAccessor;

    public ChatHub(Lobby lobby, UserManager<CustomUser> userManager, IHttpContextAccessor httpContextAccessor)
    {
        this.lobby = lobby;
        this.userManager = userManager;
        this.httpContextAccessor = httpContextAccessor;
    }
    public Task SendMessage(string user, string message)
    {
        return Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    public Task JoinLobby(string user, string email)
    {
        lobby.Players.Add(email, new Player() { Name = user, Ready = false, Email = email });
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

        for(int i = 0; i < lobby.Players.Count; i++)
        {
            if(lobby.Players.ElementAt(i).Value.Ready == true)
            {
                allReady = "true";
            }
            else
            {
                allReady = "false";
                break;
            }
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
        ScreenName = userManager.GetUserAsync(Context.User).Result.ScreenName;
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        lobby.Players.Remove(Context.User.Identity.Name);
        Clients.All.SendAsync("LeaveLobby", ScreenName, Context.User.Identity.Name);
        return base.OnDisconnectedAsync(exception);
    }

    public Task startGame()
    {

        // create a list of coordinates that have been used
        List<int> availableX = new List<int>();
        List<int> availableY = new List<int>();

        int squareWidth = 10;

        for(int i = 0; i < squareWidth; i++)
        {
            availableX.Add(i);
            availableY.Add(i);
        }

        foreach(var player in lobby.Players)
        {
            // get a random element from list
            Random rnd = new Random();
            int x = rnd.Next(0, availableX.Count);
            int y = rnd.Next(0, availableY.Count);

            player.Value.X = availableX[x];
            player.Value.Y = availableY[y];

            availableX.RemoveAt(x);
            availableY.RemoveAt(y);
        }

        return Clients.All.SendAsync("startGame");
    }
}

