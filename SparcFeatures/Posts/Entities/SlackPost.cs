namespace SparcFeatures.Posts
{
    public class SlackPost : Root<string>
    {
        public string PostId { get; set; }
        public string? User_name { get; set; }
        public string? Text { get; set; }
        public string? command { get; set; }
        public DateTime? Timestamp { get; private set; }
        public string? SiteName { get; set; }
        public string? PostType { get; set; }
        public string? Title { get; set; }


        public SlackPost()
        {
            Id = Guid.NewGuid().ToString();
            PostId = Id;
            Timestamp = DateTime.Now;
        }
    }
}
