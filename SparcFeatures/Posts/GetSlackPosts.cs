using Microsoft.AspNetCore.Mvc;

namespace SparcFeatures.Posts
{
    public class GetSlackPosts : PublicFeature<string, List<SlackPost>>
    {
        public GetSlackPosts(IRepository<SlackPost> posts)
        {
            Posts = posts;
        }
        public IRepository<SlackPost> Posts { get; }

        public override async Task<List<SlackPost>> ExecuteAsync(string command)
        {
            List<SlackPost> postList = await Posts.Query.Where(x => x.command == command).ToListAsync();
            return postList;
        }
    }
}
