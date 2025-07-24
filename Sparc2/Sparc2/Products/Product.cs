using Bogus;
using System.ComponentModel.DataAnnotations;

namespace Sparc2.Products;

public record ProductCredit(string Name, string Title);

public class Product(string title, string status)
    : BlossomEntity<string>(Guid.NewGuid().ToString())
{
    [Required(ErrorMessage = "Title is required")]
    public string Title { get; set; } = title;
    public string? Description { get; set; }
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    public string? StripeProductId { get; set; }
    public decimal Price { get; set; } = 0M;
    public string Status { get; set; } = status;
    public string Url { get; set; } = "";
    public List<ProductCredit> Credits { get; set; } = [];
    public List<string> Images { get; set; } = [];
    public List<Tag> Tags { get; set; } =
    [
        new Tag("dev-in-progress", "Development In Progress", "development"),
        new Tag("updating", "Actively Updating", "testing")
    ];

    public void Update(string title, string description)
    {
        Title = title;
        Description = description;
    }
}