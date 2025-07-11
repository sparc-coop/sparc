namespace Sparc.Engine;

public class ProductLicense(string productId, string serialNumber, DateTime purchaseDate)
{
    public ProductLicense() : this("", "", DateTime.UtcNow)
    {
    }

    public string ProductId { get; set; } = productId;
    public string SerialNumber { get; set; } = serialNumber;
    public DateTime PurchaseDate { get; set; } = purchaseDate;
    public int UsageMeter { get; set; } = 0;
}
