using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class User
{
    [Key]
    public Guid Id { get; set; }

    [Required, MaxLength(100)]
    public string Nickname { get; set; } = null!;

    [Required, EmailAddress, MaxLength(255)]
    public string Email { get; set; } = null!;

    [MaxLength(1000)]
    public string? Bio { get; set; }

    [Required, MaxLength(2)]
    public string Lang { get; set; } = "UA";

    [MaxLength(255)]
    public string? Avatar { get; set; }

    [MaxLength(255)]
    public string? Banner { get; set; }

    [Required]
    public byte[] Hash { get; set; } = Array.Empty<byte>();

    [Required]
    public byte[] Salt { get; set; } = Array.Empty<byte>();

    [Range(0, double.MaxValue)]
    public decimal Balance { get; set; }
}