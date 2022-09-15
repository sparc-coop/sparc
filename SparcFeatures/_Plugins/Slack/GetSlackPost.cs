using Sparc.Core;
using Sparc.Features;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Sparc.SparcFeatures.Slack.Entities;
using System.Text.Json.Serialization;
using SparcFeatures._Plugins.Slack.Entities;
//using Microsoft.AspNetCore.Mvc;

namespace SparcFeatures._Plugins.Slack
{
    public class GetSlackPost : PublicFeature<Postobject, string>
    {

        private readonly IConfiguration _config;
        public GetSlackPost(IConfiguration config)
        {
            _config = config;
        }

        public override async Task<string> ExecuteAsync(Postobject Json)
        {
            Postobject data = new Postobject();
            var returnStr = "";
            data = Json;

            if (_config["Slack:Verify"] == Json.token)
            {

                if (Json._event != null)
                {
                    returnStr = "event--> " + Json._event.type + " | " + Json._event.text;


                    Payload payload = new Payload()
                    {
                        Channel = "C040XKHTEMA",
                        Text = returnStr
                    };
                    await new SlackEngine(_config).SlackApiPost(payload);
                }
                else
                {
                    returnStr = "No event??" + Json.type;
                }
                //returnStr = data.challenge != null ? data.challenge : data.event_id;

            }
            else
            {

                returnStr = "Not working??";

                Payload payload = new Payload()
                {
                    Channel = "C040XKHTEMA",
                    Text = returnStr
                };
                await new SlackEngine(_config).SlackApiPost(payload);
            }


            //data = JsonConvert.DeserializeObject<Postobject>(JsonString);


            return returnStr;
        }
    }
}






//public class Postobject
//{
//    public string? token { get; set; }
//    public string? challenge { get; set; }
//    public string? team_id { get; set; }
//    public string? api_app_id { get; set; }
//    public Event? _event { get; set; }
//    public string? type { get; set; }
//    public string[]? authed_users { get; set; }
//    public Authorization[]? authorizations { get; set; }
//    public string? event_id { get; set; }
//    public string? event_context { get; set; }
//    public int? event_time { get; set; }
//}

//public class Event
//{
//    public string type { get; set; }
//    public string user { get; set; }
//    public Item item { get; set; }
//    public string reaction { get; set; }
//    public string item_user { get; set; }
//    public string event_ts { get; set; }
//}

//public class Item
//{
//    public string type { get; set; }
//    public string channel { get; set; }
//    public string ts { get; set; }
//}

//public class Authorization
//{
//    public string enterprise_id { get; set; }
//    public string team_id { get; set; }
//    public string user_id { get; set; }
//    public bool is_bot { get; set; }
//}

