namespace SparcFeatures.Posts
{
    public class Post
    {
        public string? Id { get; set; }
        public string? Text { get; set; }
        public DateTime? Timestamp { get; private set; }
    }
}
