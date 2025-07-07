using Sparc.Store;
using Sparc.Blossom.Data;
using Sparc.Engine;
using Sparc.Store.Ideas;
using Sparc.Store.Products;

var builder = BlossomApplication.CreateBuilder<Html>(args);

builder.Services.AddAzureStorage(builder.Configuration);
builder.Services.AddSparcEngine();

builder.Services.AddSingleton<IdeaService>();

var app = builder.Build();

using var scope = app.Services.CreateScope();
var ideaRepository = scope.ServiceProvider.GetRequiredService<IRepository<ProjectIdea>>();
await ideaRepository.AddAsync(ProjectIdea.Generate(20));

var productRepository = scope.ServiceProvider.GetRequiredService<IRepository<Product>>();
await productRepository.AddAsync(Product.Generate(10));

await app.RunAsync<Html>(); 