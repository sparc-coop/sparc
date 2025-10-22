using Sparc.Blossom;

namespace Sparc.App.Ideas;

public class Idea(string userId, string text) : BlossomEntity<string>
{
    public DateTime PostDate { get; set; } = DateTime.UtcNow;
    public string UserId { get; set; } = userId;
    public string Text { get; set; } = text;
    public string? Category { get; set; }
    public string? ProjectId { get; set; }
    public string IdeaId { get { return Id; } set { Id = value; } }
}
