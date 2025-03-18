using Sparc.Blossom.Platforms.Server;

var builder = new BlossomServerApplicationBuilder(args);

var app = (BlossomServerApplication)builder.Build();

await app.RunAsync<Sparc2.Html>();
