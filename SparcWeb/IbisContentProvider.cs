using System.Globalization;
using System.Text.Json;

namespace SparcWeb;

public record GetAllContentRequest(string RoomSlug, string Language);
public record GetContentRequest(string RoomSlug, string Tag, string Language);
public record IbisContent(string Tag, string Text, string? Audio)
{
    public override string ToString() => Text;
}

public class IbisContentProvider
{
    internal static string Language => CultureInfo.CurrentCulture.TwoLetterISOLanguageName;
    internal List<IbisContent> Content { get; set; }
    internal Dictionary<string, IbisContent> CachedContent { get; private set; }
    
    internal HttpClient _httpClient;
    internal string? ApiString { get; set; }

    public IbisContentProvider(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        ApiString = configuration["IbisApi"];
        CachedContent = new();
    }

    public async Task<IbisContent?> GetAsync(string channelId, string tag)
    {
        // some small caching
        if (CachedContent.ContainsKey(tag))
            return CachedContent[tag];
        
        var request = new GetContentRequest(channelId, tag, Language);
        return await _httpClient.PostAsJsonAsync<GetContentRequest, IbisContent>(ApiString + "/api/GetContent", request);
    }

    public async Task InitAsync(string channelId)
    {
        var request = new GetAllContentRequest(channelId, Language);
        var response = await _httpClient.PostAsJsonAsync<GetAllContentRequest, List<IbisContent>>(ApiString + "/api/GetAllContent", request);

        if (response != null)
        {
            Content = response;
            CachedContent = response.ToDictionary(x => x.Tag, x => x);
        }
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
            return JsonSerializer.Deserialize<TResponse>(response.Content.ReadAsStream());
        }
        catch
        {
            return default;
        }
    }
}