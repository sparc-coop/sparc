using Sparc2.Ideas;

namespace Sparc2.Files;

public class FileUpload 
{
    public string FileName { get; set; }
    public string Url { get; set; }
    public string FileFormat { get; set; }
    public int FileSize { get; set; }

    public FileUpload(string fileName, string url, string fileFormat, int fileSize)
    {
        FileName = fileName;
        Url = url;
        FileFormat = fileFormat;
        FileSize = fileSize;
    }
}