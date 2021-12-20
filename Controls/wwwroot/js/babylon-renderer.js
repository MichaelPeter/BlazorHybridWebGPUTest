"use strict";
/// <reference path="babylonjs">
// Blazor does not support static method calling directly, so we need a workarround over window class
// https://stackoverflow.com/questions/58888300/how-to-call-a-static-javascript-method-from-blazor-c-sharp-code
(function () {
    window.BabylonRenderer = {
        startEngineStatic: function (canvas) {
            return BabylonRenderer.startEngineStatic(canvas);
        }
    };
})();
class BabylonRenderer {
    constructor() {
        this.engine = null;
    }
    startEngine(canvas) {
        if (!canvas)
            throw new Error("No canvas was passed to init engine.");
        // set canvas size this is for some reason problmatic in css
        // https://stackoverflow.com/questions/10214873/make-canvas-as-wide-and-as-high-as-parent
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        //const canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(canvas, true);
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
BabylonRenderer.startEngineStatic = function (canvas) {
    let renderer = new BabylonRenderer();
    renderer.startEngine(canvas);
    return renderer;
};
