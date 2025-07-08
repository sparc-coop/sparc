using Sparc.Blossom.Billing;
using Sparc.Blossom.Payment.Stripe;

namespace Sparc.Store.Billing;

public record CreateOrderPaymentRequest(long Amount, string Currency, string? CustomerId, string? ReceiptEmail, Dictionary<string, string>? Metadata, string? SetupFutureUsage);

public class SparcStoreBillingService(ExchangeRates rates) : StripePaymentService(rates)
{
    public async Task<string> CreateOrderPaymentAsync(long orderAmount, string orderCurrency, string? customerId = null, string? receiptEmail = null, Dictionary<string, string>? metadata = null, string? setupFutureUsage = null)
    {
        var paymentIntent = await CreatePaymentIntentAsync(
            amount: orderAmount,
            currency: orderCurrency,
            customerId: customerId,
            receiptEmail: receiptEmail,
            metadata: metadata,
            setupFutureUsage: setupFutureUsage
        );

        return paymentIntent.ClientSecret;
    }

    public async Task<GetProductResponse> GetProductAsync(string productId)
    {
        var product = await GetStripeProductAsync(productId);
        var priceList = await GetAllPricesForProductAsync(productId);

        var priceResultList = new List<Dictionary<string, long>>();

        foreach (var price in priceList)
        {
            var prices = new Dictionary<string, long>();
            foreach (var item in price.CurrencyOptions)
            {
                prices.Add(item.Key, item.Value.UnitAmount ?? 0);

            }
            priceResultList.Add(prices);
        }

        var result = new GetProductResponse
        (
            Id: product.Id,
            Name: product.Name,
            Price: 0,
            Currency: "usd",
            IsActive: product.Active,
            Prices: priceResultList
        );

        return result;
    }
}