using BlazorHybridWebGPUTest.Controls;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazorHybridWebGPUTest.WpfClient
{
    public class WebViewJSUnsafeRuntime : IJSUnsafeRuntime
    {
        public WebViewJSUnsafeRuntime(IJSRuntime jsRuntime)
        {
            _jsRuntime = (JSRuntime)jsRuntime;
        }

        private JSRuntime _jsRuntime;

        // Source IPC Sender: https://github.com/dotnet/aspnetcore/blob/c85baf8db0c72ae8e68643029d514b2e737c9fae/src/Components/WebView/WebView/src/IpcSender.cs
        // JSRuntime class: https://github.com/dotnet/aspnetcore/blob/fa368788c24e755c192a84810e4be866956023ee/src/JSInterop/Microsoft.JSInterop/src/JSRuntime.cs
        // WebViewJSRuntime: https://github.com/dotnet/aspnetcore/blob/0de9d304f3c1abc1723a81f7de6b8dd109ecb835/src/Components/WebView/WebView/src/Services/WebViewJSRuntime.cs

        public bool IsSupported => false;

        public bool IsWebView => true;

        public void InvokeInProcess(string methodName, string arg)
        {
            throw new NotImplementedException();
        }

        public void InvokeUnmarshalled(string methodName, string arg)
        {
            throw new NotImplementedException();
        }

        public void WebViewInvoke(string methodName, string arg)
        {
            // Idea was to invoike BeginInvokeJS of JsRuntime since this directly invokes IPCSender.BeginInvokeJS, but method is protected
            // _jsRuntime.BeginInvokeJS()
            throw new NotImplementedException();
        }

		public object InvokeUnmarshalledGetObject(string methodName)
		{
			throw new NotImplementedException();
		}

		public void InvokeUnmarshalledPassObject(string methodName, object obj)
		{
			throw new NotImplementedException();
		}
	}
}
