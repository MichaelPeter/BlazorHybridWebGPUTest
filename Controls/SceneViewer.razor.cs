using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace BlazorHybridWebGPUTest.Controls
{
    public partial class SceneViewer
    {
        // Performance jsinterop + unmarshalled:
        // https://www.meziantou.net/optimizing-js-interop-in-a-blazor-webassembly-application.htm

        private const int JSInteropPerformanceExecutionCount = 10_000;
        private async Task OnJSInteropPerformanceTest()
        {
            var results = new List<string>();

            results.Add(await ExecuteInterop(JSInvokeMode.Sequenical));
            if (!JSUnsafe.IsSupported)
                results.Add(await ExecuteInterop(JSInvokeMode.Parallel)); // on WASM equal speed, on WebView2 5 times slower
            if (JSUnsafe.IsSupported)
            {
                results.Add(await ExecuteInterop(JSInvokeMode.Unmarshalled));
                results.Add(await ExecuteInterop(JSInvokeMode.InProcess));
            }

            string combined = string.Join(Environment.NewLine, results);

            await JS.InvokeVoidAsync("alert", new object[] { combined });
        }

        private async Task<string> ExecuteInterop(JSInvokeMode invokeMode)
        {
            var sw = new Stopwatch();
            sw.Start();
            switch (invokeMode)
            {
                case JSInvokeMode.Sequenical:
                    for (int i = 0; i < JSInteropPerformanceExecutionCount; i++)
                    {
                        await JS.InvokeVoidAsync("jsInteropPerformanceTest", "123");
                    }
                    break;
                case JSInvokeMode.Parallel:
                    var tasks = new Task[JSInteropPerformanceExecutionCount];
                    for (int i = 0; i < JSInteropPerformanceExecutionCount; i++)
                    {
                        tasks[i] = JS.InvokeVoidAsync("jsInteropPerformanceTest", "123").AsTask();
                    }
                    await Task.WhenAll(tasks);
                    break;
                case JSInvokeMode.InProcess:
                    for (int i = 0; i < JSInteropPerformanceExecutionCount; i++)
                    {
                        JSUnsafe.InvokeInProcess("jsInteropPerformanceTest", "123");
                    }
                    break;
                case JSInvokeMode.Unmarshalled:
                    for (int i = 0; i < JSInteropPerformanceExecutionCount; i++)
                    {
                        JSUnsafe.InvokeUnmarshalled("jsInteropPerformanceTestUnmarshalled", "123");
                    }
                    break;
                    

            }
            sw.Stop();

            string perfString = $"[{invokeMode.ToString()}] ExecutionTime: {sw.ElapsedMilliseconds} Milliseconds, CallCount: {JSInteropPerformanceExecutionCount}";
            return perfString;
        }
    }

    internal enum JSInvokeMode
    {
        Sequenical,
        Parallel,
        Unmarshalled,
        InProcess,
    }
}
