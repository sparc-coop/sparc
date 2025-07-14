using Sparc.Engine.Billing;

namespace Sparc2.Products;

public record ProductInfo(Product Product, UserPrice Price);
public class Products(BlossomAggregateOptions<Product> options) : BlossomAggregate<Product>(options)
{
    public BlossomQuery<Product> GetAllProducts()
        => Query().OrderByDescending(x => x.DateCreated);
}