using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.JSInterop;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace Kori;
public record KoriWord(string Text, long Duration, long Offset);
public record KoriAudioContent(string Url, long Duration, string Voice, ICollection<KoriWord> Subtitles);
public record KoriTextContent(string Id, string Tag, string Language, string Text, KoriAudioContent Audio, List<object>? Nodes, bool Submitted = true);
public record Language(string Id, string DisplayName, string NativeName, bool IsRightToLeft);
public class Kori(IJSRuntime js) : IAsyncDisposable
{
    public static Uri BaseUri { get; set; } = new("https://localhost");
    public string RoomSlug { get; set; } = "";
    public string Language { get; set; } = "en";
    Dictionary<string, KoriTextContent> _content { get; set; } = [];
    private HttpClient Client { get; set; } = new() { BaseAddress = new Uri("https://ibis-web-kori.azurewebsites.net/") };

    readonly Lazy<Task<IJSObjectReference>> KoriJs = new(() => js.InvokeAsync<IJSObjectReference>("import", "./_content/Kori/KoriWidget.razor.js").AsTask());

    public record IbisContent(string Name, string Slug, string Language, ICollection<KoriTextContent> Content);
    public async Task InitializeAsync(HttpContext context)
    {
        await GetContentAsync(context.Request.Path);
    }
   
    public async Task InitializeAsync(ComponentBase component, string currentUrl, string elementId)
    {
        var path = new Uri(currentUrl).AbsolutePath;
        await GetContentAsync(path);

        var js = await KoriJs.Value;
        await js.InvokeVoidAsync("init", elementId, Language, DotNetObjectReference.Create(component), _content);
    }

    public async Task<List<Language>> GetLanguagesAsync()
    {
        return await Client.GetFromJsonAsync<List<Language>>("publicapi/Languages")
            ?? [];
    }

    public async Task<List<string>> TranslateAsync(List<string> nodes)
    {
        if (nodes.Count == 0)
            return nodes;

        var js = await KoriJs.Value;

        var nodesToTranslate = nodes.Where(x => !_content.ContainsKey(x)).Distinct().ToList();
        if (nodesToTranslate.Count == 0)
            return nodes;

        var request = new { RoomSlug, Language, Messages = nodesToTranslate, AsHtml = false };
        var content = await PostAsync<IbisContent>("publicapi/PostContent", request);
        if (content == null)
            return nodes;

        foreach (var item in content.Content)
            _content[item.Tag] = item with { Nodes = [] };

        // Replace nodes with their translation
        nodes = nodes.Select(x => _content.TryGetValue(x, out KoriTextContent? value) ? value.Text : x).ToList();
        return nodes;
    }

    public async Task PlayAsync(KoriTextContent content)
    {
        if (content?.Audio?.Url == null)
            return;

        var js = await KoriJs.Value;
        await js.InvokeVoidAsync("playAudio", content.Audio.Url);
    }

    public MarkupString Content(string tag, int loremIpsumWordCount = 0)
    {
        if (!_content.TryGetValue(tag, out KoriTextContent? value))
            return new(LoremIpsum(loremIpsumWordCount));

        return new(value.Text);
    }

    public MarkupString this[string tag] => Content(tag);

    public async ValueTask DisposeAsync()
    {
        if (KoriJs.IsValueCreated)
        {
            var module = await KoriJs.Value;
            await module.DisposeAsync();
        }
    }

    static string LoremIpsum(int wordCount)
    {
        var words = new[]{"lorem", "ipsum", "dolor", "sit", "amet", "consectetuer",
        "adipiscing", "elit", "sed", "diam", "nonummy", "nibh", "euismod",
        "tincidunt", "ut", "laoreet", "dolore", "magna", "aliquam", "erat"};

        var rand = new Random();
        StringBuilder result = new();

        for (int i = 0; i < wordCount; i++)
        {
            var word = words[rand.Next(words.Length)];
            var punctuation = i == wordCount - 1 ? "." : rand.Next(8) == 2 ? "," : "";

            if (i > 0)
                result.Append($" {word}{punctuation}");
            else
                result.Append($"{word[0].ToString().ToUpper()}{word.AsSpan(1)}" );
        }

        return result.ToString();
    }

    private async Task GetContentAsync(string path)
    {
        RoomSlug = $"{BaseUri.Host}{path}";

        var request = new
        {
            RoomSlug,
            Language
        };

        var content = await PostAsync<IbisContent>("publicapi/PostContent", request);
        if (content != null)
            _content = content.Content.ToDictionary(x => x.Tag, x => x with { Nodes = [] });
    }

    private static JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };
    async Task<TResponse?> PostAsync<TResponse>(string url, object request)
    {
        try
        {
            var response = await Client.PostAsJsonAsync(url, request);
            var result = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<TResponse>(result, JsonOptions);
        }
        catch (Exception)
        {
            return default;
        }
    }
}
