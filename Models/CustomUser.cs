using Microsoft.AspNetCore.Identity;

public class CustomUser : IdentityUser
{
    public string? ScreenName { get; set; }
}   