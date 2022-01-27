using Microsoft.Extensions.DependencyInjection;
using Microsoft.Web.WebView2.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace BlazorHybridWebGPUTest.WpfClient
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            this.Title = BuildTitle(null);
            var timer = new Timer(interval: 1000 /* Milliseconds */);
            timer.AutoReset = true;
            timer.Elapsed += async (obj, e) =>
            {
                double? fps;
                try
                {
                     fps = await SceneViewer.SceneCommunication.RequestFPSAsync();
                }
                // In using WebGPU the renderer object seems to be null till started.
                catch (Exception)
                {
                    fps = null;
                }

                // Only dispatch after retrieving the fps.
                await this.Dispatcher.InvokeAsync(() =>
                {
                    this.Title = BuildTitle(fps);
                });
            };
            timer.Start();
        }

        private string BuildTitle(double? fps) => fps != null ? $"WpfBlazorHybridWebView2Test FPS: {(int)fps}" : "WpfBlazorHybridWebView2Test";

        private void OnExitClick(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }

        private void OnOpenDeveloperConsole(object sender, RoutedEventArgs e)
        {
            SceneViewer.BlazorWebView.WebView.CoreWebView2.OpenDevToolsWindow();
        }

        public void OnShowBrowserVersionString(object sender, RoutedEventArgs e)
        {
            string versionString = SceneViewer.BlazorWebView.WebView.CoreWebView2.Environment.BrowserVersionString;

            // To specify minimum version: BlazorWebView.WebView.CoreWebView2.Environment.CompareBrowserVersions
            MessageBox.Show($"Browser Version: {versionString}", "Browser Version Info", MessageBoxButton.OK, MessageBoxImage.Information);
        }
    }
}
