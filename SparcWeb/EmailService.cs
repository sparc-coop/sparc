using Sparc.Notifications.Twilio;

namespace SparcWeb
{
    public class EmailService
    {
        public EmailService()
        { }
        public EmailService(TwilioService twilio)
        {
            Twilio = twilio;
        }
        TwilioService Twilio { get; set; }

        public async Task SendContactEmail()
        {
            string messageBody = "Contact email submission from Sparc website!";
            await Twilio.SendEmailAsync("margaret@kuviocreative.com", "Test Sparc Contact", messageBody, "margaret@kuviocreative.com");
        }
    }
}
