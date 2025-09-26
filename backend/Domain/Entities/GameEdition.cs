using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class GameEdition
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; }

    [Required]
    public string Description { get; set; }

    [Range(0, 5000)]
    public decimal Price { get; set; }

    public ICollection<Game> Games { get; set; } = new List<Game>();
    public ICollection<DLC> DLCs { get; set; } = new List<DLC>();

    public Guid? DiscountId { get; set; }
    public Discount? Discount { get; set; }
}