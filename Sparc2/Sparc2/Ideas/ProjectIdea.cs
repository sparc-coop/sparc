using Sparc2.Files;

namespace Sparc2.Ideas;

public class ProjectIdea : BlossomEntity<string>
{
    public string Title { get; set; }
    public string Author { get; set; }
    public string Description { get; set; }
    public DateTime DateCreated { get; set; }
    public List<string> FileUrls { get; set; } = new();

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
}
