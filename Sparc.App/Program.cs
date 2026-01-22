using Sparc.App;
using Sparc.App.Layout;
using Sparc.Blossom;
using Sparc.Blossom.Data;

var builder = BlossomApplication.CreateBuilder<Html>(args);
builder.AddBlossomEngine("https://sparcengine-spaces-e8aba2etcmchcsce.centralus-01.azurewebsites.net/");
builder.Services.AddCosmos<SparcContext>(builder.Configuration);

await builder.Build().RunAsync<Html>();
