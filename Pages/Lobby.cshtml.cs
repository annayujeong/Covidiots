using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore.Metadata.Internal;


namespace Covidiots.Pages
{   
    [Authorize]
    public class LobbyModel : PageModel
    {
   
        public void OnGet()
        {

            
        }


        
    }
}
