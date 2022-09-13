using Microsoft.AspNetCore.Authentication.JwtBearer;
using Sparc.Features;

namespace SparcFeatures
{
    public class Startup
    {
        public Startup(IConfiguration configuration) => Configuration = configuration;

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Sparcify<Startup>(Configuration["WebClientUrl"]);
                //.AddCosmos<SparcContext>(Configuration.GetConnectionString("Database"), "sparc")
            //services.AddScoped(typeof(IRepository<>), typeof(CosmosDbRepository<>));
            services.AddSignalR();
            services.AddRazorPages();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Audience = "http://localhost:7044/";
                options.Authority = "http://localhost:7044/identity/";
                options.RequireHttpsMetadata = false;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.Sparcify<Startup>(env);
            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
            });
            app.UseDeveloperExceptionPage();
        }
    }
}
