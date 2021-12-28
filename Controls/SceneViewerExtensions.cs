using BlazorHybridWebGPUTest.Controls.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazorHybridWebGPUTest.Controls
{
    public static class SceneViewerExtensions
    {
        /// <summary>
        /// Registers the connection with the scene viewer.
        /// </summary>
        /// <typeparam name="THostCommunication"></typeparam>
        /// <param name="services"></param>
        /// <param name="communicationService"></param>
        /// <returns></returns>
        public static IServiceCollection UseSceneViewer(this IServiceCollection services, ISceneViewerCommunicationService communicationService)
        {
            services.AddSingleton<ISceneViewerCommunicationService>(communicationService);
            return services;
        }
    }
}
