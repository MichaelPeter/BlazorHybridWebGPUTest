"use strict";
/// <reference path="babylonjs">
/// <reference path="UsedEngineInfo.ts">
/// <reference path="SceneCallback.ts">
class BabylonRenderer {
    constructor(dotnetInterop) {
        this.engine = null;
        this.usedEngineInfo = null;
        this.webGpuUsed = null;
        this.sceneCallback = new SceneCallback(dotnetInterop);
    }
    // For some reason blazor had here problems with promise return values.
    beginStartEngine(canvas) {
        this.startEngine(canvas);
    }
    // needs to be seperated call since dotnet-blazor has problems getting return values from begin start engine or startEngine.
    async initializeEngine() {
        let webGpuSupported = await BABYLON.WebGPUEngine.IsSupportedAsync;
        this.webGpuUsed = webGpuSupported;
        this.usedEngineInfo = new UsedEngineInfo(webGpuSupported, this.webGpuUsed);
        return this.usedEngineInfo;
    }
    async startEngine(canvas) {
        if (!canvas)
            throw new Error("No canvas was passed to init engine.");
        // set canvas size this is for some reason problmatic in css
        // https://stackoverflow.com/questions/10214873/make-canvas-as-wide-and-as-high-as-parent
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        if (this.webGpuUsed) {
            var eng = new BABYLON.WebGPUEngine(canvas);
            await eng.initAsync();
            this.engine = eng;
        }
        else {
            this.engine = new BABYLON.Engine(canvas, true /* Antialias*/);
        }
        var scene = this.createScene(this.engine, canvas);
        // Register a render loop to repeatedly render the scene
        this.engine.runRenderLoop(function () {
            scene.render();
        });
        var me = this;
        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
            me.engine.resize();
        });
        // do not call this since dotnet has a problem with webgpu
        //this.sceneCallback.EngineStartComplete(this.usedEngineInfo!);
        return this.usedEngineInfo;
    }
    getStartEngineResult() {
        if (!this.usedEngineInfo)
            throw new Error("Engine has not been started");
        return this.usedEngineInfo;
    }
    checkEngineStarted() {
        if (this.engine == null)
            throw new Error("Engine has not been started yet.");
    }
    getFps() {
        this.checkEngineStarted();
        return this.engine.getFps();
    }
    createScene(engine, canvas) {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);
        // Modification
        scene.ambientColor = new BABYLON.Color3(1, 1, 1);
        // This creates and positions a free camera (non-mesh)
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
        function createSphere(xPosition, isGreen) {
            let redPart = isGreen ? 0 : 1;
            let greenPart = isGreen ? 1 : 0;
            let matName = "mat" + xPosition;
            var mat = new BABYLON.PBRMaterial(matName, scene);
            //mat.diffuseColor = new Color3(1, 0, 1);
            //mat.specularColor = new Color3(0.5, 0.6, 0.87);
            mat.emissiveColor = new BABYLON.Color3(redPart, greenPart, 0);
            mat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
            // Our built-in 'sphere' shape.
            var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
            // Move the sphere upward 1/2 its height
            sphere.position.x = xPosition;
            sphere.position.y = 1;
            sphere.material = mat;
        }
        ;
        createSphere(-3, false);
        createSphere(0, true);
        createSphere(3, false);
        // Our built-in 'ground' shape.
        var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 8, height: 8 }, scene);
        return scene;
    }
}
/// <reference path="babylon-renderer.ts">
/// <reference path="UsedEngineInfo.ts">
var _blazorRender = null;
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
    window.newRenderEngine = function (dotnetInterop) {
        return new BabylonRenderer(dotnetInterop);
    };
    //(<any>window).getFps = function (): number {
    //    if (_blazorRender == null)
    //        throw new Error("Engine not yet initialized");
    //    return _blazorRender!.getFps();
    //};
    window.blazorGetCurrentUrl = function () {
        return window.location.href;
    };
    // For some reason here blazor needs to register window functions
    window.getIsWebView = function () {
        // this variable is set in index.html, thats why ignore the error
        // @ts-ignore:
        return isWebView;
    };
})();
/// <reference path="UsedEngineInfo.ts">
class SceneCallback {
    constructor(dotnetInterop) {
        this.dotnetInterop = dotnetInterop;
    }
    EngineStartComplete(result) {
        return this.dotnetInterop.invokeMethodAsync("EngineStartComplete");
    }
}
/// <reference path="babylon-renderer.ts">
class UsedEngineInfo {
    constructor(webGpuSupported, webGpuUsed) {
        this.webGpuSupported = webGpuSupported;
        this.webGpuUsed = webGpuUsed;
    }
}
