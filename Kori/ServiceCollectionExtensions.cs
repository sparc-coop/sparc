using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System.Globalization;

namespace Kori;

public static class ServiceCollectionExtensions
{
    public static WebApplicationBuilder AddKori(this WebApplicationBuilder builder, string channelId)
    {
        builder.Services.AddLocalization();
        Kori.ChannelId = channelId;
        return builder;
    }

    public static IApplicationBuilder UseKori(this IApplicationBuilder app)
    {
        var supportedCultures = CultureInfo.GetCultures(CultureTypes.AllCultures)
            .Select(x => x.Name)
            .ToArray();

        app.UseRequestLocalization(options => options
            .AddSupportedCultures(supportedCultures)
            .AddSupportedUICultures(supportedCultures));

        app.Use<KoriMiddleware>();

        return app;
    }
}
