namespace Sparc2.Files;

public class FileUpload 
{
    public string FileName { get; set; }
    public string Url { get; set; }
    public string FileFormat { get; set; }
    public int FileSize { get; set; }
    public string? BlobName { get; set; }
    public int Progress { get; set; } = 0;

    public FileUpload(string fileName, string url, string fileFormat, int fileSize, string? blobName = null)
    {
        FileName = fileName;
        Url = url;
        FileFormat = fileFormat;
        FileSize = fileSize;
        BlobName = blobName;
    }
}