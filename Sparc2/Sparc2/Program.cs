using Sparc.Blossom.Data;
using Sparc.Engine;
using Sparc2;
using Sparc2.Ideas;
using Sparc2.Products;

var builder = BlossomApplication.CreateBuilder<Html>(args);

builder.Services.AddAzureStorage(builder.Configuration);
builder.Services.AddSparcEngine(new Uri("https://localhost:7185"));

builder.Services.AddSingleton<IdeaService>();

var app = builder.Build();

using var scope = app.Services.CreateScope();
var ideaRepository = scope.ServiceProvider.GetRequiredService<IRepository<ProjectIdea>>();
await ideaRepository.AddAsync(ProjectIdea.Generate(20));

var productRepository = scope.ServiceProvider.GetRequiredService<IRepository<Product>>();
await productRepository.AddAsync(Product.Generate(10));

await app.RunAsync<Html>();