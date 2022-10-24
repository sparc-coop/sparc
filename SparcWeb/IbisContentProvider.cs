using Microsoft.JSInterop;
using System.Globalization;
using System.Text.Json;

namespace SparcWeb;

public record GetAllContentRequest(string RoomSlug, string Language, List<string>? AdditionalMessages = null);
public record GetContentRequest(string RoomSlug, string Tag, string Language);

public record IbisChannel(string Name, string Slug, List<IbisContent> Content);
public record IbisContent(string Tag, string Text, string Language, string? Audio, DateTime Timestamp)
{
    public override string ToString() => Text;
}

public class IbisContentProvider
{
    internal static string Language => CultureInfo.CurrentCulture.TwoLetterISOLanguageName;
    internal List<IbisContent> Content { get; set; }
    public IJSRuntime Js { get; }

    internal HttpClient _httpClient;

    public IbisContentProvider(IConfiguration configuration, IJSRuntime js)
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(configuration["IbisApi"])
        };
        Js = js;
        Content = new();
    }

    public async Task<IbisContent?> GetAsync(string channelId, string tag)
    {
        // some small caching
        if (this[tag] != null)
            return this[tag];

        var request = new GetContentRequest(channelId, tag, Language);
        return await _httpClient.PostAsJsonAsync<GetContentRequest, IbisContent>("/api/GetContent", request);
    }

    public async Task<IbisChannel?> GetAllAsync(string channelId, List<string>? additionalMessages = null)
    {
        var request = new GetAllContentRequest(channelId.ToLower(), Language, additionalMessages);
        var response = await _httpClient.PostAsJsonAsync<GetAllContentRequest, IbisChannel>("/api/GetAllContent", request);

        if (response != null)
        {
            // Cache the results
            foreach (var item in response.Content)
                this[item.Tag] = item;
        }

        return response;
    }

    public async Task TranslatePageAsync(string channelId)
    {
        var nodes = await Js.InvokeAsync<List<string>>("ibis.getTextNodes");
        var nodesToTranslate = nodes.Where(x => !Content.Any(y => (y.Tag == x && y.Language == Language) || y.Text == x)).Distinct().ToList();

        await GetAllAsync(channelId, nodesToTranslate);

        // Replace nodes with their translation
        nodes = nodes.Select(x => this[x]?.Text ?? x).ToList();

        // And ship them back to JS for replacement
        await Js.InvokeVoidAsync("ibis.translateTextNodes", nodes);
    }

    // This + IbisContent.ToString() enables use of @Ibis[tag] in Razor templates
    public IbisContent? this[string tag]
    {
        get { return Content.FirstOrDefault(x => x.Language == Language && x.Tag == tag); }
        set
        {
            if (value != null)
            {
                if (this[tag] != null)
                    Content.Remove(this[tag]!);

                Content.Add(value);
            }
        }
    }
}

public static class HttpClientExtensions
{
    public static async Task<TResponse?> PostAsJsonAsync<TRequest, TResponse>(this HttpClient client, string url, TRequest request)
    {
        try
        {
            var response = await client.PostAsJsonAsync(url, request);
            var result = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<TResponse>(result, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch (Exception e)
        {
            return default;
        }
    }
}