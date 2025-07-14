namespace Sparc2.Products;

public class UserPrice(decimal amount, string currency)
{
    public decimal Amount { get; set; } = amount;
    public SparcCurrency Currency { get; set; } = SparcCurrency.From(currency);
}