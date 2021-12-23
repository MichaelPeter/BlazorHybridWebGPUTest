/// <reference path="StartEngineResult.ts">

class SceneCallback {
    constructor(private dotnetInterop : any) {

    }

    public EngineStartComplete(result: StartEngineResult) : Promise<any> {
        return this.dotnetInterop.invokeMethodAsync("EngineStartComplete");
    }
}