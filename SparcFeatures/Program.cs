using Sparc.Kori;
using Sparc.Coop;
using Sparc.Blossom;

BlossomApplication.Run<Html>(args, builder =>
{
    builder.AddKori(new Uri("https://sparc.coop"));
},
app =>
{
    app.UseKori();
});
