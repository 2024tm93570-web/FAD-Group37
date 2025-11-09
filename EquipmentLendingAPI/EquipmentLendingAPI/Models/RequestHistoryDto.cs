namespace EquipmentLendingAPI.Models
{
    public class RequestHistoryDto
    {
            public int RequestId { get; set; }
            public string EquipmentName { get; set; }
            public string RequestedBy { get; set; }
            public string Role { get; set; }
            public string Status { get; set; }
            public string ApprovedBy { get; set; }
            public DateTime RequestDate { get; set; }
            public DateTime? ReturnDate { get; set; }
        
    }

}

