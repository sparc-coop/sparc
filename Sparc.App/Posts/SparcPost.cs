using Sparc.App.Communities;
using Sparc.Blossom;
using Sparc.Blossom.Authentication;
using Sparc.Blossom.Content;
using Sparc.Blossom.Content.Tovik;

namespace Sparc.App.Posts;

public record GraphExtractionResult(List<SparcEntityBase> Entities, List<SparcRelationship> Relationships);
public class SparcPost(string userId, string text) : BlossomEntity<string>
{
    public SparcPost() : this("", "")
    { }
    
    public SparcPost(BlossomAvatar avatar, string text) : this(avatar.Id, text)
    {
        Id = Guid.NewGuid().ToString();
        LanguageId = avatar.Language?.LanguageId ?? "en";
    }

    public string UserId { get; set; } = userId;
    public string Domain { get; set; } = "sparc";
    public string Text { get; set; } = text;
    public DateTime PostDate { get; set; } = DateTime.UtcNow;
    public string LanguageId { get; set; } = "en";
    public string PostId { get { return Id; } set { Id = value; } }
    public string? SpaceId { get; set; }
    public List<SparcEntity> Entities { get; set; } = [];

    public async Task ExtractGraph(ITovik tovik)
    {
        var content = new TextContent("sparc", "Ideas", Language.Find(LanguageId)!, Text);
        List<SparcEntityType> entityTypes = [
            new("Person", "A single human individual identified by their name"),
            new("Group", "An organization or collection of individuals identified by their name"),
            new("Topic", "Subject or theme that the idea relates to"),
            new("Hypothesis", "Explicitly stated proposition under test"),
            new("Method", "Scientific method variant, algorithm, or protocol"),
            new("Metric", "Success measure or evaluation standard"),
            new("Experiment", "Structured attempt to test a hypothesis"),
            new("Dataset", "Data used in reasoning or testing"),
            new("Result", "Outcome of an experiment or analysis"),
            new("Decision", "Group agreement, vote, or conclusion"),
            new("Location", "Physical or digital setting"),
            new("Constraint", "Funding, tools, or other limitations")
        ];

        var options = new TovikTranslationOptions
        {
            Instructions = SparcPrompts.GraphExtraction(entityTypes)
        };

        //if (existingCategories.Count > 0)
        //    options.AdditionalContext = "Existing categories: " + string.Join(", ", existingCategories);

        var graph = await tovik.TranslateAsync<GraphExtractionResult>(content, options);
        if (graph?.Entities == null)
            return;

        foreach (var entity in graph.Entities)
            Entities.Add(new(entity, graph.Relationships));
    }
}
