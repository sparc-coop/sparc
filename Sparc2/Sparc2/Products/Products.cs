using Sparc.Blossom.Authentication;
using Sparc.Store.Billing.Stripe;

namespace Sparc.Store.Products;

public class Products(BlossomAggregateOptions<Product> options, StripePaymentService stripe) 
    : BlossomAggregate<Product>(options)
{
    public BlossomQuery<Product> GetAllProducts()
        => Query().OrderByDescending(x => x.DateCreated);

    public async Task<Product> GetProductById(string id, string? currency = null)
    {
        var product = await Repository.FindAsync(id);
        currency ??= User.Get("currency") ?? "USD";
        
        var price = await stripe.GetPriceAsync(product!.Id, currency);
        if (price.HasValue)
            product.SetUserPrice(price.Value, currency);

        return product;
    }

    public async Task<string> StartCheckoutAsync(string email, string productId, string? currency = null)
    {
        var product = await GetProductById(productId, currency);
        if (product.UserPrice == null)
            throw new Exception("This product is not available in the selected currency.");

        var paymentIntent = await stripe.CreatePaymentIntentAsync(email, product.UserPrice.Amount, product.UserPrice.Currency.Id);
        return paymentIntent.ClientSecret;
    }
}