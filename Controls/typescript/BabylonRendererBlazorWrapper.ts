/// <reference path="babylon-renderer.ts">
/// <reference path="UsedEngineInfo.ts">

var _blazorRender: BabylonRenderer | null  = null;

// Blazor does not support static method calling directly, so we need a workarround over window class
// https://stackoverflow.com/questions/58888300/how-to-call-a-static-javascript-method-from-blazor-c-sharp-code
(function () {
    //(<any>window).BabylonRenderer = {
    //    startEngineStatic: function (canvas: HTMLCanvasElement): Promise<StartEngineResult> {
    //        _blazorRender = new BabylonRenderer();
    //        let result: Promise<StartEngineResult> = _blazorRender.startEngine(canvas)
    //        return result;
    //    }
    //};


    (<any>window).newRenderEngine = function (dotnetInterop: any, canvas: HTMLCanvasElement): BabylonRenderer {
        var engine = new BabylonRenderer(dotnetInterop, canvas);
        _blazorRender = engine;
        return engine;
    };

    (<any>window).getCurrentRenderEngine = function (): BabylonRenderer {
        return _blazorRender!;
    };

    (<any>window).passRenderEngine = function (engine: any) {
        console.log(engine);
    };

    //(<any>window).getFps = function (): number {
    //    if (_blazorRender == null)
    //        throw new Error("Engine not yet initialized");

    //    return _blazorRender!.getFps();
    //};
    (<any>window).blazorGetCurrentUrl = function (): string {
        return window.location.href;
    };

    // For some reason here blazor needs to register window functions
    (<any>window).getIsWebView = function () {
        // this variable is set in index.html, thats why ignore the error
        // @ts-ignore:
        return isWebView;
    };

    (<any>window).jsInteropPerformanceTest = function (input: string): string {
        // do nothing just to test performance.
        return input
    };

    (<any>window).jsInteropPerformanceTestUnmarshalled = function (binaryData: any): void {
        // Source: https://www.meziantou.net/optimizing-js-interop-in-a-blazor-webassembly-application.htm
        // Not documented and may change in future versions of mono, use it at your own risk...
        // The current source code of the BINDING functions: https://github.com/mono/mono/blob/b6ef72c244bd33623d231ff05bc3d120ad36b4e9/sdks/wasm/src/binding_support.js
        // These functions are defined by _framework/dotnet.<version>.js, which is imported by _framework/blazor.webassembly.js


        // @ts-ignore:
        const dataPtr = Blazor.platform.getArrayEntryPtr(binaryData, 0, 4);
        // @ts-ignore:
        const length = Blazor.platform.getArrayLength(binaryData);
        // @ts-ignore:
        var binaryDataCast = new Int8Array(Module.HEAPU8.buffer, dataPtr, length);

        binaryDataCast[0] = 0;

        // @ts-ignore:
        //const name = BINDING.conv_string(rawInput);       // Convert the handle to a JS string
        // @ts-ignore:
        //return BINDING.js_to_mono_obj(name); // Convert a JS object to a mono object that you can use in the .NET code
    };

})(); 