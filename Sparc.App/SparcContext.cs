using Microsoft.EntityFrameworkCore;
using Sparc.App.Community;
using Sparc.App.Projects;

namespace Sparc.App;

public class SparcContext(DbContextOptions options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<SparcPost>().ToContainer("TextContent")
            .HasPartitionKey(x => x.Domain)
            .HasKey(x => x.Id);

        builder.Entity<Project>().ToContainer("Projects")
            .HasPartitionKey(x => x.ProjectId)
            .HasKey(x => x.Id);
    }
}
