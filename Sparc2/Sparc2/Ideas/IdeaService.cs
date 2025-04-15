namespace Sparc2.Ideas;

internal class IdeaService
{
    public event Func<Task>? OnIdeaPosted;
    public string? LastPostedIdeaId { get; private set; }

    public async Task NotifyIdeaPostedAsync(string ideaId)
    {
        LastPostedIdeaId = ideaId;

        if (OnIdeaPosted is not null)
        {
            await OnIdeaPosted.Invoke();
        }

        await Task.Delay(30000);
        LastPostedIdeaId = null;
    }
}

