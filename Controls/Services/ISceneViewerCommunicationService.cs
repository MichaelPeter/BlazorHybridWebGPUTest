
namespace BlazorHybridWebGPUTest.Controls.Services
{
    public interface ISceneViewerCommunicationService
    {
        /// <summary>
        /// Returens null if no FPS provider registered.
        /// </summary>
        /// <returns></returns>
        Task<double?> RequestFPSAsync();
        void SetFPSProvider(ProvideFPSDelegate fpsProvider);
    }

    public delegate Task<double?> ProvideFPSDelegate();
}