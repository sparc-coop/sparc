using Bogus;
using System.ComponentModel.DataAnnotations;

namespace Sparc2.Ideas;

public class ProjectIdea(string title, string author, string description, List<string> fileUrls) 
    : BlossomEntity<string>(Guid.NewGuid().ToString())
{
    [Required(ErrorMessage = "Title is required")]
    public string Title { get; set; } = title;

    [Required(ErrorMessage = "Name is required")]
    public string Author { get; set; } = author;
    public string Description { get; set; } = description;
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    public DateTime LastModified { get; set; }
    public List<string> FileUrls { get; set; } = fileUrls;

    public void Update(string title, string author, string description, List<string> fileUrls)
    {
        Title = title;
        Author = author;
        Description = description;
        FileUrls = fileUrls;
        LastModified = DateTime.UtcNow;
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
