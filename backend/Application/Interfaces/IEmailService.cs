using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string htmlMessage);
        Task SendVerificationEmailAsync(string email, string code);
        Task SendPasswordResetEmailAsync(string email, string resetLink, string code);
    }
}
