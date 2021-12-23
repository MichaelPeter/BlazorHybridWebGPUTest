## About

This is a sample should demonstrate cross usage of WebGPU code
- In a WPF Windows App
- A Blazor Webassembly Web Application

This is achived over Windows WebView2 and Blazor Hybrid.
WebView2 uses here preview builds of Edge Canary.

Since WebGPU is a evolving standard for fallback reasons the babylon.js api
is used which starting with 5.0.0.0 preview supports WebGPU with a WebGL fallback.

## Technologies demonstrated
- ASP.NET Core 6
- Blazor Webassembly
- Blazor Hybrid (over WPF)
- Typescript (with no Module system)
- WebView2 - with included deployment of Edge Canary for 
- WebGPU / WebGL over babylon.js
- WebGL Shader (GLSL) and WebGPU Shader (WGSL)
- Blazor Native Compilation of C-Code
- npm and @types
- Webpack version with Threeshaking exists in a Seperate branch, but did not optimize size of babylon.js

## Why babylon.js

- If WebGPU is not yet supported there is a fallback to WebGL
- Can target both WebGL and WebGPU
- WebGL Shaders are converted by Tools to WebGPU shaders, so there is clear upgrade path - see https://doc.babylonjs.com/advanced_topics/webGPU/webGPUWGSL
- but also allows to write webgpu shaders
- Babylon Native Runtime (Run Nativly on DirectX, Metal, OpenXR) https://www.babylonjs.com/native/ 

##### Other Babylon Features

- Babylon.js Playground https://playground.babylonjs.com/
- CYOS (Create your own Shader Editor) https://cyos.babylonjs.com/
- Material Editor https://nodematerial-editor.babylonjs.com/
- Bablyon.js Editor http://editor.babylonjs.com/
- Other Tools: https://doc.babylonjs.com/toolsAndResources/tools
- Documentation: https://doc.babylonjs.com/

### Maybe Unreal Engine 4/5?

Unreal Engine 4 already supports HTML5 https://docs.unrealengine.com/4.27/en-US/SharingAndReleasing/HTML5/
There are movments to support WebGPU in Unreal Engine 5 or HTML5 in general https://forums.unrealengine.com/t/ue5-and-the-html5-platform/237070