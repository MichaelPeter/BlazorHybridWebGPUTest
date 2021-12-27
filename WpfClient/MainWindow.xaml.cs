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
            SetCustomWebView();
            //CustomWebView2.RegisterAfterCoreWebLoadedEvent(OnAfterCustomWebView2Initalized);
        }

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
