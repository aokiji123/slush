using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class ChatParticipant
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid ChatId { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
}