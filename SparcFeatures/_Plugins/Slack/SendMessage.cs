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
using Sparc.SparcFeatures.Slack.Entities;
using Sparc.SparcFeatures.Slack;

namespace SparcFeatures._Plugins.Slack;

public record SendMessageRequest(string userAt100, int Days);
public class SendMessage : PublicFeature<SendMessageRequest, bool>
{

    public SendMessage(IConfiguration config)
    {
        _config = config;
    }

    private readonly IConfiguration _config;
    public override async Task<bool> ExecuteAsync(SendMessageRequest request)
    {
        // giphy api
        HttpClient giphyClient = new HttpClient();
        giphyClient.BaseAddress = new Uri("https://api.giphy.com/v1/gifs/random");
        giphyClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        HttpResponseMessage gifResponse = await giphyClient.GetAsync("?api_key=4N6leZuzErvFU6scwP4mnTotgocowAar&tag=you+did+it&rating=g");
        string responseText = await gifResponse.Content.ReadAsStringAsync();
        var gif = JsonConvert.DeserializeObject<Gifobject>(responseText);
        var gifUrl = gif.Data.Images.Downsized.Url;

        string msgText;
        switch (request.Days)
        {
            case 50:
                msgText = request.userAt100 + " just hit 50 days on Law of 100! Halfway there!";
                break;
            case 90:
                msgText = request.userAt100 + " just hit 90 days on Law of 100! 10 more to go!";
                break;
            case 100:
                msgText = request.userAt100 + " just hit 100 days on Law of 100!" + "\n" + gifUrl;
                break;
            default:
                msgText = "";
                break;
        }

        Payload payload = new Payload()
        {
            Channel = "C03ULPZ5VDG",
            Text = msgText,
        };

        return await new SlackEngine(_config).SlackApiPost(payload);

    }


}





