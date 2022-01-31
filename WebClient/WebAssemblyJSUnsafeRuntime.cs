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
          var arr = new byte[] { 1, 2, 3 };

          _jSUnmarshalledRuntime.InvokeUnmarshalled<byte[], string>(methodName, arr);


        }

		public object InvokeUnmarshalledGetObject(string methodName)
		{
      _jSUnmarshalledRuntime.InvokeUnmarshalled<long>(methodName);
      return null!;
    }

		public void InvokeUnmarshalledPassObject(string methodName, object obj)
		{
      _jSUnmarshalledRuntime.InvokeUnmarshalled<IJSObjectReference ,object>(methodName, (IJSObjectReference)obj);
    }

		public void WebViewInvoke(string methodName, string arg)
        {
            throw new NotImplementedException();
        }
    }
}
