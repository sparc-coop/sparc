using Sparc2;
using Sparc2.Ideas;
using Sparc.Blossom.Data;

var builder  = BlossomApplication.CreateBuilder<Html>(args);
builder.Services.AddAzureStorage(builder.Configuration);

builder.Services.AddSingleton<IdeaService>();

var app = builder.Build();

using var scope = app.Services.CreateScope();
var ideaRepository = scope.ServiceProvider.GetRequiredService<IRepository<ProjectIdea>>();
await ideaRepository.AddAsync(ProjectIdea.Generate(20));

await app.RunAsync<Html>(); 
