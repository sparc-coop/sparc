using Sparc.Store.Billing;

namespace Sparc.Store.Products;

public class UserPrice(decimal amount, string currency)
{
    public decimal Amount { get; set; } = amount;
    public SparcCurrency Currency { get; set; } = SparcCurrency.From(currency);

    public override string ToString() => Currency.ToString(Amount);
}
