using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System.Globalization;

namespace Kori;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddKori(this IServiceCollection services)
    {
        //var apiBaseUrl = configuration?["IbisApi"] ?? "https://ibis.chat/";

        //var client = services.AddHttpClient<KoriClient>(client =>
        //{
        //    client.BaseAddress = new Uri(apiBaseUrl);
        //    client.DefaultRequestVersion = new Version(2, 0);
        //});

        //services.AddScoped<IbisTranslator>();
        return services;
    }

    public static IApplicationBuilder UseKori(this IApplicationBuilder app)
    {
        var supportedCultures = CultureInfo.GetCultures(CultureTypes.AllCultures)
            .Select(x => x.Name)
            .ToArray();

        app.UseRequestLocalization(options => options
            .AddSupportedCultures(supportedCultures)
            .AddSupportedUICultures(supportedCultures));

        return app;
    }
}
