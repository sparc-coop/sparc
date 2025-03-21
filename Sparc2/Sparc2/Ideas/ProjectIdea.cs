using Sparc2.Files;

namespace Sparc2.Ideas;

public class ProjectIdea : BlossomEntity<string>
{
    public string Title { get; set; }
    public string Author { get; set; }
    public string Description { get; set; }
    public DateTime DateCreated { get; set; }
    public List<FileUpload> Files { get; set; }

    public ProjectIdea(string title, string author, string description) : base(Guid.NewGuid().ToString())
    {
        Title = title;
        Author = author;
        Description = description;
        DateCreated = DateTime.UtcNow;
        Files = new List<FileUpload>();
    }

    public void Update(string title, string description)
    {
        Title = title;
        Description = description;
    }

    public void AddFile(FileUpload file)
    {
        Files.Add(file);
    }
}
