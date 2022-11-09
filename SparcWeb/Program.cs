using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Sparc.Ibis;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.Services.AddIbis();

await builder.Build().RunAsync();