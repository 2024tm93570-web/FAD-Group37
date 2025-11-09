namespace EquipmentLendingAPI.Models
{
    public class EquipmentDto
    {
            public int EquipmentId { get; set; }
            public string Name { get; set; }
            public string Category { get; set; }
            public string Condition { get; set; }
            public int Quantity { get; set; }
            public bool Availability { get; set; }
    }
}



