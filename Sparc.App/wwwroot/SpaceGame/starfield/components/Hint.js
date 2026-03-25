export default class Hint extends Phaser.GameObjects.Sprite {
    constructor(scene, obj) {
        super(scene, scene.x(obj), scene.y(obj), 'question');

        this.setScale(scene.z(obj) * 4);
        this.setAlpha(scene.z(obj));
        this.setInteractive().on('pointerdown', () => this.scene.dotnet.invokeMethodAsync('SelectGameObject', obj.id));
        scene.add.existing(this);
    }
}