using Microsoft.EntityFrameworkCore;
using Sparc.App.Ideas;
using Sparc.App.Projects;
using Sparc.Blossom.Billing;

namespace Sparc.App;

public class SparcContext(DbContextOptions options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Idea>().ToContainer("Ideas")
            .HasPartitionKey(x => x.IdeaId)
            .HasKey(x => x.Id);

        builder.Entity<Project>().ToContainer("Projects")
            .HasPartitionKey(x => x.ProjectId)
            .HasKey(x => x.Id);
    }
}
