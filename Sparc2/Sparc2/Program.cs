using Sparc2;
using Sparc2.Databases.AzureBlob;
using Sparc2.Ideas;

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

var app = builder.Build();

await app.RunAsync<Html>(); 
