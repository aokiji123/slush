using System;

namespace Application.DTOs;

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid? GameId { get; set; }
    public decimal Sum { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime Data { get; set; }
}

public class CreatePaymentDto
{
    public Guid UserId { get; set; }
    public Guid? GameId { get; set; }
    public decimal Sum { get; set; }
    public string Name { get; set; } = string.Empty;
}
