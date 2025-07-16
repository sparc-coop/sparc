using Sparc.Blossom.Data;
using Sparc.Engine;
using Sparc2;
using Sparc2.Ideas;
using Sparc2.Products;

var builder = BlossomApplication.CreateBuilder<Html>(args);

builder.Services.AddAzureStorage(builder.Configuration);
builder.Services.AddSparcEngine(builder.Configuration["SparcEngine"]);

builder.Services.AddSingleton<IdeaService>();

var app = builder.Build();

using var scope = app.Services.CreateScope();
var ideaRepository = scope.ServiceProvider.GetRequiredService<IRepository<ProjectIdea>>();
await ideaRepository.AddAsync(ProjectIdea.Generate(20));

var tovik = new Product("Tovik", "Early Access")
{
    Id = "Tovik",
    Credits = [
        new("Christine Antonio", "User Experience Implementation"),
        new("Yoojung Song", "User Experience Design"),
        new("Ana Chavez", "Product Branding"),
        new("Fernando Rodrigues", "Product Engineer"),
        new("Laura Ferraz", " Product Engineer"),
        new("Joseph Young", "Product Architecture"),
        new("Antonio Correia", "Data Architecture")
        ],
    Images = [
        "/images/products/tovik_store-assets-02.jpg",
        "/images/products/tovik_store-assets-01.jpg",
        "/images/products/tovik_store-assets-03.jpg",
        "/images/products/tovik_store-assets-04.jpg"
        ],
    Price = 20,
    StripeProductId = "prod_SW5yY8O8KprzFu",
    Tags = [
        new("early-access", "Early Access", "development"),
        new("translation", "Translation", "category"),
        new("site-plugin", "Site Plugin", "category")
    ],
    Description = "# Your Website, Multilingual in Minutes\r\n" +
    "\r\n" +
    "Meet Tovik: A simple tool that turns your website multilingual without the need for coding or developers.\r\n" +
    "\r\n" +
    "Whether you're a small business owner, startup founder, or part of a growing team, Tovik helps you speak " +
    "your customers’ language with ease. Tovik detects your users’ language preferences and seamlessly translates " +
    "your content, helping you connect with more people around the world. \r\n" +
    "\r\n" +
    "## Here’s how it works:\r\n" +
    "\r\n" +
    "1. Install Tovik once (takes just a few minutes).\r\n" +
    "2. Let Tovik do the work. Your site’s text is translated instantly and accurately—-without breaking " +
    "your design or workflow.\r\n" +
    "\r\n" +
    "## Why Choose Tovik?\r\n" +
    "- Works with your existing site\r\n" +
    "- One-time fee, no hidden costs\r\n" +
    "- Supports 130 languages\r\n" +
    "- Easy to update and manage\r\n" +
    "- Built for real people, not just tech pros\r\n" +
    "\r\n" +
    "## Who it’s for:\r\n" +
    "- Small businesses looking to grow their reach\r\n" +
    "- Founders building fast without extra hands\r\n" +
    "- Nonprofits trying to serve more communities\r\n" +
    "- Anyone who wants to make their website work for more people, in more places\r\n"
};

var productRepository = scope.ServiceProvider.GetRequiredService<IRepository<Product>>();
await productRepository.AddAsync(tovik);

await app.RunAsync<Html>();