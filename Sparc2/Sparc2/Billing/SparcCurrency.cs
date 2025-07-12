using System.Globalization;

namespace Sparc.Store.Billing;

public class SparcCurrency(RegionInfo region)
{
    public SparcCurrency() : this(new RegionInfo(CultureInfo.CurrentCulture.Name))
    {
    }

    public SparcCurrency(string cultureId) : this(new RegionInfo(cultureId))
    {
        CultureId = cultureId;
    }

    public string Id { get; set; } = region.ISOCurrencySymbol;
    public string Name { get; set; } = region.CurrencyEnglishName;
    public string Symbol { get; set; } = region.CurrencySymbol;
    public string NativeName { get; set; } = region.CurrencyNativeName;
    public string CultureId { get; set; } = CultureInfo.CurrentCulture.Name;

    public static SparcCurrency From(string currency)
    {
        var matchingRegion = CultureInfo.GetCultures(CultureTypes.SpecificCultures)
            .Select(culture => new RegionInfo(culture.Name))
            .FirstOrDefault(region => region.ISOCurrencySymbol.Equals(currency, StringComparison.OrdinalIgnoreCase));

        return matchingRegion != null 
            ? new SparcCurrency(matchingRegion) 
            : new SparcCurrency();
    }

    public string ToString(decimal amount) => amount.ToString("C", CultureInfo.CreateSpecificCulture(CultureId));
}
