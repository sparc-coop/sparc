using Sparc.Blossom.Authentication;

namespace Sparc.Engine;

public class SparcUser : BlossomUser
{
    public List<ProductLicense> Products { get; set; } = [];

    public bool HasProduct(string productName)
    {
        return Products.Any(x => x.ProductId.Equals(productName, StringComparison.OrdinalIgnoreCase));
    }

    public void AddProduct(string productName)
    {
        if (HasProduct(productName))
            return;

        var serial = Guid.NewGuid().ToString();
        Products.Add(new SparcProduct(productName, serial, DateTime.UtcNow, Id));
    }

    public override void RegisterClaims()
    {
        foreach (var product in Products)
            AddClaim("product", product.ProductId);
    }
}
