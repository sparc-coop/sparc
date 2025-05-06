using Sparc.Blossom;
using Sparc2;
using Sparc2.Databases.AzureBlob;
using Sparc2.Ideas;
using Sparc2.Services;

var builder  = BlossomApplication.CreateBuilder(args);

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
builder.Services.AddSingleton<IdeaService>();

builder.Services.AddSlackIntegration(builder.Configuration);

var app = builder.Build();

using var scope = app.Services.CreateScope();
var ideaRepository = scope.ServiceProvider.GetRequiredService<IRepository<ProjectIdea>>();
await ideaRepository.AddAsync(ProjectIdea.Generate(20));

await app.RunAsync<Html>(); 
