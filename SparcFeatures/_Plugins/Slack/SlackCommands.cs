using Microsoft.AspNetCore.Mvc;

namespace SparcFeatures._Plugins.Slack
{
    [ApiController]
    [Route("api")]
    public class SlackCommands : ControllerBase
    {
        public IRepository<SlackPost> Posts { get; }
        public SlackCommands(IRepository<SlackPost> posts)
        {
            Posts = posts;  
        }

        [HttpPost("CreatePost")]
        public async Task<string> Post([FromForm]PostRequest request)
        {
            //var newPost = new SlackPost();
            //newPost.text = request.text;

            //await Posts.UpdateAsync(newPost);

            return $"'{request.text}' - Thank you, your post has been received!";
        }
    }

    public class EventsRequest
    {
        public string? token { get; set; }
        public string? challenge { get; set; }
        public string? type { get; set; }
    }

    public class PostRequest
    {
        public string? text { get; set; }
    }

}
