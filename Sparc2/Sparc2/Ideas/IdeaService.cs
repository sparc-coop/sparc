namespace Sparc2.Ideas;

internal class IdeaService
{
    public event Func<Task>? OnIdeaPosted;

    public async Task NotifyIdeaPostedAsync()
    {
        if (OnIdeaPosted is not null)
        {
            await OnIdeaPosted.Invoke();
        }
    }
}

