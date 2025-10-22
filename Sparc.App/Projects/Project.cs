using Sparc.Blossom;
using System.ComponentModel.DataAnnotations;

namespace Sparc.App.Projects;

public record ProjectCredit(string Name, string Title);

public class Project(string title, string status)
    : BlossomEntity<string>(Guid.NewGuid().ToString())
{
    public string ProjectId { get { return Id; } set { Id = value; } }
    public string Title { get; set; } = title;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    public string? StripeProductId { get; set; }
    public decimal Price { get; set; } = 0M;
    public string Status { get; set; } = status;
    public string Url { get; set; } = "";
    public List<ProjectCredit> Credits { get; set; } = [];
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