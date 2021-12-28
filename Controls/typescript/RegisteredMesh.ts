/// <reference path="babylonjs">

class RegisteredMesh {
    constructor(public readonly scene : SceneContainer, public readonly id: number, public mesh: BABYLON.Mesh) {

    }

    public setIsSelected(isSelected: boolean) {
        this.mesh.material = isSelected ? this.scene.selectedMaterial : this.scene.unselectedMaterial;
    }
}