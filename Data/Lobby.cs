using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Covidiots.Data
{
    public class Player
    {
        public string Name { get; set; }
        public bool Ready{ get; set; }
    }

    public class Lobby
    {
        public List<Player> Players = new();
    }
}