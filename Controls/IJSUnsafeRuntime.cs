using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazorHybridWebGPUTest.Controls
{
    public interface IJSUnsafeRuntime
    {
        bool IsSupported { get; }

        void InvokeInProcess(string methodName, string arg);
        void InvokeUnmarshalled(string methodName, string arg);

        bool IsWebView { get;  }

        void WebViewInvoke(string methodName, string arg);

      object InvokeUnmarshalledGetObject(string methodName);

      void InvokeUnmarshalledPassObject(string methodName, object obj);
  }
}
