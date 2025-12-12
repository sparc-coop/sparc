using Sparc.Blossom.Authentication;
using Sparc.Blossom.Content;
using Sparc.Blossom.Spaces;

namespace Sparc.App.Posts;

public class SparcPost(BlossomUser user, string text) 
    : BlossomPost("sparc.coop", "sparc", Language.Find("en")!, text, user)
{
    public SparcPost() : this(new(), "")
    { }
    

    public async Task ExtractGraph(ISparcContent tovik)
    {
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

        Entities = await tovik.ExtractGraphAsync(new(this, entityTypes));
    }
}
