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
        public int maxItems = 50;
        public int numberOfItems = 3;
        public static List<Dictionary<string, string>> Resources = new();
        public static bool didResourceInvoke = false;
        public static int infected = 1;
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            if (Context.User?.Identity?.Name != null)
            {
                clients.Players.Remove(Context.User.Identity.Name);
                Clients.All.SendAsync("LeaveGame", Context.User.Identity.Name);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public Task playerMove(string email, string x, string y, string xRoom, string yRoom, string xRoomPrev, string yRoomPrev)
        {
            Clients.Caller.SendAsync("update");
            return Clients.All.SendAsync("playerMove", email, x, y, xRoom, yRoom, xRoomPrev, yRoomPrev);
        }

        public Task LocateResources(string[] floorArray)
        {
            if (!didResourceInvoke)
            {
                Random random = new Random();

                for (int i = 0; i < maxItems; i++)
                {
                    Resources.Add(new Dictionary<string, string>{
                        { "itemPosition", floorArray[random.Next(floorArray.Length)] },
                        { "itemIndex", random.Next(numberOfItems).ToString() }
                    });
                }
                didResourceInvoke = true;
            }
            return Clients.All.SendAsync("locateResources", Resources);
        }

        public Task UpdateResources(string id)
        {
            //int intValue = int.Parse(id);
            Resources.RemoveAll(dictionary => dictionary.TryGetValue("itemPosition", out var value) && value == id);
            if (Resources.Count == 0) {
                return Clients.All.SendAsync("allResourcesCollected");
            }
            return Clients.All.SendAsync("updateResource", id);
        }

        public Task InfectPlayers(string xPos, string yPos, string xRoom, string yRoom)
        {
            int posX = int.Parse(xPos);
            int posY = int.Parse(yPos);
            int roomX = int.Parse(xRoom);
            int roomY = int.Parse(yRoom);
            List<string> affectedFloors = new();

            for (int i = posX - 1; i <= posX + 1; i++)
            {
                for (int j = posY - 1; j <= posY + 1; j++)
                {
                    // Skip the center point itself
                    if (i == posX && j == posY)
                        continue;

                    int blockIndex = i * 11 + j;
                    affectedFloors.Add(blockIndex.ToString() + " " + roomX + " " + roomY);
                }
            }
            return Clients.All.SendAsync("getCoughed", affectedFloors);
        }

        public Player? GetPlayerByEmail(string email)
        {
            KeyValuePair<string, Player> playerEntry = clients.Players.FirstOrDefault(pair => pair.Value.Email == email);
            return playerEntry.Value;
        }

        public Task IncreaseInfected()
        {
            infected++;
            return Clients.All.SendAsync("increaseInfected", infected);
        }
    
        public Task GameOver(string winningTeam)
        {
            Resources.Clear();
            didResourceInvoke = false;
            infected = 1;
            return Clients.All.SendAsync("gameOver", winningTeam);
        }

    }
}
