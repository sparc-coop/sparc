using Microsoft.EntityFrameworkCore;
using Sparc.Blossom;

namespace Sparc.Coop;

public partial class SparcContext(BlossomContextOptions options) : BlossomContext(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<User>().ToContainer("Users").HasPartitionKey(x => x.Id);
    }
}
