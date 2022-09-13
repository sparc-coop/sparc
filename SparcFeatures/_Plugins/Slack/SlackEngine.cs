using Newtonsoft.Json;
using Sparc.Core;
using Sparc.Features;
using System.Net.Http.Headers;

namespace SparcFeatures._Plugins
{
    public class SlackEngine
    {
        private readonly IConfiguration _config;
        public SlackEngine(IConfiguration config)
        {
            _config = config;
        }

        internal async Task ExecuteAsync()
        {
            //Rootobject data = new Rootobject();

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://slack.com/api/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config["SlackToken"]);

                //get user list api.slack.com/methods/users.list
                //HttpResponseMessage response = await client.GetAsync("users.list?limit=100");

                //if (response.IsSuccessStatusCode)
                //{
                //    string responseText = await response.Content.ReadAsStringAsync();
                //    data = JsonConvert.DeserializeObject<Rootobject>(responseText);
                //    return data;
                //}
                //else
                //{
                //    Console.WriteLine("Internal server Error");
                //    return data;
                //}

            }
        }
    }
}
