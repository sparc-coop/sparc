using Microsoft.EntityFrameworkCore;

namespace SparcFeatures._Plugins
{
    public class SparcContext : DbContext
    {
        public SparcContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<SlackPost>().ToContainer("SlackPosts").HasPartitionKey(x => x.PostId);
        }
    }
}
