using Azure.Storage.Blobs;
using System;

namespace Sparc2.Databases.AzureBlob;

internal class AzureBlob
{
    internal BlobServiceClient Client { get; private set; } = null!;

    public AzureBlob(string connectionString)
    {
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new ArgumentException("Azure Blob Storage connection string is invalid.", nameof(connectionString));
        }

        Client = new BlobServiceClient(connectionString);
    }

    public async Task<string> UploadFileAsync(string containerName, string fileName, Stream fileStream, string contentType, IProgress<int>? progress = null)
    {
        var container = Client.GetBlobContainerClient(containerName);
        await container.CreateIfNotExistsAsync();

        var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
        var blob = container.GetBlobClient(uniqueFileName);

        var blockSize = 81920; // 80 KB
        var totalBytes = fileStream.Length;
        var uploadedBytes = 0L;
        var buffer = new byte[blockSize];

        using var uploadStream = new MemoryStream();
        int read;
        while ((read = await fileStream.ReadAsync(buffer, 0, buffer.Length)) > 0)
        {
            await uploadStream.WriteAsync(buffer, 0, read);
            uploadedBytes += read;

            var percent = (int)(uploadedBytes * 100 / totalBytes);
            progress?.Report(percent);
        }

        uploadStream.Position = 0;

        var blobHttpHeaders = new Azure.Storage.Blobs.Models.BlobHttpHeaders
        {
            ContentType = contentType
        };

        await blob.UploadAsync(uploadStream, blobHttpHeaders);

        return blob.Uri.ToString();
    }
}
