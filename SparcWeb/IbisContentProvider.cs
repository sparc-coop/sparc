using System.Globalization;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace SparcWeb;

public record GetAllSlackMessagesRequest(string RoomId, string? Language, string? ContentType = "Text");
public record GetSlackMessageRequest(string RoomId, string Tag, string? Language, string? ContentType = "Text");
public class IbisContentProvider
{
    internal string? RoomID { get; set; }
    internal string? Language { get; set; }
    internal HttpClient _httpClient;
    internal string? ApiString { get; set; }

    public IbisContentProvider(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        ApiString = "https://localhost:7117";//configuration["IbisApi"];
    }

    public void Init(string roomId)
    {
        Language = (CultureInfo.CurrentCulture.TwoLetterISOLanguageName ?? "en");
        RoomID = roomId;
    }

    public async Task<string> Get(string Tag)
    {
        var request = new GetSlackMessageRequest(RoomID, Tag, Language, "Text");
        var content = Newtonsoft.Json.JsonConvert.SerializeObject(request);
        var stringContent = new StringContent(content, UnicodeEncoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync(ApiString + "/api/GetSlackMessage", stringContent);
        return await response.Content.ReadAsStringAsync();
    }


    public async Task<string> GetAudio(string Tag)
    {
        var request = new GetSlackMessageRequest(RoomID, Tag, Language, "Audio");
        var content = Newtonsoft.Json.JsonConvert.SerializeObject(request);
        var stringContent = new StringContent(content, UnicodeEncoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync(ApiString + "/api/GetSlackMessage", stringContent);
        return await response.Content.ReadAsStringAsync();
    }

    public Task<List<string>> GetAll()
    {
        var request = new GetAllSlackMessagesRequest(RoomID, Language, "Text");
        var content = Newtonsoft.Json.JsonConvert.SerializeObject(request);
        var stringContent = new StringContent(content, UnicodeEncoding.UTF8, "application/json");
        var result = _httpClient.PostAsync(ApiString + "/api/GetAllSlackMessages", stringContent);

        return result.ContinueWith(
            (response) => JsonSerializer.Deserialize<List<string>>(response.Result.Content.ReadAsStream())
        );
    }
}

public class Message
{
    public string RoomId { get; private set; }
    public string? SourceMessageId { get; private set; }
    public string Language { get; private set; }
    public DateTime Timestamp { get; private set; }
    //public UserSummary User { get; private set; }
    public AudioMessage? Audio { get; private set; }
    public string? Text { get; private set; }
    public List<MessageTranslation>? Translations { get; private set; }
    public decimal Charge { get; private set; }
    public string? SiteName { get; set; }
    public string? Tag { get; set; }
}

public class AudioMessage
{
    public string? Url { get; private set; }
    public long Duration { get; private set; }
    public Voice? Voice { get; private set; }
    public List<Word>? Subtitles { get; private set; }
}

public class Voice
{
    public string Locale { get; private set; }
    public string Name { get; private set; }
    public string DisplayName { get; private set; }
    public string LocaleName { get; private set; }
    public string ShortName { get; private set; }
    public string Gender { get; private set; }
    public string VoiceType { get; private set; }
}

public record MessageTranslation(string LanguageId, string MessageId);
public record Word(long Offset, long Duration, string Text);