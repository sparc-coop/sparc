using Sparc2;

var builder  = BlossomApplication.CreateBuilder(args);

var app = builder.Build();

await app.RunAsync<Html>(); 
