namespace Sparc2.Files;

public class FileUpload(string fileName, string url, string fileFormat, int fileSize, string? blobName = null)
{
    public string FileName { get; set; } = fileName;
    public string Url { get; set; } = url;
    public string FileFormat { get; set; } = fileFormat;
    public int FileSize { get; set; } = fileSize;
    public string? BlobName { get; set; } = blobName;
    public int Progress { get; set; } = 0;
}