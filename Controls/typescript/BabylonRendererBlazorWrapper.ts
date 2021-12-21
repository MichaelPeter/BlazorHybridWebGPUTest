﻿/// <reference path="babylon-renderer.ts">

// Blazor does not support static method calling directly, so we need a workarround over window class
// https://stackoverflow.com/questions/58888300/how-to-call-a-static-javascript-method-from-blazor-c-sharp-code
(function () {
    (<any>window).BabylonRenderer = {
        startEngineStatic: function (canvas: HTMLCanvasElement) {
            return new BabylonRenderer().startEngine(canvas)
        }
    };
    (<any>window).blazorGetCurrentUrl = function (): string {
        return window.location.href;
    };
})(); 