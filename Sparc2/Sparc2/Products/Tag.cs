namespace Sparc2.Products;

public class Tag
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }

    public Tag (string id, string name, string type)
    {
        Id = id;
        Name = name;
        Type = type;
    }
}