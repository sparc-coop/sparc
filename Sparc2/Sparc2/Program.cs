using Azure.Storage.Blobs;
using Sparc2;
using Sparc2.Databases.AzureBlob;

var builder  = BlossomApplication.CreateBuilder(args);

builder.Services.AddSingleton<AzureBlob>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("Storage");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Azure Blob Storage connection string is not configured.");
    }

    return new AzureBlob(configuration);
});

var app = builder.Build();

await app.RunAsync<Html>(); 
