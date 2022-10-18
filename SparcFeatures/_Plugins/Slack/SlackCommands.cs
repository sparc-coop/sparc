using Microsoft.AspNetCore.Mvc;
using SparcFeatures._Plugins.Slack;
using System.Linq;

namespace SparcFeatures._Plugins.Slack;

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
    public async Task<string> Post([FromForm]SlackPost request)
    {
        SaveNewPost(request);

        return $"'{request.Text}' - Thank you, your post has been received!";
    }

    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task SaveNewPost(SlackPost request)
    {
        SlackPost newPost = request;
        string[] parseRequest = request.Text.Split(' ', 2);
        newPost.SiteName = parseRequest[0];
        newPost.PostType = parseRequest[1].Split(' ', 2)[0];
        newPost.Text = parseRequest[1].Split(' ', 2)[1];

        Posts.UpdateAsync(newPost);
    }
}
