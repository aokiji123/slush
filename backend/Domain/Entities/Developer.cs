using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Developer
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid GameId { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
}