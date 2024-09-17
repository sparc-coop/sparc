using Kori;
using Microsoft.Extensions.DependencyInjection;
using Sparc.Blossom;
using Sparc.Blossom.Authentication.Passwordless;
using Sparc.Blossom.Data;
using Sparc.Coop;

BlossomApplication.Run<Html, User>(args, builder =>
{
    builder.AddKori(new Uri("https://sparc.coop"));
    builder.Services.AddCosmos<SparcContext>(builder.Configuration["ConnectionStrings:CosmosDb"]!, "kodekit", ServiceLifetime.Scoped);
    builder.AddBlossomPasswordlessAuthentication<User>();
}, app =>
{
    app.UseKori();
});

