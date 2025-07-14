using Bogus;
using Sparc.Engine.Billing;
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

    internal static IEnumerable<Product> Generate(int qty)
    {
        var faker = new Faker<Product>()
            .CustomInstantiator(f => new Product(
                f.Lorem.Sentence(3),
                f.Lorem.Word() // Status
            ));

        return faker.Generate(qty);
    }

    //public Dictionary<ProductTags, string> ProductTagsDictionary = new()
    //{
    //    { ProductTags.ComingSoon, "Coming Soon"},
    //    { ProductTags.DevelopmentInProgress, "Development In Progress" },
    //    { ProductTags.AlphaTesting, "Alpha Testing" },
    //    { ProductTags.BetaTesting, "Beta Testing" },
    //    { ProductTags.NowLive, "Now Live" },
    //    { ProductTags.Archived, "Archived" },
    //    { ProductTags.ActivelyUpdating, "Actively Updating" },
    //    { ProductTags.AvailableForBetaTest, "Available for Beta Test" },
    //    { ProductTags.AvailableForPurchase, "Available for Purchase" },
    //    { ProductTags.AvailableForGift, "Available for Gift" },
    //    { ProductTags.YouOwnThis, "You Own This" }
    //};
}