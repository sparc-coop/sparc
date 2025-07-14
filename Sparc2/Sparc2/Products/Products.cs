using Sparc.Engine.Billing;

namespace Sparc2.Products;

public class Products(BlossomAggregateOptions<Product> options) : BlossomAggregate<Product>(options)
{
    public BlossomQuery<Product> GetAllProducts()
        => Query().OrderByDescending(x => x.DateCreated);
}