using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Discount
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [Range(1, 100)]
    public int Percentage { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public bool IsActive => DateTime.UtcNow >= StartDate && DateTime.UtcNow <= EndDate;
}