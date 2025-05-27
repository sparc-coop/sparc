namespace Sparc2.Ideas;

internal class IdeaService
{
    public event Func<Task>? OnIdeasChanged;

    public async Task AddIdea()
    {
        if (OnIdeasChanged is not null)
        {
            await OnIdeasChanged.Invoke();
        }
    }
}

