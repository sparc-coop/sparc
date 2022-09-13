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
    public class GetSlackPost : PublicFeature<string, Postobject>
    {

        private readonly IConfiguration _config;
        public GetSlackPost(IConfiguration config)
        {
            _config = config;
        }

        public override async Task<Postobject> ExecuteAsync(string JsonString)
        {
            Postobject data = new Postobject();

            data = JsonConvert.DeserializeObject<Postobject>(JsonString);

            return data;
        }
    }
}


public class Postobject
{
    public string token { get; set; }
    public string team_id { get; set; }
    public string api_app_id { get; set; }
    public Event _event { get; set; }
    public string type { get; set; }
    public string[] authed_users { get; set; }
    public Authorization[] authorizations { get; set; }
    public string event_id { get; set; }
    public string event_context { get; set; }
    public int event_time { get; set; }
}

public class Event
{
    public string type { get; set; }
    public string user { get; set; }
    public Item item { get; set; }
    public string reaction { get; set; }
    public string item_user { get; set; }
    public string event_ts { get; set; }
}

public class Item
{
    public string type { get; set; }
    public string channel { get; set; }
    public string ts { get; set; }
}

public class Authorization
{
    public string enterprise_id { get; set; }
    public string team_id { get; set; }
    public string user_id { get; set; }
    public bool is_bot { get; set; }
}

