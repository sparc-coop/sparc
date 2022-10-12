using Microsoft.JSInterop;
using System.Globalization;
using System.Text.Json;

namespace SparcWeb;

public record GetAllContentRequest(string RoomSlug, string Language, List<string>? AdditionalMessages = null);
public record GetContentRequest(string RoomSlug, string Tag, string Language);

public record IbisChannel(string Name, string Slug, string Language, List<IbisContent> Content);
public record IbisContent(string Tag, string Text, string? Audio, DateTime Timestamp)
{
    public override string ToString() => Text;
}

public class IbisContentProvider
{
    internal static string Language => CultureInfo.CurrentCulture.TwoLetterISOLanguageName;
    internal List<IbisContent> Content { get; set; }
    internal Dictionary<string, IbisContent> CachedContent { get; private set; }
    public IJSRuntime Js { get; }

    internal HttpClient _httpClient;

    public IbisContentProvider(IConfiguration configuration, IJSRuntime js)
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(configuration["IbisApi"])
        };
        CachedContent = new();
        Js = js;
    }

    public async Task<IbisContent?> GetAsync(string channelId, string tag)
    {
        // some small caching
        if (CachedContent.ContainsKey(tag))
            return CachedContent[tag];
        
        var request = new GetContentRequest(channelId, tag, Language);
        return await _httpClient.PostAsJsonAsync<GetContentRequest, IbisContent>("/api/GetContent", request);
    }

    public async Task<IbisChannel?> GetAllAsync(string channelId)
    {
        var request = new GetAllContentRequest(channelId, Language);
        var response = await _httpClient.PostAsJsonAsync<GetAllContentRequest, IbisChannel>("/api/GetAllContent", request);

        if (response != null)
        {
            Content = response.Content;
            CachedContent = response.Content.ToDictionary(x => x.Tag, x => x);
        }

        return response;
    }

    public async Task TranslatePageAsync()
    {
        var nodes = await Js.InvokeAsync<List<string>>("ibis.getTextNodes");
    }

    // This + IbisContent.ToString() enables use of @Ibis[tag] in Razor templates
    public IbisContent? this[string tag] => CachedContent.ContainsKey(tag) ? CachedContent[tag] : null;
}

public static class HttpClientExtensions
{
    public static async Task<TResponse?> PostAsJsonAsync<TRequest, TResponse>(this HttpClient client, string url, TRequest request)
    {
        try
        {
            var response = await client.PostAsJsonAsync(url, request);
            var result = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<TResponse>(result, new JsonSerializerOptions {  PropertyNameCaseInsensitive = true });
        }
        catch (Exception e)
        {
            return default;
        }
    }
}