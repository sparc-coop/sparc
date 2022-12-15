using Sparc.Blossom;
using Sparc.Coop.Community;
using Sparc.Ibis;
using Sparc.Notifications.Twilio;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();


builder.AddBlossom();
builder.Services
    .AddLocalization()
    .AddIbis()
    .AddTwilio(builder.Configuration)
    .AddScoped<RegisterForCommunity>();

var app = builder.Build();

var supportedCultures = CultureInfo.GetCultures(CultureTypes.AllCultures)
    .Select(x => x.Name)
    .ToArray();

app.UseStaticFiles();

app.UseRequestLocalization(options => options
    .AddSupportedCultures(supportedCultures)
    .AddSupportedUICultures(supportedCultures));

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run();
