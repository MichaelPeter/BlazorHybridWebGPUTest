using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace BlazorHybridWebGPUTest.WebClient.Native
{
    internal class NativeImport
    {
        // See here for WebAssembly
        // https://docs.microsoft.com/en-us/aspnet/core/blazor/webassembly-native-dependencies?view=aspnetcore-6.0

        [DllImport("Native" /* The class name */)]
        public static extern int fact(int n);
    }
}
