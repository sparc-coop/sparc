using Sparc.Blossom.Payment.Stripe;
using Sparc2;

var builder  = BlossomApplication.CreateBuilder(args);

builder.Services.AddStripePayments(options =>
{
    options.ApiKey = builder.Configuration["Stripe:ApiKey"] ?? "sk_test_123";
});
builder.Services.AddExchangeRates(opt =>
{
    opt.ApiKey = builder.Configuration["ExchangeRates:ApiKey"]!;
});

var app = builder.Build();

await app.RunAsync<Html>(); 
