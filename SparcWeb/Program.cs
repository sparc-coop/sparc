using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Sparc.Platforms.Web;
using SparcFeatures;
using SparcWeb;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
//builder.RootComponents.Add<App>("#app");
//builder.RootComponents.Add<HeadOutlet>("head::after");
//builder.Services.AddScoped<IConfiguration>(_ => builder.Configuration);
//builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("https://localhost:7044") });//builder.HostEnvironment.BaseAddress) });
//builder.AddB2CApi<SparcApi>("https://sparcapp.onmicrosoft.com/10a2c1ad-f17d-4cb3-ae01-61ef3188caa5/SparcFeatures",
//"https://localhost:7044");//builder.Configuration["ApiUrl"]);
//builder.AddPublicApi<SparcApi>("https://localhost:7044");
builder.Services.AddApiAuthorization();
builder.AddPublicApi<SparcApi>("http://localhost:7044");
builder.Sparcify();


await builder.Build().RunAsync();