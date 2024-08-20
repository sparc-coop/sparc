using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.JSInterop;
using System.Net.Http.Json;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Net.Http.Headers;

namespace Kori;
public record KoriWord(string Text, long Duration, long Offset);
public record KoriAudioContent(string Url, long Duration, string Voice, ICollection<KoriWord> Subtitles);
public record KoriTextContent(string Id, string Tag, string Language, string Text, KoriAudioContent Audio, List<object>? Nodes, bool Submitted = true);
public class Kori(IJSRuntime js) : IAsyncDisposable
{
    public static Uri BaseUri { get; set; } = new("https://localhost");
    public string RoomSlug { get; set; } = "";
    public string Language { get; set; } = "en";
    public string Mode { get; set; } = "";

    Dictionary<string, KoriTextContent> _content { get; set; } = [];
    private HttpClient Client { get; set; } = new() { BaseAddress = new Uri("https://localhost:7117/") };

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

    public async Task<List<string>> TranslateAsync(List<string> nodes)
    {
        if (nodes.Count == 0)
            return nodes;

        var js = await KoriJs.Value;

        var nodesToTranslate = nodes.Where(x => !_content.ContainsKey(x)).Distinct().ToList();

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

    public async Task EditAsync()
    {        
        var js = await KoriJs.Value;

        var contentType = await js.InvokeAsync<string>("checkSelectedContentType");

        if (contentType == "image")
        {
            Mode = "EditImage";
            await js.InvokeVoidAsync("editImage");            
        }
        else
        {
            Mode = "Edit";
            await js.InvokeVoidAsync("edit");
        }
    }

    public async Task CancelAsync()
    {
        Mode = "";
        var js = await KoriJs.Value;
        await js.InvokeVoidAsync("cancelEdit");
    }

    public async Task BeginSaveAsync()
    {
        var js = await KoriJs.Value;
        //await js.InvokeVoidAsync("save");
        var contentType = await js.InvokeAsync<string>("checkSelectedContentType");

        if (contentType == "image")
        {

            await SaveImageAsync("imageTag");
        }
        else
        {

            await js.InvokeVoidAsync("save");
        }        
    }

    // If the node is text, call this
    public async Task<KoriTextContent> SaveAsync(string key, string text)
    {
        var request = new { RoomSlug, Language, Tag = key, Text = text };
        var result = await PostAsync<KoriTextContent>("publicapi/TypeMessage", request);
        await CancelAsync();
        return result;
    }

    // If the node is IMG, call this
    //public async Task<KoriTextContent> SaveImageAsync(string key, byte[] bytes)
    //{
    //    var request = new { RoomSlug, Language, Tag = key };

    //    // How to upload image to server API????
    //    // One possible hint: https://learn.microsoft.com/en-us/aspnet/core/blazor/file-uploads?view=aspnetcore-8.0#upload-files-to-a-server
    //    var result = await PostAsync<KoriTextContent>("publicapi/UploadImage", request);//, bytes);
    //    await CancelAsync();
    //    return result;
    //}

    //private async Task<string> GetAntiForgeryTokenAsync()
    //{
    //    var response = await Client.GetAsync("antiforgery/token");
    //    response.EnsureSuccessStatusCode();
    //    var token = await response.Content.ReadAsStringAsync();
    //    return token;
    //}

    public async Task SaveImageAsync(string tag)
    {
        var js = await KoriJs.Value;

        var base64File = await js.InvokeAsync<string>("getImageFileAsBase64");

        //var antiForgeryToken = await GetAntiForgeryTokenAsync();

        var content = new MultipartFormDataContent();
        var byteArray = Convert.FromBase64String(base64File);
        var stream = new MemoryStream(byteArray);

        content.Add(new StreamContent(stream), "File", "image.png");
        content.Add(new StringContent(RoomSlug), "RoomSlug");
        content.Add(new StringContent(Language), "Language");
        content.Add(new StringContent(tag), "Tag");
        //content.Headers.ContentType = new MediaTypeHeaderValue("multipart/form-data");
        //content.Headers.Add("X-XSRF-TOKEN", antiForgeryToken);

        Console.WriteLine(content);

        var response = await Client.PostAsync("publicapi/UploadImage", content);
        if (!response.IsSuccessStatusCode)
        {
            var responseContent = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Error: {response.StatusCode}, {responseContent}");
        }

        var result = await response.Content.ReadFromJsonAsync<KoriTextContent>();
    }

    
    //public async Task<KoriTextContent> SaveImageAsync(string key)
    //{
    //    try
    //    {
    //        var js = await KoriJs.Value;
    //        //var token = await js.InvokeAsync<string>("getAntiForgeryToken");
    //        // Capture the selected file in the input file via JS Interop
    //        var file = await js.InvokeAsync<byte[]>("getImageFile");

    //        if (file != null && file.Length > 0)
    //        {
    //            var formData = new MultipartFormDataContent();

    //            var fileContent = new ByteArrayContent(file);
    //            //var fileContent = new StreamContent(new MemoryStream(file));
    //            //fileContent.Headers.ContentType = new MediaTypeHeaderValue("image/png");
    //            fileContent.Headers.ContentType = new MediaTypeHeaderValue("multipart/form-data");
    //            // Add the file as IFormFile
    //            formData.Add(fileContent, "File", "image.png");

    //            // Add the other necessary parameters
    //            formData.Add(new StringContent(RoomSlug), "RoomSlug");
    //            formData.Add(new StringContent(Language), "Language");
    //            formData.Add(new StringContent(key), "Tag");

    //            // Include the antiforgery token in the header
    //            //formData.Headers.Add("RequestVerificationToken", token);

    //            var response = await Client.PostAsync("publicapi/UploadImage", formData);
    //            response.EnsureSuccessStatusCode();

    //            var result = await response.Content.ReadFromJsonAsync<KoriTextContent>();
    //            await CancelAsync();
    //            return result;
    //        }
    //        else
    //        {
    //            throw new Exception("No file selected or file is empty.");
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //        Console.WriteLine($"Error uploading image: {ex.Message}");
    //        return null;
    //    }
    //}

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
                result.Append($"{word[0].ToString().ToUpper()}{word.AsSpan(1)}");
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
        catch (Exception e)
        {
            return default;
        }
    }

    public void OpenTranslationMenu()
    {
        Mode = "Translate";
    }

    public void OpenSearchMenu()
    {
        Mode = "Search";
    }
}
