using Sparc.Kori;
using Sparc.Coop;
using Sparc.Blossom;
using Sparc.Blossom.Authentication.Passwordless;
using Sparc.Blossom.Authentication;

BlossomApplication.Run<Html>(args, builder =>
{
    builder.AddKori(new Uri("https://sparc.coop"));
    builder.AddBlossomPasswordlessAuthentication<BlossomUser>();
},
app =>
{
    app.UseKori();
});
