using Azure.Storage.Blobs;

namespace Sparc2.Databases.AzureBlob;

public class AzureBlob
{
    internal BlobServiceClient Client { get; private set; } = null!;
    internal BlobContainerClient Container { get; private set; } = null!;

    public AzureBlob(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Storage");
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("Azure Blob Storage connection string is not configured.");
        }

        Client = new BlobServiceClient(connectionString);
    }

    public async Task<string> UploadFileAsync(string containerName, string fileName, Stream fileStream, string contentType)
    {
        Container = Client.GetBlobContainerClient(containerName);
        await Container.CreateIfNotExistsAsync();

        var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";

        var blob = Container.GetBlobClient(uniqueFileName);

        var blobHttpHeaders = new Azure.Storage.Blobs.Models.BlobHttpHeaders
        {
            ContentType = contentType
        };

        await blob.UploadAsync(fileStream, blobHttpHeaders);

        return blob.Uri.ToString();
    }
}
