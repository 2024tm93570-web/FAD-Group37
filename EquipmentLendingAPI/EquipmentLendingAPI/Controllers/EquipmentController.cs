using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using EquipmentLendingAPI.Models;

namespace EquipmentLendingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentController : ControllerBase
    {
        private readonly IConfiguration _config;

        public EquipmentController(IConfiguration config)
        {
            _config = config;
        }
        private string GetUserRoleFromToken(string token)
        {
            if (string.IsNullOrEmpty(token)) return null;
            // Handle "Bearer" prefix if present
            if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                token = token.Substring(7);
            var parts = token.Split('-');
            // Format: SIMULATED-TOKEN-{userId}-{role}
            return parts.Length >= 4 ? parts[3] : null;
        }


        [HttpPost("add")]
        public IActionResult AddEquipment(EquipmentDto dto)
        {
            string token = Request.Headers["Authorization"].ToString() ?? "";
            string role = GetUserRoleFromToken(token);
            if (role != "Admin") return Unauthorized("Only admins can add equipment");
            string connStr = _config.GetConnectionString("DefaultConnection");
            using SqlConnection conn = new SqlConnection(connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(@"
                INSERT INTO Equipment (Name, Category, Condition, Quantity, Availability)
                VALUES (@Name, @Category, @Condition, @Quantity, @Availability)", conn);

            cmd.Parameters.AddWithValue("@Name", dto.Name);
            cmd.Parameters.AddWithValue("@Category", dto.Category);
            cmd.Parameters.AddWithValue("@Condition", dto.Condition);
            cmd.Parameters.AddWithValue("@Quantity", dto.Quantity);
            cmd.Parameters.AddWithValue("@Availability", dto.Availability);

            cmd.ExecuteNonQuery();
            return Ok("Equipment added");
        }

        [HttpPut("edit/{id}")]
        public IActionResult EditEquipment(int id, EquipmentDto dto)
        {
            string token = Request.Headers["Authorization"].ToString() ?? "";
            string role = GetUserRoleFromToken(token);
            if (role != "Admin") return Unauthorized("Only admins can add equipment");
            string connStr = _config.GetConnectionString("DefaultConnection");
            using SqlConnection conn = new SqlConnection(connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(@"
                UPDATE Equipment SET 
                    Name = @Name,
                    Category = @Category,
                    Condition = @Condition,
                    Quantity = @Quantity,
                    Availability = @Availability
                WHERE EquipmentId = @Id", conn);

            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@Name", dto.Name);
            cmd.Parameters.AddWithValue("@Category", dto.Category);
            cmd.Parameters.AddWithValue("@Condition", dto.Condition);
            cmd.Parameters.AddWithValue("@Quantity", dto.Quantity);
            cmd.Parameters.AddWithValue("@Availability", dto.Availability);

            int rows = cmd.ExecuteNonQuery();
            return rows > 0 ? Ok("Equipment updated") : NotFound("Item not found");
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteEquipment(int id)
        {
            string token = Request.Headers["Authorization"].ToString() ?? "";
            string role = GetUserRoleFromToken(token);
            if (role != "Admin") return Unauthorized("Only admins can add equipment");
            string connStr = _config.GetConnectionString("DefaultConnection");
            using SqlConnection conn = new SqlConnection(connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand("DELETE FROM Equipment WHERE EquipmentId = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            int rows = cmd.ExecuteNonQuery();
            return rows > 0 ? Ok("Equipment deleted") : NotFound("Item not found");
        }

        [HttpGet("list")]
        public IActionResult GetAllEquipment()
        {
            string connStr = _config.GetConnectionString("DefaultConnection");
            using SqlConnection conn = new SqlConnection(connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand("SELECT * FROM Equipment", conn);
            using SqlDataReader reader = cmd.ExecuteReader();

            var equipmentList = new List<EquipmentDto>();
            while (reader.Read())
            {
                equipmentList.Add(new EquipmentDto
                {
                    EquipmentId = Convert.ToInt32(reader["EquipmentId"]),
                    Name = reader["Name"].ToString(),
                    Category = reader["Category"].ToString(),
                    Condition = reader["Condition"].ToString(),
                    Quantity = Convert.ToInt32(reader["Quantity"]),
                    Availability = Convert.ToBoolean(reader["Availability"])
                });
            }

            return Ok(equipmentList);
        }

    }
}
    