using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazorHybridWebGPUTest.Controls.TypeMappings
{
    public class SceneCallback
    {
        public SceneCallback(Scene scene)
        {
            Scene = scene;
        }

        public Scene Scene { get; private set; }

        [JSInvokable]
        public async Task EngineStartComplete()
        {
            await Scene.EngineStartedAsync(new StartEngineResult());
        }
    }
}
