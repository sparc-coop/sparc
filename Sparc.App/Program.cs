using Sparc.App.Layout;
using Sparc.Blossom;
using Sparc.Blossom.Engine;

var builder = BlossomApplication.CreateBuilder<Html>(args);
builder.Services.AddBlossomEngine("https://localhost:7185");

await builder.Build().RunAsync<Html>();
