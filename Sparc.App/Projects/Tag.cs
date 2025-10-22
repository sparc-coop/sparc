namespace Sparc.App.Projects;

public class Tag(string id, string name, string type)
{
    public string Id { get; set; } = id;
    public string Name { get; set; } = name;
    public string Type { get; set; } = type;
}