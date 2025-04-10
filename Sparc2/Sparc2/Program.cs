using Sparc2;
using Sparc.Blossom.Data;

var builder  = BlossomApplication.CreateBuilder<Html>(args);

builder.Services.AddPouch();

var app = builder.Build();

await app.RunAsync<Html>(); 
