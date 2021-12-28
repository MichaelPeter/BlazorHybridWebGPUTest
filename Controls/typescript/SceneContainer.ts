class SceneContainer {
    private constructor(
        private _renderer: BabylonRenderer,
        public scene: BABYLON.Scene,
    ) {
        this._registeredMeshes = new Map<number, RegisteredMesh>();

        this.selectedMaterial = this.buildMaterial(true);
        this.unselectedMaterial = this.buildMaterial(false);
    }

    private _currentObjectId: number = 0;
    private _registeredMeshes: Map<number, RegisteredMesh>;

    public readonly selectedMaterial: BABYLON.Material;
    public readonly unselectedMaterial: BABYLON.Material;

    public static createScene(renderer: BabylonRenderer, canvas: HTMLCanvasElement): SceneContainer {

        // This creates a basic Babylon Scene object (non-mesh)
        let scene = new BABYLON.Scene(renderer.engine!);

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
    public getRegisteredMesh(id: number): RegisteredMesh {
        let item = this._registeredMeshes.get(id);

        // Sadly typescript does not have yet getItem ?? throw like C# :(
        if (!item)
            throw new Error(`No registered mesh with id ${id}`);

        return item;
    }

    private buildMaterial(isSelected: boolean): BABYLON.Material {

        // selected is green, unselected red
        let redPart = isSelected ? 0 : 1;
        let greenPart = isSelected ? 1 : 0

        let matName = `mat${isSelected ? "Selected" : ""}`;

        let mat = new BABYLON.PBRMaterial(matName, this.scene);
        //mat.diffuseColor = new Color3(1, 0, 1);
        //mat.specularColor = new Color3(0.5, 0.6, 0.87);
        mat.emissiveColor = new BABYLON.Color3(redPart, greenPart, 0);
        mat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
        return mat;
    }

    private createSphere(xPosition: number, isSelected: boolean): RegisteredMesh {

        // Our built-in 'sphere' shape.
        let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, this.scene);

        var me = this;

        var regMesh = new RegisteredMesh(this, ++this._currentObjectId, sphere);
        regMesh.setIsSelected(isSelected);

        sphere.actionManager = new BABYLON.ActionManager(this.scene);
        sphere.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnLeftPickTrigger
                }, function () {
                    me._renderer.sceneCallback.MeshClicked(regMesh.id)
                }
            ));

        // Move the sphere upward 1/2 its height
        sphere.position.x = xPosition;
        sphere.position.y = 1;

        this._registeredMeshes.set(regMesh.id, regMesh);
        return regMesh;
    };
}