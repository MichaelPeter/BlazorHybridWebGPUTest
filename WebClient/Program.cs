using BlazorHybridWebGPUTest.WebClient;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using BlazorHybridWebGPUTest.Controls;
using BlazorHybridWebGPUTest.Controls.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.UseSceneViewer(new SceneViewerCommunicationService());

await builder.Build().RunAsync();
