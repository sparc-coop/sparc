using Sparc.Blossom.Payment.Stripe;
using Sparc2;

var builder  = BlossomApplication.CreateBuilder(args);

builder.Services.AddStripePayments(options =>
{
    options.ApiKey = builder.Configuration["Stripe:ApiKey"] ?? "sk_test_123";
});

var app = builder.Build();

await app.RunAsync<Html>(); 
