using Microsoft.EntityFrameworkCore;
using Sparc.Engine;

internal class SparcAuraContext(DbContextOptions<SparcAuraContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder model)
    {
        model.Entity<SparcUser>().ToContainer("Users")
            .HasPartitionKey(x => x.UserId);
        
        model.Entity<SparcDomain>().ToContainer("Domains")
            .HasPartitionKey(x => x.Domain)
            .HasKey(x => x.Id);
    }
}