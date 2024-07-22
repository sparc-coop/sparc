using Microsoft.Extensions.DependencyInjection;

namespace Kori;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddKori(this IServiceCollection services)
    {
        var apiBaseUrl = configuration?["IbisApi"] ?? "https://ibis.chat/";

        var client = services.AddHttpClient<KoriClient>(client =>
        {
            client.BaseAddress = new Uri(apiBaseUrl);
            client.DefaultRequestVersion = new Version(2, 0);
        });

        services.AddScoped<IbisTranslator>();
        return services;
    }
}
