using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Covidiots.Pages;

public class ResultModel : PageModel
{
    private readonly ILogger<ResultModel> _logger;

    public ResultModel(ILogger<ResultModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {
    }
}

