using Sparc.Blossom.Authentication;
using Sparc.Store.Products;

namespace Sparc.Store.Users;

public class SparcStoreUser : BlossomUser
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
        Products.Add(new ProductLicense(productName, serial, DateTime.UtcNow));
    }

    public override void RegisterClaims()
    {
        foreach (var product in Products)
            AddClaim("product", product.ProductId);
    }
}
