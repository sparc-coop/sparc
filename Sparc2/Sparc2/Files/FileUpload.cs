using Sparc2.Ideas;

namespace Sparc2.Files;

public class FileUpload : BlossomEntity<string>
{
    public string FileName { get; private set; }
    public string FilePath { get; private set; }
    public DateTime UploadedDate { get; set; }
    public string IdeaId { get; set; } 
    public Idea Idea { get; set; } = null!;

    public FileUpload(string fileName, string filePath, string ideaId) : base(Guid.NewGuid().ToString())
    {
        FileName = fileName;
        FilePath = filePath;
        UploadedDate = DateTime.UtcNow;
        IdeaId = ideaId;
    }
}
