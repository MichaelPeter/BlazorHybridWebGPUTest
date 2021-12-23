/// <reference path="babylon-renderer.ts">
/// <reference path="StartEngineResult.ts">

var _blazorRender: BabylonRenderer | null  = null;

// Blazor does not support static method calling directly, so we need a workarround over window class
// https://stackoverflow.com/questions/58888300/how-to-call-a-static-javascript-method-from-blazor-c-sharp-code
(function () {
    (<any>window).BabylonRenderer = {
        startEngineStatic: async function (canvas: HTMLCanvasElement): Promise<StartEngineResult> {
            _blazorRender = new BabylonRenderer();
            return _blazorRender.startEngine(canvas)
        }
    };
    (<any>window).getFps = function (): number {
        if (_blazorRender == null)
            throw new Error("Engine not yet initialized");

        return _blazorRender!.getFps();
    };
    (<any>window).blazorGetCurrentUrl = function (): string {
        return window.location.href;
    };
})(); 