using SparcWeb;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Sparc.Core;
using Sparc.Ibis;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.Services
    .AddScoped<RootScope>()
    .AddIbis();

await builder.Build().RunAsync();