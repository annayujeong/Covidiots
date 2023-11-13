
var connection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();

connection.start().then(function ()
{

}).catch(function (err)
{
    return console.error(err.toString());
});

connection.on("playerMove", (email, prevX, prevY, destX, destY) =>
{
    console.log("playerMove");
})
