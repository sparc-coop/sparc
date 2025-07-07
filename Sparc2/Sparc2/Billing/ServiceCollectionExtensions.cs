using Sparc.Blossom.Payment.Stripe;

namespace Sparc.Store.Billing;

public static class ServiceCollectionExtensions
{
    public static WebApplicationBuilder AddSparcStoreBilling(
        this WebApplicationBuilder builder
    )
    {
        var ratesSection = builder.Configuration.GetSection("ExchangeRates");
        var stripeSection = builder.Configuration.GetSection("Stripe");

        builder.Services.AddExchangeRates(opts =>
        {
            ratesSection.Bind(opts);
        });

        builder.Services.AddStripePayments(opts =>
        {
            stripeSection.Bind(opts);
        });


        builder.Services.AddTransient<SparcStoreBillingService>();

        return builder;
    }

    public static WebApplication UseSparcStoreBilling(
        this WebApplication app
    )
    {
        using var scope = app.Services.CreateScope();
        var billingSvc = scope
            .ServiceProvider
            .GetRequiredService<SparcStoreBillingService>();

        billingSvc.Map(app);
        return app;
    }
}


