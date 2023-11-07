using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Covidiots.Hubs
{
    public class GameHub : Hub 
    {
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        public Task playerMove(string email, string x, string y)
        {
            return Clients.All.SendAsync("playerMove", email, x, y);
        }
    }
}