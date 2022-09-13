using Microsoft.AspNetCore.Mvc;

namespace SparcFeatures._Plugins.Slack
{
    public class GetSlackPosts : PublicFeature<List<SlackPost>>
    {
        public GetSlackPosts(IRepository<SlackPost> posts)
        {
            Posts = posts;
        }
        public IRepository<SlackPost> Posts { get; }

        public override async Task<List<SlackPost>> ExecuteAsync()
        {
            List<SlackPost> postList = await Posts.Query.Where(x => x.text != null).ToListAsync();
            return postList;
        }
    }
}
