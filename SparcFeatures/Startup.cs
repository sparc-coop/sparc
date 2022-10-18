using Sparc.Plugins.Database.Cosmos;
using SparcFeatures._Plugins;
using Sparc.Database.Cosmos;
using SparcWeb;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;

namespace SparcFeatures
{
    public class Startup
    {
        public Startup(IConfiguration configuration) => Configuration = configuration;

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Sparcify<Startup>("https://localhost:7138");

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Audience = "http://localhost:7044/";
                    options.Authority = "http://localhost:7044/identity/";
                    options.RequireHttpsMetadata = false;
                });

            services.AddRazorPages();

            services.AddSingleton<HttpClient>(sp =>
            {
                // Get the address that the app is currently running at
                var server = sp.GetRequiredService<IServer>();
                var addressFeature = server.Features.Get<IServerAddressesFeature>();
                string baseAddress = addressFeature.Addresses.First();
                return new HttpClient { BaseAddress = new Uri(baseAddress) };
            });

            services.AddScoped<IbisContentProvider>()
               .AddScoped<RootScope>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseAuthentication();
            app.Sparcify<Startup>(env);
        }
    }
}
