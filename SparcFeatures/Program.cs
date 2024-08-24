using Kori;
using Sparc.Blossom;
using Sparc.Blossom.Authentication;
using Sparc.Coop;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.AddBlossom(options =>
{
    options.AddKori(new Uri("https://sparc.coop"));
    options.AddBlossomPasswordlessAuthentication<User>();
});

var app = builder.Build();

app.UseStaticFiles();
app.UseAntiforgery();
app.UseKori();

app.MapRazorComponents<Html>()
    .AddInteractiveServerRenderMode();

app.Run();
