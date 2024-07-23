﻿using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.JSInterop;
using System.Net.Http.Json;
using System.Text;

namespace Kori;
public record KoriWord(string Text, long Duration, long Offset);
public record KoriAudioContent(string Url, long Duration, string Voice, ICollection<KoriWord> Subtitles);
public record KoriContent(string Id, string Tag, string Language, string Text, KoriAudioContent Audio, List<object>? Nodes, bool Submitted = true);
public class Kori(IJSRuntime js) : IAsyncDisposable
{
    public static string ChannelId { get; set; } = "";
    public string Language { get; set; } = "";
    Dictionary<string, KoriContent> _content { get; set; } = [];
    private HttpClient Client { get; set; } = new() { BaseAddress = new Uri("https://ibis.chat") };

    readonly Lazy<Task<IJSObjectReference>> KoriJs = new(() => js.InvokeAsync<IJSObjectReference>("import", "./_content/Kori/Kori.razor.js").AsTask());

    public record IbisContent(string Name, string Slug, string Language, ICollection<KoriContent> Content);
    public async Task InitializeAsync(HttpContext context)
    {
        var request = new
        {
            RoomSlug = ChannelId,
            Language
        };

        var response = await Client.PostAsJsonAsync("publicapi/GetAllContent", request);
        var content = await response.Content.ReadFromJsonAsync<IbisContent>();
        _content = content!.Content.ToDictionary(x => x.Tag, x => x with { Nodes = [] });
    }

    public async Task InitializeAsync(ComponentBase component, string elementId)
    {
        var js = await KoriJs.Value;
        await js.InvokeVoidAsync("init", elementId, Language, DotNetObjectReference.Create(component), _content);
    }

    public async Task<List<string>> TranslateAsync(List<string> nodes)
    {
        if (nodes.Count == 0)
            return nodes;

        var js = await KoriJs.Value;

        var nodesToTranslate = nodes.Where(x => !_content.ContainsKey(x)).Distinct().ToList();
        var request = new { RoomSlug = ChannelId, Language, Messages = nodesToTranslate, AsHtml = false };
        var response = await Client.PostAsJsonAsync("publicapi/PostContent", request);
        var content = await response.Content.ReadFromJsonAsync<IbisContent>();
        foreach (var item in content!.Content)
            _content[item.Tag] = item with { Nodes = [] };

        // Replace nodes with their translation
        nodes = nodes.Select(x => _content.TryGetValue(x, out KoriContent? value) ? value.Text : x).ToList();
        return nodes;
    }

    public async Task PlayAsync(KoriContent content)
    {
        if (content?.Audio?.Url == null)
            return;

        var js = await KoriJs.Value;
        await js.InvokeVoidAsync("playAudio", content.Audio.Url);
    }

    public MarkupString Content(string tag, int loremIpsumWordCount = 0)
    {
        if (!_content.TryGetValue(tag, out KoriContent? value))
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

}
