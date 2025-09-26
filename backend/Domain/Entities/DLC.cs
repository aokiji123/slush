using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class DLC
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid GameId { get; set; }
    public Game Game { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; }

    [Required]
    public string Description { get; set; }

    [Range(0, 1000)]
    public decimal Price { get; set; }

    [Required]
    public DateTime ReleaseDate { get; set; }
    public Guid? DiscountId { get; set; }
    public Discount? Discount { get; set; }

    public decimal GetFinalPrice()
    {
        if (Discount != null && Discount.IsActive)
        {
            var discountAmount = Price * Discount.Percentage / 100;
            return Math.Round(Price - discountAmount, 2);
        }
        return Price;
    }
}