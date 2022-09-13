using Newtonsoft.Json;
using Sparc.Core;
using Sparc.Features;
using System.Collections.Specialized;
using System.Net;
using System.Text;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using static IdentityServer4.IdentityServerConstants;
using System.Text.Json.Nodes;
using System.Linq.Expressions;
using System.Reflection.Metadata.Ecma335;
using Sparc.SparcFeatures.Slack.Entities;

namespace SparcFeatures._Plugins.Slack;

public record UserSignUpRequest(string email);
public class UserSignUp : PublicFeature<UserSignUpRequest, bool>
{

    public UserSignUp(IConfiguration config)
    {
        _config = config;
    }

    private readonly IConfiguration _config;
    public override async Task<bool> ExecuteAsync(UserSignUpRequest request)
    {

        Payload payload = new Payload()
        {
            Channel = "C040XKHTEMA",
            Text = "A new join request!" + "\n" + "Email: " + request.email,
        };

        return await new SlackEngine(_config).SlackApiPost(payload);

    }

}





