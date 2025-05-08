using Bogus;
using Microsoft.Extensions.Options;
using System.ComponentModel.DataAnnotations;

namespace Sparc2.Ideas;

public class ProjectIdea : BlossomEntity<string>
{
    [Required(ErrorMessage = "Title is required")]
    public string Title { get; set; }

    [Required(ErrorMessage = "Name is required")]
    public string Author { get; set; }
    public string Description { get; set; }
    public DateTime DateCreated { get; set; }
    public List<string> FileUrls { get; set; } = new();
    // Temporary solution. The ChannelId is hardcoded between three values.
    public string ChannelId => ChannelIdOptions[Rng.Next(ChannelIdOptions.Length)];
    private static readonly string[] ChannelIdOptions = ["C08RH3SD4M7", "C08RH3VUBB3", "C08R8PRF79S"];
    private static readonly Random Rng = new Random();

    public ProjectIdea(string title, string author, string description, List<string> fileUrls) : base(Guid.NewGuid().ToString())
    {
        Title = title;
        Author = author;
        Description = description;
        DateCreated = DateTime.UtcNow;
        FileUrls = fileUrls;
    }

    public void Update(string title, string description)
    {
        Title = title;
        Description = description;
    }

    internal static IEnumerable<ProjectIdea> Generate(int qty)
    {
        var faker = new Faker<ProjectIdea>()
            .CustomInstantiator(f => new ProjectIdea(
                f.Lorem.Sentence(3),
                f.Person.FullName,
                f.Lorem.Paragraph(),
                f.Make(3, () => f.Image.PicsumUrl()).ToList() 
            ));

        return faker.Generate(qty);
    }
}
