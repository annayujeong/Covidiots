using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Covidiots.Hubs;
public class ResourceHub : Hub
{
    public Task CollectResource(string resourceName, string[] resourceList)
    {
        return Clients.All.SendAsync("collectResource", resourceName, resourceList);
    }
}
