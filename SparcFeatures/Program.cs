using Kori;
using Sparc.Blossom;
using Sparc.Blossom.Authentication.Passwordless;
using Sparc.Coop;

BlossomApplication.Run<Html, User>(args, builder =>
{
    builder.AddKori(new Uri("https://sparc.coop"));
    builder.AddBlossomPasswordlessAuthentication<User>();
}, app =>
{
    app.UseKori();
});

