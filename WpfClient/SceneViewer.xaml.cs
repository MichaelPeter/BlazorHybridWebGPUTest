using Microsoft.AspNetCore.Components.WebView.Wpf;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using BlazorHybridWebGPUTest.Controls;
using BlazorHybridWebGPUTest.Controls.Services;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace BlazorHybridWebGPUTest.WpfClient
{
    /// <summary>
    /// Interaction logic for SceneViewer.xaml
    /// </summary>
    public partial class SceneViewer : UserControl
    {
        public SceneViewer()
        {
            SceneCommunication = new SceneViewerCommunicationService();

            var serviceCollection = new ServiceCollection();
            serviceCollection.AddBlazorWebView();
            serviceCollection.UseSceneViewer(SceneCommunication);

            //// For debugging rendering
            //serviceCollection.AddLogging((logBuilder) =>
            //{
            //    logBuilder.AddDebug();
            //    logBuilder.SetMinimumLevel(LogLevel.Debug);
            //});

            Resources.Add("services", serviceCollection.BuildServiceProvider());

            InitializeComponent();
            SetCustomWebView();
            //CustomWebView2.RegisterAfterCoreWebLoadedEvent(OnAfterCustomWebView2Initalized);
        }

        public ISceneViewerCommunicationService SceneCommunication { get; private set; }

        public BlazorWebView BlazorWebView => this.BlazorWebViewInternal;

        //private void OnAfterCustomWebView2Initalized()
        //{
        //    Dirty hack
        //     Only set host page after beeing loaded, otherwise the setting of host page causes,
        //     the navigation to start which prevents passing a custom Enviroment variables.
        //    BlazorWebView.HostPage = "wwwroot/index.html";
        //}

        private void SetCustomWebView()
        {
            var template = new FrameworkElementFactory(typeof(CustomWebView2), "WebView");
            BlazorWebView.Template = new ControlTemplate()
            {
                // The BlazorWebView defines a control named WebView
                // Could not be done in xaml since control is just a FrameworkElement and not a control, see xaml for warning
                VisualTree = template
            };
        }
    }
}
