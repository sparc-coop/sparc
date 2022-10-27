using SparcWeb;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Sparc.Core;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.Services
    .AddScoped<EmailService>()
    .AddScoped<RootScope>()
    .AddScoped<IbisContentProvider>();

await builder.Build().RunAsync();