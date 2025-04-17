using Bogus;
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
    public DateTime LastModified { get; set; }
    public List<string> FileUrls { get; set; } = new();

    public ProjectIdea(string title, string author, string description, List<string> fileUrls) : base(Guid.NewGuid().ToString())
    {
        Title = title;
        Author = author;
        Description = description;        
        FileUrls = fileUrls;
        DateCreated = DateTime.UtcNow;
    }

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
