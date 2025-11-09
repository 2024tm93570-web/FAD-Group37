using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using EquipmentLendingAPI.Models;

namespace EquipmentLendingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestController : ControllerBase
    {
        private readonly IConfiguration _config;

        public RequestController(IConfiguration config)
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

        private int GetUserIdFromToken(string token)
        {
            if (string.IsNullOrEmpty(token)) return -1;
            // Handle "Bearer" prefix if present
            if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                token = token.Substring(7);
            var parts = token.Split('-');
            // Format: SIMULATED-TOKEN-{userId}-{role}
            return parts.Length >= 4 ? Convert.ToInt32(parts[2]) : -1;
        }

        [HttpPost("request")]
        public IActionResult RequestEquipment(EquipmentRequestDto dto)
        {
            string connStr = _config.GetConnectionString("DefaultConnection");
            using SqlConnection conn = new SqlConnection(connStr);
            conn.Open();

            // Check equipment availability and quantity
            SqlCommand checkEquipmentCmd = new SqlCommand(@"
                SELECT Quantity, Availability FROM Equipment WHERE EquipmentId = @EquipmentId", conn);
            checkEquipmentCmd.Parameters.AddWithValue("@EquipmentId", dto.EquipmentId);
            using SqlDataReader equipmentReader = checkEquipmentCmd.ExecuteReader();
            
            if (!equipmentReader.HasRows) return BadRequest("Equipment not found");
            equipmentReader.Read();
            int quantity = Convert.ToInt32(equipmentReader["Quantity"]);
            bool availability = Convert.ToBoolean(equipmentReader["Availability"]);
            equipmentReader.Close();

            // Check if equipment is available
            if (quantity <= 0 || !availability)
            {
                return BadRequest("Equipment is not available (quantity is 0 or marked as unavailable)");
            }

            // Check for overlapping booking
            SqlCommand checkCmd = new SqlCommand(@"
                SELECT COUNT(*) FROM EquipmentRequests 
                WHERE EquipmentId = @EquipmentId AND Status IN ('Pending', 'Approved')", conn);
            checkCmd.Parameters.AddWithValue("@EquipmentId", dto.EquipmentId);
            int count = Convert.ToInt32(checkCmd.ExecuteScalar());
            if (count > 0) return BadRequest("Equipment is already booked or pending approval");

            SqlCommand cmd = new SqlCommand(@"
                INSERT INTO EquipmentRequests (EquipmentId, RequestedBy, Status)
                VALUES (@EquipmentId, @RequestedBy, 'Pending')", conn);
            cmd.Parameters.AddWithValue("@EquipmentId", dto.EquipmentId);
            cmd.Parameters.AddWithValue("@RequestedBy", dto.RequestedBy);
            cmd.ExecuteNonQuery();

            return Ok("Request submitted");
        }

        [HttpPut("approve/{requestId}")]
        public IActionResult ApproveRequest(int requestId)
        {
            string token = Request.Headers["Authorization"].ToString() ?? "";
            string role = GetUserRoleFromToken(token);
            int approverId = GetUserIdFromToken(token);
            if (role != "Admin" && role != "LabAssistant") return Unauthorized("Only admin/lab assistant can approve");

            string connStr = _config.GetConnectionString("DefaultConnection");
            using SqlConnection conn = new SqlConnection(connStr);
            conn.Open();

            // Get the equipment ID from the request
            SqlCommand getRequestCmd = new SqlCommand(@"
                SELECT EquipmentId FROM EquipmentRequests WHERE RequestId = @RequestId", conn);
            getRequestCmd.Parameters.AddWithValue("@RequestId", requestId);
            var equipmentIdObj = getRequestCmd.ExecuteScalar();
            
            if (equipmentIdObj == null) return NotFound("Request not found");
            int equipmentId = Convert.ToInt32(equipmentIdObj);

            // Update request status
            SqlCommand updateRequestCmd = new SqlCommand(@"
                UPDATE EquipmentRequests 
                SET Status = 'Approved', ApprovedBy = @ApprovedBy 
                WHERE RequestId = @RequestId", conn);
            updateRequestCmd.Parameters.AddWithValue("@RequestId", requestId);
            updateRequestCmd.Parameters.AddWithValue("@ApprovedBy", approverId);
            updateRequestCmd.ExecuteNonQuery();

            // Decrease equipment quantity and update availability
            SqlCommand updateEquipmentCmd = new SqlCommand(@"
                UPDATE Equipment 
                SET Quantity = Quantity - 1,
                    Availability = CASE WHEN Quantity - 1 <= 0 THEN 0 ELSE 1 END
                WHERE EquipmentId = @EquipmentId", conn);
            updateEquipmentCmd.Parameters.AddWithValue("@EquipmentId", equipmentId);
            updateEquipmentCmd.ExecuteNonQuery();

            return Ok("Request approved");
        }

        [HttpPut("reject/{requestId}")]
        public IActionResult RejectRequest(int requestId)
        {
            string token = Request.Headers["Authorization"].ToString() ?? "";
            string role = GetUserRoleFromToken(token);
            if (role != "Admin" && role != "LabAssistant") return Unauthorized("Only admin/lab assistant can reject");

            string connStr = _config.GetConnectionString("DefaultConnection");
            using SqlConnection conn = new SqlConnection(connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(@"
                UPDATE EquipmentRequests 
                SET Status = 'Rejected' 
                WHERE RequestId = @RequestId", conn);
            cmd.Parameters.AddWithValue("@RequestId", requestId);

            int rows = cmd.ExecuteNonQuery();
            return rows > 0 ? Ok("Request rejected") : NotFound("Request not found");
        }

        [HttpPut("return/{requestId}")]
        public IActionResult MarkAsReturned(int requestId)
        {
            string token = Request.Headers["Authorization"].ToString() ?? "";
            string role = GetUserRoleFromToken(token);
            if (role != "Admin" && role != "LabAssistant") return Unauthorized("Only admin/lab assistant can mark return");

            string connStr = _config.GetConnectionString("DefaultConnection");
            using SqlConnection conn = new SqlConnection(connStr);
            conn.Open();

            // Get the equipment ID from the request
            SqlCommand getRequestCmd = new SqlCommand(@"
                SELECT EquipmentId FROM EquipmentRequests WHERE RequestId = @RequestId", conn);
            getRequestCmd.Parameters.AddWithValue("@RequestId", requestId);
            var equipmentIdObj = getRequestCmd.ExecuteScalar();
            
            if (equipmentIdObj == null) return NotFound("Request not found");
            int equipmentId = Convert.ToInt32(equipmentIdObj);

            // Update request status
            SqlCommand updateRequestCmd = new SqlCommand(@"
                UPDATE EquipmentRequests 
                SET Status = 'Returned', ReturnDate = GETDATE() 
                WHERE RequestId = @RequestId", conn);
            updateRequestCmd.Parameters.AddWithValue("@RequestId", requestId);
            updateRequestCmd.ExecuteNonQuery();

            // Increase equipment quantity and update availability
            SqlCommand updateEquipmentCmd = new SqlCommand(@"
                UPDATE Equipment 
                SET Quantity = Quantity + 1,
                    Availability = 1
                WHERE EquipmentId = @EquipmentId", conn);
            updateEquipmentCmd.Parameters.AddWithValue("@EquipmentId", equipmentId);
            updateEquipmentCmd.ExecuteNonQuery();

            return Ok("Marked as returned");
        }

        [HttpGet("list")]
        public IActionResult GetAllRequests()
        {
            string connStr = _config.GetConnectionString("DefaultConnection");
            using SqlConnection conn = new SqlConnection(connStr);
            conn.Open();

            string query = @"
                SELECT r.RequestId, r.EquipmentId, e.Name AS ItemName, 
                       r.RequestedBy, u.FullName AS RequestedByName,
                       r.Status, r.RequestDate, r.ReturnDate
                FROM EquipmentRequests r
                JOIN Equipment e ON r.EquipmentId = e.EquipmentId
                JOIN Users u ON r.RequestedBy = u.UserId
                ORDER BY r.RequestDate DESC";

            SqlCommand cmd = new SqlCommand(query, conn);
            using SqlDataReader reader = cmd.ExecuteReader();

            var requests = new List<object>();
            while (reader.Read())
            {
                requests.Add(new
                {
                    id = Convert.ToInt32(reader["RequestId"]),
                    equipmentId = Convert.ToInt32(reader["EquipmentId"]),
                    itemName = reader["ItemName"].ToString(),
                    requestedBy = Convert.ToInt32(reader["RequestedBy"]),
                    requestedByName = reader["RequestedByName"].ToString(),
                    status = reader["Status"].ToString(),
                    qty = 1, // Default quantity
                    createdAt = Convert.ToDateTime(reader["RequestDate"]).ToString("yyyy-MM-ddTHH:mm:ss")
                });
            }

            return Ok(requests);
        }
    }
}
