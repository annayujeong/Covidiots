using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Covidiots.Pages;

public class ResultModel : PageModel
{
    private readonly ILogger<PrivacyModel> _logger;

    public ResultModel(ILogger<PrivacyModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {
    }
}

