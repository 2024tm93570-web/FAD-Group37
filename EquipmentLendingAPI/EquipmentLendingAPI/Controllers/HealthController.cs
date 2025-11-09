using Microsoft.AspNetCore.Mvc;

namespace EquipmentLendingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { status = "healthy", message = "Backend API is running" });
        }
    }
}

