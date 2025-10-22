using Sparc.App;
using Sparc.App.Layout;
using Sparc.Blossom;
using Sparc.Blossom.Data;
using Sparc.Blossom.Engine;

var builder = BlossomApplication.CreateBuilder<Html>(args);
builder.Services.AddBlossomEngine("https://localhost:7185");
builder.Services.AddCosmos<SparcContext>(builder.Configuration);

await builder.Build().RunAsync<Html>();
