using Microsoft.Web.WebView2.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazorHybridWebGPUTest.WpfClient
{
    public class CustomWebView2 : Microsoft.Web.WebView2.Wpf.WebView2
    {
        public CustomWebView2()
            : base()
        {
            //this.NavigationStarting += CustomWebView2_NavigationStarting;
            //this.Initialized += InitializedAsync;
            //this.Loaded += OnLoaded;

            _environmentSetting = CoreWebView2Environment.CreateAsync(null, null, new CoreWebView2EnvironmentOptions
            {
                AdditionalBrowserArguments = "--enable-features=enable-unsafe-webgpu",
            }).Result;
        }

        private CoreWebView2Environment _environmentSetting;

        //// async void for event handler
        //// Article async event handlers: https://olegkarasik.wordpress.com/2019/04/16/code-tip-how-to-work-with-asynchronous-event-handlers-in-c/
        //// Offical sample says in Initlaized but that is bullshit results in excetipn: https://github.com/MicrosoftDocs/edge-developer/blob/main/microsoft-edge/webview2/get-started/wpf.md
        //private async void OnLoaded(object sender, System.Windows.RoutedEventArgs e)
        //{
        //    // See how this done https://github.com/MicrosoftEdge/WebView2Feedback/issues/1782
        //    // See also https://github.com/MicrosoftEdge/WebView2Feedback/issues/1778
        //    //await this.EnsureCoreWebView2Async(_environmentSetting);
        //    //ExecuteAfterCoreWebLoadedEvent();
        //}

        //// This is a dirty hack;
        //private static readonly List<Action> AfterCoreWebLoaded = new List<Action>();
        //private static bool AfterCoreWebLoadedExecuted = false;

        //public static void RegisterAfterCoreWebLoadedEvent(Action action)
        //{
        //    if (AfterCoreWebLoadedExecuted)
        //        throw new Exception("AfterCoreWebLoadedEvent is already in the past, no more registations possible.");

        //    AfterCoreWebLoaded.Add(action);
        //}

        //public static void ExecuteAfterCoreWebLoadedEvent()
        //{
        //    AfterCoreWebLoaded.ForEach(a => a());
        //    AfterCoreWebLoadedExecuted = true;
        //}
    }
}

// Unsed 1:

//// See Rick stahls blog: https://weblog.west-wind.com/posts/2021/Jan/14/Taking-the-new-Chromium-WebView2-Control-for-a-Spin-in-NET-Part-1
//public async void ApplyEnvironment(Task task)
//{
//    await task;
//    //Console.Write("bla");
//}

//private async void InitializedAsync(object? sender, EventArgs e)
//{
//    if (!_setEnviroment)
//    {
//        // Do not wait for completion
//        //await this.EnsureCoreWebView2Async(_enviroment);
//        this.EnsureCoreWebView2Async(_enviroment).Wait();
//        _setEnviroment = true;
//    }
//}

//private bool _setEnviroment = false;
