using EquipmentLendingAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Org.BouncyCastle.Crypto.Generators;
using System.Data.SqlClient;

namespace EquipmentLendingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("register")]
        public IActionResult Register(UserRegisterDto dto)
        {
            string connStr = _config.GetConnectionString("DefaultConnection");
            using SqlConnection conn = new SqlConnection(connStr);
            conn.Open();

            SqlCommand roleCmd = new SqlCommand("SELECT RoleId FROM Roles WHERE RoleName = @RoleName", conn);
            roleCmd.Parameters.AddWithValue("@RoleName", dto.RoleName);
            var roleId = roleCmd.ExecuteScalar();
            if (roleId == null) return BadRequest("Invalid role");

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            SqlCommand insertCmd = new SqlCommand("INSERT INTO Users (FullName, Email, PasswordHash, RoleId) VALUES (@FullName, @Email, @PasswordHash, @RoleId)", conn);
            insertCmd.Parameters.AddWithValue("@FullName", dto.FullName);
            insertCmd.Parameters.AddWithValue("@Email", dto.Email);
            insertCmd.Parameters.AddWithValue("@PasswordHash", hashedPassword);
            insertCmd.Parameters.AddWithValue("@RoleId", (int)roleId);

            insertCmd.ExecuteNonQuery();
            return Ok("User registered");
        }

        [HttpPost("login")]
        public IActionResult Login(UserLoginDto dto)
        {
            string connStr = _config.GetConnectionString("DefaultConnection");
            using SqlConnection conn = new SqlConnection(connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(@"
                SELECT u.UserId, u.PasswordHash, r.RoleName 
                FROM Users u 
                JOIN Roles r ON u.RoleId = r.RoleId 
                WHERE u.Email = @Email", conn);
            cmd.Parameters.AddWithValue("@Email", dto.Email);

            using SqlDataReader reader = cmd.ExecuteReader();
            if (!reader.HasRows) return Unauthorized("Invalid credentials");

            reader.Read();
            int userId = Convert.ToInt32(reader["UserId"]);
            string passwordHash = reader["PasswordHash"].ToString();
            string role = reader["RoleName"].ToString();

            if (dto.Password != null && BCrypt.Net.BCrypt.Verify(dto.Password, passwordHash))
            {
                string token = $"SIMULATED-TOKEN-{userId}-{role}";
                return Ok(new { Token = token, Role = role });
            }

            return Unauthorized("Invalid credentials");
        }

        [HttpGet("user/{id}")]
        public IActionResult GetUserById(int id)
        {
            string connStr = _config.GetConnectionString("DefaultConnection");
            using SqlConnection conn = new SqlConnection(connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(@"
                SELECT u.UserId, u.FullName, u.Email, r.RoleName 
                FROM Users u 
                JOIN Roles r ON u.RoleId = r.RoleId 
                WHERE u.UserId = @UserId", conn);
            cmd.Parameters.AddWithValue("@UserId", id);

            using SqlDataReader reader = cmd.ExecuteReader();
            if (!reader.HasRows) return NotFound("User not found");

            reader.Read();
            var user = new
            {
                UserId = Convert.ToInt32(reader["UserId"]),
                FullName = reader["FullName"].ToString(),
                Email = reader["Email"].ToString(),
                Role = reader["RoleName"].ToString()
            };

            return Ok(user);
        }
    }
}
