using Sparc.Blossom.Authentication;
using Sparc.Engine.Billing;

namespace Sparc2.Products;

public record ProductInfo(Product Product, UserPrice Price);
public class Products(BlossomAggregateOptions<Product> options, ISparcBilling billing) : BlossomAggregate<Product>(options)
{
    public BlossomQuery<Product> GetAllProducts()
        => Query().OrderByDescending(x => x.DateCreated);

    public async Task<ProductInfo> GetProductById(string id, string? currency = null)
    {
        var product = await Repository.FindAsync(id);
        currency ??= User.Get("currency") ?? "USD";

        var priceInfo = await billing.GetProductAsync(product!.StripeProductId!, currency);
        return new(product, new(priceInfo.Price, priceInfo.Currency));
    }
}