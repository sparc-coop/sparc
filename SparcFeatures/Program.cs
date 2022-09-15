using SparcFeatures;
using SparcFeatures._Plugins.Slack;
using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);
var startup = new Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

builder.Services.AddRazorPages();
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddEndpointsApiExplorer();

//builder.Services.AddHttpClient<GetSlack>(client =>
//    client.BaseAddress = new Uri("http://localhost:7044"));
//builder.Services.AddRazorPages();

var app = builder.Build();

startup.Configure(app, app.Environment);

app.UseStaticFiles();


app.MapRazorPages();
app.MapControllers();
app.MapFallbackToFile("index.html");

//app.UseHttpsRedirection();

app.Run();
