using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Covidiots.Data;
using Microsoft.AspNetCore.SignalR;

namespace Covidiots.Hubs
{
    public class GameHub : Hub
    {
        Clients clients;

        public GameHub(Clients clients)
        {
            this.clients = clients;
        }
        public int maxItems = 5;
        public int numberOfItems = 3;
        public static List<Dictionary<string, int>> Resources = new();
        public static bool didResourceInvoke = false;

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            clients.Players.Remove(Context.User.Identity.Name);
            Clients.All.SendAsync("LeaveGame", Context.User.Identity.Name);
            return base.OnDisconnectedAsync(exception);
        }

        public Task playerMove(string email, string x, string y, string xRoom, string yRoom, string xRoomPrev, string yRoomPrev)
        {
            Clients.Caller.SendAsync("update");
            return Clients.All.SendAsync("playerMove", email, x, y, xRoom, yRoom, xRoomPrev, yRoomPrev);
        }

        public Task LocateResources(int[] floorArray)
        {
            if (!didResourceInvoke)
            {
                Random random = new Random();

                for (int i = 0; i < maxItems; i++)
                {
                    Resources.Add(new Dictionary<string, int>{
                        { "itemPosition", floorArray[random.Next(floorArray.Length)] },
                        { "itemIndex", random.Next(numberOfItems) }
                    });
                }
                didResourceInvoke = true;
            }
            return Clients.All.SendAsync("locateResources", Resources);
        }

        public Task UpdateResources(string id)
        {
            int intValue = int.Parse(id);
            Resources.RemoveAll(dictionary => dictionary.TryGetValue("itemPosition", out var value) && value == intValue);
            return Clients.All.SendAsync("updateResource", id);
        }
    }
}