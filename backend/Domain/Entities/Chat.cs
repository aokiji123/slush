using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Chat
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid ChatTypeId { get; set; }
    
    
    public ChatType ChatType { get; set; }
    
    [MaxLength(255)]
    public string Name { get; set; }
    
    [Required]
    public DateTime Timestamp { get; set; }
    
    
    public ICollection<ChatParticipant> ChatParticipants { get; set; } = new List<ChatParticipant>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}