using Microsoft.EntityFrameworkCore;
using Sparc.App.Projects;

namespace Sparc.App;

public class SparcContext(DbContextOptions options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Project>().ToContainer("Projects")
            .HasPartitionKey(x => x.ProjectId)
            .HasKey(x => x.Id);
    }
}
