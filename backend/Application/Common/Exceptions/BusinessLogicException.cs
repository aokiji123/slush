using System;

namespace Application.Common.Exceptions;

/// <summary>
/// Exception thrown when business logic rules are violated
/// </summary>
public class BusinessLogicException : Exception
{
    public BusinessLogicException() : base()
    {
    }

    public BusinessLogicException(string message) : base(message)
    {
    }

    public BusinessLogicException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
