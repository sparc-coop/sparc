using Sparc.App;
using Sparc.Blossom;

var builder = BlossomApplication.CreateBuilder<Html>(args);

builder.AddSparcEngine(builder.Configuration["SparcEngine"]);

await builder.Build().RunAsync<Html>();
