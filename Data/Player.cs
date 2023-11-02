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
        public bool Ready{ get; set; }

        public int X { get; set; }
        public int Y { get; set; }
    }
}