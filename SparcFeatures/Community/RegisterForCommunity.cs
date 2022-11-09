using Sparc.Kernel;
using Sparc.Notifications.Twilio;

namespace Sparc.Coop.Community;

public record RegisterForCommunityRequest(string Email);
public class RegisterForCommunity : Feature<RegisterForCommunityRequest, bool>
{
    TwilioService Twilio { get; set; }

    public RegisterForCommunity(TwilioService twilio)
    {
        Twilio = twilio;
    }

    public override async Task<bool> ExecuteAsync(RegisterForCommunityRequest request)
    {
        await Twilio.AddContactAsync(request.Email, "689a1a54-cef8-4327-a04d-abd6a8787dd9");
        return true;
    }
}
