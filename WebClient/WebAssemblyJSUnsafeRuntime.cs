using BlazorHybridWebGPUTest.Controls;
using Microsoft.JSInterop;

namespace BlazorHybridWebGPUTest.WebClient
{
    public class WebAssemblyJSUnsafeRuntime : IJSUnsafeRuntime
    {
        public WebAssemblyJSUnsafeRuntime(IJSInProcessRuntime jSInProcessRuntime, IJSUnmarshalledRuntime jSUnmarshalledRuntime)
        {
            _jSInProcessRuntime = jSInProcessRuntime;
            _jSUnmarshalledRuntime = jSUnmarshalledRuntime;
        }

        public bool IsSupported => true;

        public bool IsWebView => false;

        private IJSInProcessRuntime _jSInProcessRuntime { get; }
        private IJSUnmarshalledRuntime _jSUnmarshalledRuntime { get; }

        public void InvokeInProcess(string methodName, string arg)
        {
            _jSInProcessRuntime.InvokeVoid(methodName, arg);
        }

        public void InvokeUnmarshalled(string methodName, string arg)
        {
            _jSUnmarshalledRuntime.InvokeUnmarshalled<string, string>(methodName, arg);
        }

        public void WebViewInvoke(string methodName, string arg)
        {
            throw new NotImplementedException();
        }
    }
}
