using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Hosting.Server;
using Sparc.Ibis;
using Sparc.Kernel;
using Sparc.Notifications.Twilio;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

//builder.Services.AddTwilio(Configuration);

builder.Services.AddSingleton(sp =>
{
    // Get the address that the app is currently running at
    var server = sp.GetRequiredService<IServer>();
    var addressFeature = server.Features.Get<IServerAddressesFeature>();
    var baseAddress = addressFeature!.Addresses.First();
    return new HttpClient { BaseAddress = new Uri(baseAddress) };
});

builder.AddSparcKernel();
builder.Services
    .AddIbis()
    .AddTwilio(builder.Configuration);

var app = builder.Build();

app.UseBlazorFrameworkFiles();
app.UseStaticFiles();
app.MapRazorPages();
app.MapControllers();
app.MapFallbackToPage("/_Host");

app.Run();
