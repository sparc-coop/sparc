namespace Sparc2.Products;

public class Products(BlossomAggregateOptions<Product> options) : BlossomAggregate<Product>(options)
{
    public BlossomQuery<Product> GetAllProducts()
        => Query().OrderByDescending(x => x.DateCreated);

    public BlossomQuery<Product> GetProductById(string id)
    => Query().Where(x => x.Id == id);

    public BlossomQuery<Product> GetProductByTitle(string title)
        => Query().Where(x => x.Title.Contains(title));

    public BlossomQuery<Product> GetProductsByAuthor(string author)
        => Query().Where(x => x.Author == author);
}