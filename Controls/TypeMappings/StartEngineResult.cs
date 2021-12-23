using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazorHybridWebGPUTest.Controls.TypeMappings
{
    /// <summary>
    /// Wrapper for typescript type.
    /// </summary>
    /// <param name="webGpuSupported"></param>
    /// <param name="webGpuUsed"></param>
    public class StartEngineResult
    {
        public StartEngineResult()
        {

        }

        public bool WebGpuSupported { get; set; } = false;
        public bool WebGpuUsed { get; set; } = false;
    }
}
