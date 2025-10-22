using Sparc.Blossom;
using Sparc.Blossom.Authentication;
using Sparc.Blossom.Content;
using Sparc.Blossom.Content.Tovik;
using Sparc.Core;

namespace Sparc.App.Ideas;

public class IdeaBase(string userId, string text) : BlossomEntity<string>(BlossomHash.MD5($"{userId}:{text}"))
{
    public string Text { get; set; } = text;
    public string? Category { get; set; }
}

public class Idea(string userId, string text) : IdeaBase(userId, text)
{
    public Idea() : this("", "")
    { }
    
    public Idea(BlossomAvatar avatar, string text) : this(avatar.Id, text)
    {
        LanguageId = avatar.Language?.LanguageId ?? "en";
    }
    
    public DateTime PostDate { get; set; } = DateTime.UtcNow;
    public string UserId { get; set; } = userId;
    public string LanguageId { get; set; } = "en";
    public string? ProjectId { get; set; }
    public bool? IsValid { get; set; }
    public string IdeaId { get { return Id; } set { Id = value; } }

    public async Task<bool> Validate(ITovik tovik, List<string> existingCategories)
    {
        var content = new TextContent("sparc", "Ideas", Language.Find(LanguageId)!, Text);
        var options = new TovikTranslationOptions
        {
            Instructions = "Validate that the following text is an appropriate idea submission. If the idea is appropriate, assign it to a category, preferring existing categories provided in the context, or if none fit this idea, a new category. Otherwise, return null.",
        };

        if (existingCategories.Count > 0)
            options.AdditionalContext = "Existing categories: " + string.Join(", ", existingCategories);

        var idea = await tovik.TranslateAsync<Idea, IdeaBase>(content, options);
        if (idea?.Category != null)
        {
            Category = idea.Category;
            IsValid = true;
        }
        else
        {
            IsValid = false;
        }

        return IsValid.Value;
    }
}
