using Microsoft.AspNetCore.Components.Web;
using Sparc.Platforms.Web;
using SparcWeb;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Sparc.Core;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
//builder.RootComponents.Add<App>("#app");
//builder.RootComponents.Add<HeadOutlet>("head::after");
builder.Services//.AddScoped<IbisContentProvider>()
    .AddScoped<EmailService>()
    .AddScoped<RootScope>();
builder.Services.AddApiAuthorization();
builder.Sparcify();

await builder.Build().RunAsync();