using Sparc.App;
using Sparc.App.Layout;
using Sparc.Blossom;
using Sparc.Blossom.Data;

var builder = BlossomApplication.CreateBuilder<Html>(args);

builder.AddSparcEngine(builder.Configuration["SparcEngine"]);
builder.Services.AddCosmos<SparcContext>(builder.Configuration);

await builder.Build().RunAsync<Html>();
