using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazorHybridWebGPUTest.Controls.Services
{
    public class SceneViewerCommunicationService : ISceneViewerCommunicationService
    {
        /// <inheritdoc/>
        public Task<double?> RequestFPSAsync()
        {
            if (_fpsProvider == null)
                return Task.FromResult<double?>(null);

            return _fpsProvider();
        }

        private ProvideFPSDelegate? _fpsProvider = null;

        /// <inheritdoc/>
        public void SetFPSProvider(ProvideFPSDelegate fpsProvider)
        {
            _fpsProvider = fpsProvider;
        }
    }
}
