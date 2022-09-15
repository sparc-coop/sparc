using Sparc.Plugins.Database.Cosmos;
using SparcFeatures._Plugins;
using Sparc.Database.Cosmos;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace SparcFeatures
{
    public class Startup
    {
        public Startup(IConfiguration configuration) => Configuration = configuration;

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddRazorPages();
            services.Sparcify<Startup>("https://localhost:7138")
                .AddCosmos<SparcContext>(Configuration["ConnectionStrings:CosmosDb"], "sparc");
            //services.AddScoped(typeof(IRepository<>), typeof(CosmosDbRepository<>));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Audience = "https://sparc-app.azurewebsites.net/";
                    options.Authority = "https://sparc-app.azurewebsites.net/identity/";
                    options.RequireHttpsMetadata = false;
                });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseAuthentication();
            app.Sparcify<Startup>(env);
        }
    }
}
