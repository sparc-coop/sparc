using Sparc.Kori;
using Sparc.Coop;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.AddKori(new Uri("https://sparc.coop"));

var app = builder.Build();

app.UseStaticFiles();
app.UseAntiforgery();
app.UseKori();

app.MapRazorComponents<Html>()
    .AddInteractiveServerRenderMode();

app.Run();
