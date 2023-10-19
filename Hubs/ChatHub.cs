using System.Text.RegularExpressions;
using Covidiots.Data;
using Microsoft.AspNetCore.SignalR;

namespace Covidiots.Hubs;

public class ChatHub : Hub
{
    Lobby lobby;

    public ChatHub(Lobby lobby)
    {
        this.lobby = lobby;
    }
    public Task SendMessage(string user, string message)
    {
        return Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    public Task JoinLobby(string user)
    {
        lobby.Players.Add(new Player() { Name = user, Ready = false });
        return Clients.All.SendAsync("JoinLobby", user);
    }

    public Task LeaveLobby(string user)
    {
        lobby.Players.Remove(lobby.Players.FirstOrDefault(x => x.Name == user));
        return Clients.All.SendAsync("LeaveLobby", user);
    }

    // public override Task OnConnectedAsync()
    // {
        
    //     //Clients.All.SendAsync("UserConnected", Context.User.Identity.Name);
    //     return base.OnConnectedAsync();
    // }

    // public override Task OnDisconnectedAsync(Exception? exception)
    // {
    //     lobby.Players.Remove(lobby.Players.FirstOrDefault(x => x.Name == Context.User.Identity.Name));
    //     //Clients.All.SendAsync("UserDisconnected", Context.User.Identity.Name);
    //     return base.OnDisconnectedAsync(exception);
    // }
}

