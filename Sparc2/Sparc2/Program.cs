using Refit;
using Sparc.Blossom;
using Sparc2;
using Sparc2.Databases.AzureBlob;
using Sparc2.Ideas;
using Sparc2.Services;
using System.Net;

var builder  = BlossomApplication.CreateBuilder<Html>(args);

builder.Services.AddSingleton<AzureBlob>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("Storage");

    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Azure Blob Storage connection string is not configured.");
    }

    return new AzureBlob(connectionString);
});

builder.Services.AddHttpClient("AuthService", client =>
{
    client.BaseAddress = new Uri("https://localhost:7185/");
}).ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
{
    UseCookies = true,
    CookieContainer = new CookieContainer()
});

builder.Services.AddScoped(sp =>
    sp.GetRequiredService<IHttpClientFactory>().CreateClient("AuthService")
);

builder.Services.AddRefitClient<IBlossomCloud>()
            .ConfigureHttpClient(x => x.BaseAddress = new Uri("https://localhost:7185"))
            .AddStandardResilienceHandler();

builder.Services.AddSingleton<IdeaService>();

builder.Services.AddSlackIntegration(builder.Configuration);

var app = builder.Build();

using var scope = app.Services.CreateScope();
var ideaRepository = scope.ServiceProvider.GetRequiredService<IRepository<ProjectIdea>>();
await ideaRepository.AddAsync(ProjectIdea.Generate(20));

await app.RunAsync<Html>(); 
