using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Covidiots.Data
{
    public class Player
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string ConnectionId { get; set; }
        public bool Ready{ get; set; }
        public int xPos { get; set; }
        public int yPos { get; set; }
    }

    public class Lobby
    {
        public Dictionary<string, Player> Players = new();
    }
}