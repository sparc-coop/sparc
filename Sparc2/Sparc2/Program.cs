using Sparc2;
using Sparc.Blossom.Data;
using Sparc.Blossom;
using Sparc2.Databases.AzureBlob;
using Sparc2.Ideas;

var builder  = BlossomApplication.CreateBuilder<Html>(args);

builder.Services.AddPouch();

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

var app = builder.Build();

//using var scope = app.Services.CreateScope();
//var ideaRepository = scope.ServiceProvider.GetRequiredService<IRepository<ProjectIdea>>();
//await ideaRepository.AddAsync(ProjectIdea.Generate(20));

await app.RunAsync<Html>(); 
