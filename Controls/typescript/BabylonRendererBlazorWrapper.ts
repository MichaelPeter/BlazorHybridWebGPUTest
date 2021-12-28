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
        return new BabylonRenderer(dotnetInterop, canvas);
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
    }

})(); 