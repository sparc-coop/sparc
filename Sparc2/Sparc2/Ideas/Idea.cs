using Sparc2.Files;

namespace Sparc2.Ideas;

public class Idea : BlossomEntity<string>
{
    public string Title { get; set; }
    public string Author { get; set; }
    public string Description { get; set; }
    public DateTime DateCreated { get; set; }
    public List<FileUpload> Files { get; set; }

    public Idea(string title, string author, string description) : base(Guid.NewGuid().ToString())
    {
        Title = title;
        Author = author;
        Description = description;
        DateCreated = DateTime.UtcNow;
    }
}
