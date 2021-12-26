using Microsoft.Extensions.DependencyInjection;
using Microsoft.Web.WebView2.Core;
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

namespace BlazorHybridWebGPUTest.WpfClient
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            var serviceCollection = new ServiceCollection();
            serviceCollection.AddBlazorWebView();
            Resources.Add("services", serviceCollection.BuildServiceProvider());

            InitializeComponent();
            //SetWebViewEnviromentAsync().Wait(); // Find better was than to wait.
        }

        private async Task SetWebViewEnviromentAsync()
        {
            var envOptions = new CoreWebView2EnvironmentOptions(additionalBrowserArguments: "--enable-features=unsafe-webgpu"); // Check link regarding spelling
            var env = await CoreWebView2Environment.CreateAsync(options: envOptions);

            // Make shure settings are set: // TODO: Better method than wait.
            // https://stackoverflow.com/questions/58604537/how-to-change-microsoft-edge-webview2-mdns-behavior-by-calling-createwebview2env
            // https://stackoverflow.com/questions/67728100/webview2-additionalbrowserarguments-kiosk-printing
            await BlazorWebView.WebView.EnsureCoreWebView2Async(env);
        }

        private void OnExitClick(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }

        private void OnOpenDeveloperConsole(object sender, RoutedEventArgs e)
        {
            BlazorWebView.WebView.CoreWebView2.OpenDevToolsWindow();
        }

        public void OnShowBrowserVersionString(object sender, RoutedEventArgs e)
        {
            string versionString = BlazorWebView.WebView.CoreWebView2.Environment.BrowserVersionString;


            // To specify minimum version: BlazorWebView.WebView.CoreWebView2.Environment.CompareBrowserVersions

            MessageBox.Show($"Browser Version: {versionString}", "Browser Version Info", MessageBoxButton.OK, MessageBoxImage.Information);
        }

        
    }
}
