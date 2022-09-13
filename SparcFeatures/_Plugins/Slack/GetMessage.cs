using Sparc.Core;
using Sparc.Features;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Sparc.SparcFeatures.Slack.Entities;

namespace SparcFeatures._Plugins.Slack
{
    public class GetMessage : PublicFeature<Rootobj>
    {

        private readonly IConfiguration _config;
        public GetMessage(IConfiguration config)
        {
            _config = config;
        }

        public override async Task<Rootobj> ExecuteAsync()
        {
            Rootobj data = new Rootobj();

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://slack.com/api/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config["SlackToken"]);

                var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                //get user list api.slack.com/methods/users.list
                HttpResponseMessage response = await client.GetAsync("conversations.history?channel=C040XKHTEMA&latest=" + timestamp + "&inclusive=true&limit=1");

                if (response.IsSuccessStatusCode)
                {
                    string responseText = await response.Content.ReadAsStringAsync();
                    data = JsonConvert.DeserializeObject<Rootobj>(responseText);
                    return data;
                }
                else
                {
                    Console.WriteLine("Internal server Error");
                    return data;
                }
            }
        }
    }
}


public class Rootobj
{
    public SlackMessage[] messages { get; set; }
    public bool has_more { get; set; }
    public bool ok { get; set; }
    public Response_Metadata response_metadata { get; set; }
}

public class Response_Metadata
{
    public string next_cursor { get; set; }
}

public class SlackMessage
{
    public string type { get; set; }
    public string user { get; set; }
    public string text { get; set; }
    public string thread_ts { get; set; }
    public int reply_count { get; set; }
    public bool subscribed { get; set; }
    public string last_read { get; set; }
    public int unread_count { get; set; }
    public string ts { get; set; }
    public string parent_user_id { get; set; }
}
