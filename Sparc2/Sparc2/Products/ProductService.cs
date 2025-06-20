namespace Sparc2.Products;

internal class ProductService
{
    public event Func<Task>? OnProductsChanged;

    public async Task AddProduct()
    {
        if (OnProductsChanged is not null)
        {
            await OnProductsChanged.Invoke();
        }
    }
}