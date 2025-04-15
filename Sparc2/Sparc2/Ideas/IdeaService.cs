namespace Sparc2.Ideas;

internal class IdeaService
{
    public List<ProjectIdea> Ideas { get; private set; } = new();

    public event Action? OnIdeasChanged;

    public void AddIdea(ProjectIdea idea)
    {
        Ideas.Insert(0, idea);
        OnIdeasChanged?.Invoke();
    }
}

