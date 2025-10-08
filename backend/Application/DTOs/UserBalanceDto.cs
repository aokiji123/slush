using System;

namespace Application.DTOs;

public class UserBalanceDto
{
    public Guid UserId { get; set; }
    public decimal AmountToAdd { get; set; }
}


