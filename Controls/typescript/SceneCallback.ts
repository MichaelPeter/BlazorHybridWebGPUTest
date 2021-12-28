/// <reference path="UsedEngineInfo.ts">

class SceneCallback {
    constructor(private dotnetInterop : any) {

    }

    public EngineStartComplete(result: UsedEngineInfo) : Promise<any> {
        return this.dotnetInterop.invokeMethodAsync("EngineStartComplete");
    }

    public MeshClicked(objectId : number) {
        return this.dotnetInterop.invokeMethodAsync("MeshClicked", objectId);
    }
}