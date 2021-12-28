## About

This sample should demonstrate cross usage of WebGPU / WebGL code
- In a WPF Windows App
- A Blazor Webassembly Web Application

This is achived over Windows WebView2 and Blazor Hybrid.
WebView2 should use preview builds of Edge Canary for WebGPU.

Since WebGPU is a unfinished standard for fallback reasons the babylon.js api
is used which starting with 5.0.0.0 preview supports WebGPU with a WebGL fallback.

## Getting started

- Make sure Visual Studio 2022 is installed and .NET 6.0.1 (.NET 6 requires more or less vs2022)
- Also make sure node.js is installed, for npm install

- Goto the BlazorHybridWebGPUTest.Controls project
- execute *npm install* for the typescript depencenties

### Enscripten Wasm Compilation

The Enscripten Compilation currently only works in Release Mode and only in the Webbrowser - this needs more investigation.

- Install dotnet wasm-tools to compile native c code to wasm with Emscripten (if not wanted not nessary)
```powershell
dotnet workload install wasm-tools
```

If the .Server Project is started in Release Mode the C code can be called.

**Info:** The native c depedencies are compiled in release mode investigate further.

### A: For Browser Usage:

##### For Testing WebGPU

- Install Edge Canary or Chrome Canary
- goto edge://flags or chrome://flags
- Activate: Unsafe WebGPU
- Restart the Browser

Start Project 
BlazorHybridWebGPUTest.Server


### B: For WPF Usage:

Start Project
BlazorHybridWebGPUTest.WpfClient

### What can be done

- Hold the left mouse key to move the camera
- Click the spheres to select them. (Currently not working under WebGPU, see error)
- In WPF Window FPS from WebGL or WebGPU is displayed.

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

## TODO:

- Find out why dotnet.js fails with WebGPU on callbacks.
- Deploy specific Version of Edge Canary with WebView2 and activate WebGPU to test WebGPU in WPF, this is currently blocked by BlazorWebView - see below
- C Compilation with Enscripten:
    - Currently only the Web Application supports Wasm
    - Compile C code in WPF code to native binary and not webassembly.
    - Figure out Why the Native Compilation does not work in Razor class library.

- Use GLSL- and WGSL Shaders to test them and to test how babylon converts GLSL shaders to WGSL.
- Try ESM-Module system for typescript instead of compiling into a single file
    - Webpack did not bring advantages yet with babylon.js
- Add UI Framework for example MatBlazor for Google Material.


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

## Issues with WebGPU

The WebGPU usage resulted in a few roadblocks. By itself it seems to work with babylon.js but other technologies make issues:

#### Issues dotnet.js

When Initalizing the bablyon.js engine with WebGPU and trying to make a callback 
to Blazor from the same Javascript "Call" or returning a value the dotnet engine runs into an error.
This was not yet deeply investigated, but does not happen with WebGL.

Attepts to solve the callback with calling the callback from a setTimer() call did not solve the issue.

Also the click events do not come back.

See Also issue here:
https://github.com/dotnet/aspnetcore/issues/39173
See branch: **bug/dotnet-6-fails-callbacks**

#### Issues WebView2 Custom Version

To use WebGPU it is required to have edge canary and have certain edge flags activated.

To use Edge Canary, webview2 has a fixed version deployment where the browser version is deployed with the application setup
https://docs.microsoft.com/en-us/microsoft-edge/webview2/concepts/distribution

Also according to this link, the edge canary binaries can just be copied:
https://github.com/MicrosoftEdge/WebView2Feedback/issues/639#issuecomment-732351554

The WebView2 engine allows to then set the startup binaries by setting `BrowserExecutableFolder`

WebView2 also allows to pass edge://flags to the started edge instance,
should look something like: 
```csharp
CoreWebView2EnvironmentOptions.AdditionalBrowserArguments = "--enable-features=enable-unsafe-webgpu
```

However, with Blazor and BlazorWebView it is quite difficult providing custom settings, here the research stopped with EnsureCoreWebView2Async() which seems to be called already by setting BlazorWebView.HostPage which calls WebView2.Navigate() and which then seems to somehow cause EnsureCoreWebView2Async() to be called multiple times.

The issue was fixed according to this: https://github.com/MicrosoftEdge/WebView2Feedback/issues/1782
But it here in this scenario it still makes problems.

A feature request to implement it in BlazorWebView is here:
https://github.com/dotnet/maui/issues/3861

But could be worked arround temporary by making a own fork of WPF BlazorWebView - which is a seperate component.

### Maybe Unreal Engine 4/5?

Unreal Engine 4 already supports HTML5 https://docs.unrealengine.com/4.27/en-US/SharingAndReleasing/HTML5/
There are movements to support WebGPU in Unreal Engine 5 or HTML5 in general https://forums.unrealengine.com/t/ue5-and-the-html5-platform/237070