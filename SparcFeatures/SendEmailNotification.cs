

namespace SparcFeatures
{
    public class SendEmailNotification : Feature<bool>
    {
        TwilioService Twilio { get; set; }

        public SendRegistrationNotification(TwilioService twilio)
        {
            Twilio = twilio;
        }

        public override async Task<bool> ExecuteAsync(string emailAddress)
        {
            await Twilio.SendAsync(emailAddress, "Sparc email contact form");

            return true;
        }
    }
}
