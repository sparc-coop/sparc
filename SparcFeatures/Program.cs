using Kori;
using Sparc.Coop;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.AddKori("sparc-coop");

var app = builder.Build();

app.UseStaticFiles();
app.UseKori();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
