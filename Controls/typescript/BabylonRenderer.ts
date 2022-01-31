/// <reference path="babylonjs">
/// <reference path="UsedEngineInfo.ts">
/// <reference path="SceneCallback.ts">
/// <reference path="SceneContainer.ts">

class BabylonRenderer {
    constructor(dotnetInterop: any, private _canvas: HTMLCanvasElement) {
        this.sceneCallback = new SceneCallback(dotnetInterop);
    }
    
    public engine: BABYLON.Engine | null = null;
    public usedEngineInfo: UsedEngineInfo | null = null;
    public sceneCallback: SceneCallback
    public webGpuUsed: boolean | null = null;
    private sceneContainer: SceneContainer | null = null;

    // For some reason blazor had here problems with promise return values.
    public beginStartEngine() {
        this.startEngine();
    }

    // needs to be seperated call since dotnet-blazor has problems getting return values from begin start engine or startEngine.
    public async initializeEngine() {
        let webGpuSupported = await BABYLON.WebGPUEngine.IsSupportedAsync;
        this.webGpuUsed = webGpuSupported;
        this.usedEngineInfo = new UsedEngineInfo(webGpuSupported, this.webGpuUsed)
        return this.usedEngineInfo;
    }

    public PassMyself(renderer: BabylonRenderer): void {
        console.log(renderer.webGpuUsed);
    }

    public async startEngine(): Promise<UsedEngineInfo> {

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
            var eng = new BABYLON.WebGPUEngine(canvas)
            await eng.initAsync();
            this.engine = eng;
        } else {
            this.engine = new BABYLON.Engine(canvas, true /* Antialias*/);
        }

        this.sceneContainer = SceneContainer.createScene(this, canvas); 

        var me = this;

        // Register a render loop to repeatedly render the scene
        this.engine.runRenderLoop(function () {
            me.sceneContainer!.scene.render();
        });

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
            me.engine!.resize();
        }); 

        // do not call this since dotnet has a problem with webgpu
        //this.sceneCallback.EngineStartComplete(this.usedEngineInfo!);
        return this.usedEngineInfo!;
    }

    public jsInteropPerformanceTest(input: string) {
        // do nothing just check execution
    }

    private _selectedMesh: RegisteredMesh | null = null;

    public selectMesh(meshId: number) {

        this.checkEngineStarted();

        // throws exception if not found
        let regMesh = this.sceneContainer!.getRegisteredMesh(meshId);

        // U
        if (this._selectedMesh) {
            this._selectedMesh.setIsSelected(false);
        }

        regMesh.setIsSelected(true);
        this._selectedMesh = regMesh;
    }

    public getStartEngineResult(): UsedEngineInfo {
        if (!this.usedEngineInfo)
            throw new Error("Engine has not been started")

        return this.usedEngineInfo;
    }

    private checkEngineStarted() : void {
        if (this.engine == null)
            throw new Error("Engine has not been started yet.");
    }

    public getFPS(): number | null {

        // In case not yet initalized return null, if engine is still starting.
        if (!this.engine)
            return null;

        return this.engine!.getFps();
    }
}