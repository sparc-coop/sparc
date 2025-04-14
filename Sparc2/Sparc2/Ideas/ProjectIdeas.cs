namespace Sparc2.Ideas;

public class ProjectIdeas(BlossomAggregateOptions<ProjectIdea> options) : BlossomAggregate<ProjectIdea>(options)
{
    public BlossomQuery<ProjectIdea> GetAllIdeas()
        => Query();

    public BlossomQuery<ProjectIdea> GetIdeaByTitle(string title)
        => Query().Where(x => x.Title.Contains(title));

    public BlossomQuery<ProjectIdea> GetIdeasByAuthor(string author)
        => Query().Where(x => x.Author == author);
}
