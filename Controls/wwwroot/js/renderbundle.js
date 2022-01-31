"use strict";
/// <reference path="babylonjs">
/// <reference path="UsedEngineInfo.ts">
/// <reference path="SceneCallback.ts">
/// <reference path="SceneContainer.ts">
class BabylonRenderer {
    constructor(dotnetInterop, _canvas) {
        this._canvas = _canvas;
        this.engine = null;
        this.usedEngineInfo = null;
        this.webGpuUsed = null;
        this.sceneContainer = null;
        this._selectedMesh = null;
        this.sceneCallback = new SceneCallback(dotnetInterop);
    }
    // For some reason blazor had here problems with promise return values.
    beginStartEngine() {
        this.startEngine();
    }
    // needs to be seperated call since dotnet-blazor has problems getting return values from begin start engine or startEngine.
    async initializeEngine() {
        let webGpuSupported = await BABYLON.WebGPUEngine.IsSupportedAsync;
        this.webGpuUsed = webGpuSupported;
        this.usedEngineInfo = new UsedEngineInfo(webGpuSupported, this.webGpuUsed);
        return this.usedEngineInfo;
    }
    PassMyself(renderer) {
        console.log(renderer.webGpuUsed);
    }
    async startEngine() {
        let canvas = this._canvas;
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
        this.sceneContainer = SceneContainer.createScene(this, canvas);
        var me = this;
        // Register a render loop to repeatedly render the scene
        this.engine.runRenderLoop(function () {
            me.sceneContainer.scene.render();
        });
        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
            me.engine.resize();
        });
        // do not call this since dotnet has a problem with webgpu
        //this.sceneCallback.EngineStartComplete(this.usedEngineInfo!);
        return this.usedEngineInfo;
    }
    jsInteropPerformanceTest(input) {
        // do nothing just check execution
    }
    selectMesh(meshId) {
        this.checkEngineStarted();
        // throws exception if not found
        let regMesh = this.sceneContainer.getRegisteredMesh(meshId);
        // U
        if (this._selectedMesh) {
            this._selectedMesh.setIsSelected(false);
        }
        regMesh.setIsSelected(true);
        this._selectedMesh = regMesh;
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
    getFPS() {
        // In case not yet initalized return null, if engine is still starting.
        if (!this.engine)
            return null;
        return this.engine.getFps();
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
    window.newRenderEngine = function (dotnetInterop, canvas) {
        var engine = new BabylonRenderer(dotnetInterop, canvas);
        _blazorRender = engine;
        return engine;
    };
    window.getCurrentRenderEngine = function () {
        return _blazorRender;
    };
    window.passRenderEngine = function (engine) {
        console.log(engine);
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
    window.jsInteropPerformanceTest = function (input) {
        // do nothing just to test performance.
        return input;
    };
    window.jsInteropPerformanceTestUnmarshalled = function (binaryData) {
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
/// <reference path="babylonjs">
class RegisteredMesh {
    constructor(scene, id, mesh) {
        this.scene = scene;
        this.id = id;
        this.mesh = mesh;
    }
    setIsSelected(isSelected) {
        this.mesh.material = isSelected ? this.scene.selectedMaterial : this.scene.unselectedMaterial;
    }
}
/// <reference path="UsedEngineInfo.ts">
class SceneCallback {
    constructor(dotnetInterop) {
        this.dotnetInterop = dotnetInterop;
    }
    EngineStartComplete(result) {
        return this.dotnetInterop.invokeMethodAsync("EngineStartComplete");
    }
    MeshClicked(objectId) {
        return this.dotnetInterop.invokeMethodAsync("MeshClicked", objectId);
    }
}
class SceneContainer {
    constructor(_renderer, scene) {
        this._renderer = _renderer;
        this.scene = scene;
        this._currentObjectId = 0;
        this._registeredMeshes = new Map();
        this.selectedMaterial = this.buildMaterial(true);
        this.unselectedMaterial = this.buildMaterial(false);
    }
    static createScene(renderer, canvas) {
        // This creates a basic Babylon Scene object (non-mesh)
        let scene = new BABYLON.Scene(renderer.engine);
        var sceneContainer = new SceneContainer(renderer, scene);
        // Modification
        scene.ambientColor = new BABYLON.Color3(1, 1, 1);
        // This creates and positions a free camera (non-mesh)
        let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
        sceneContainer.createSphere(-3, false);
        sceneContainer.createSphere(0, false);
        sceneContainer.createSphere(3, false);
        // Our built-in 'ground' shape.
        var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 8, height: 8 }, scene);
        return sceneContainer;
    }
    // Throws an exception if the mesh is not found.
    getRegisteredMesh(id) {
        let item = this._registeredMeshes.get(id);
        // Sadly typescript does not have yet getItem ?? throw like C# :(
        if (!item)
            throw new Error(`No registered mesh with id ${id}`);
        return item;
    }
    buildMaterial(isSelected) {
        // selected is green, unselected red
        let redPart = isSelected ? 0 : 1;
        let greenPart = isSelected ? 1 : 0;
        let matName = `mat${isSelected ? "Selected" : ""}`;
        let mat = new BABYLON.PBRMaterial(matName, this.scene);
        //mat.diffuseColor = new Color3(1, 0, 1);
        //mat.specularColor = new Color3(0.5, 0.6, 0.87);
        mat.emissiveColor = new BABYLON.Color3(redPart, greenPart, 0);
        mat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
        return mat;
    }
    createSphere(xPosition, isSelected) {
        // Our built-in 'sphere' shape.
        let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, this.scene);
        var me = this;
        var regMesh = new RegisteredMesh(this, ++this._currentObjectId, sphere);
        regMesh.setIsSelected(isSelected);
        sphere.actionManager = new BABYLON.ActionManager(this.scene);
        sphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnLeftPickTrigger
        }, function () {
            me._renderer.sceneCallback.MeshClicked(regMesh.id);
        }));
        // Move the sphere upward 1/2 its height
        sphere.position.x = xPosition;
        sphere.position.y = 1;
        this._registeredMeshes.set(regMesh.id, regMesh);
        return regMesh;
    }
    ;
}
/// <reference path="babylon-renderer.ts">
class UsedEngineInfo {
    constructor(webGpuSupported, webGpuUsed) {
        this.webGpuSupported = webGpuSupported;
        this.webGpuUsed = webGpuUsed;
    }
}
