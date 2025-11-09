using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using EquipmentLendingAPI.Models;

namespace EquipmentLendingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AnalyticsController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("history")]
        public IActionResult GetRequestHistory()
        {
            string connStr = _config.GetConnectionString("DefaultConnection");
            using SqlConnection conn = new SqlConnection(connStr);
            conn.Open();

            string query = @"
                SELECT r.RequestId, e.Name AS EquipmentName, u.FullName AS RequestedBy, rl.RoleName,
                       r.Status, a.FullName AS ApprovedBy, r.RequestDate, r.ReturnDate
                FROM EquipmentRequests r
                JOIN Equipment e ON r.EquipmentId = e.EquipmentId
                JOIN Users u ON r.RequestedBy = u.UserId
                JOIN Roles rl ON u.RoleId = rl.RoleId
                LEFT JOIN Users a ON r.ApprovedBy = a.UserId
                ORDER BY r.RequestDate DESC";

            SqlCommand cmd = new SqlCommand(query, conn);
            SqlDataReader reader = cmd.ExecuteReader();

            var history = new List<RequestHistoryDto>();
            while (reader.Read())
            {
                history.Add(new RequestHistoryDto
                {
                    RequestId = Convert.ToInt32(reader["RequestId"]),
                    EquipmentName = reader["EquipmentName"].ToString(),
                    RequestedBy = reader["RequestedBy"].ToString(),
                    Role = reader["RoleName"].ToString(),
                    Status = reader["Status"].ToString(),
                    ApprovedBy = reader["ApprovedBy"] == DBNull.Value ? null : reader["ApprovedBy"].ToString(),
                    RequestDate = Convert.ToDateTime(reader["RequestDate"]),
                    ReturnDate = reader["ReturnDate"] == DBNull.Value ? null : Convert.ToDateTime(reader["ReturnDate"])
                });
            }

            return Ok(history);
        }

        [HttpGet("summary")]
        public IActionResult GetUsageSummary()
        {
            string connStr = _config.GetConnectionString("DefaultConnection");
            using SqlConnection conn = new SqlConnection(connStr);
            conn.Open();

            int totalRequests = 0;
            int returnedCount = 0;
            string mostRequestedItem = "";
            var requestsByRole = new Dictionary<string, int>();

            // Total requests
            using (SqlCommand totalCmd = new SqlCommand("SELECT COUNT(*) FROM EquipmentRequests", conn))
            {
                totalRequests = Convert.ToInt32(totalCmd.ExecuteScalar());
            }

            // Returned count
            using (SqlCommand returnedCmd = new SqlCommand("SELECT COUNT(*) FROM EquipmentRequests WHERE Status = 'Returned'", conn))
            {
                returnedCount = Convert.ToInt32(returnedCmd.ExecuteScalar());
            }

            // Most requested item
            using (SqlCommand popularCmd = new SqlCommand(@"
                SELECT TOP 1 e.Name, COUNT(*) AS Count
                FROM EquipmentRequests r
                JOIN Equipment e ON r.EquipmentId = e.EquipmentId
                GROUP BY e.Name
                ORDER BY Count DESC", conn))
            using (SqlDataReader popReader = popularCmd.ExecuteReader())
            {
                if (popReader.Read())
                {
                    mostRequestedItem = popReader["Name"].ToString();
                }
            }

            // Requests by role
            using (SqlCommand roleCmd = new SqlCommand(@"
                SELECT rl.RoleName, COUNT(*) AS Count
                FROM EquipmentRequests r
                JOIN Users u ON r.RequestedBy = u.UserId
                JOIN Roles rl ON u.RoleId = rl.RoleId
                GROUP BY rl.RoleName", conn))
            using (SqlDataReader roleReader = roleCmd.ExecuteReader())
            {
                while (roleReader.Read())
                {
                    string role = roleReader["RoleName"].ToString();
                    int count = Convert.ToInt32(roleReader["Count"]);
                    requestsByRole.Add(role, count);
                }
            }

            var summary = new
            {
                TotalRequests = totalRequests,
                ReturnedCount = returnedCount,
                MostRequestedItem = mostRequestedItem,
                RequestsByRole = requestsByRole
            };

            return Ok(summary);
        }
    }
}
