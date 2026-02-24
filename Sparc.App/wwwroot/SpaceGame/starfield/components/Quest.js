export default class Quest extends Phaser.GameObjects.Line {
    constructor(scene, obj) {
        super(scene, 0, 0, 0, 0, 0, 0, 0xffffff, 0.1);

        this.x = this.baseX(obj);
        this.y = this.baseY(obj);
        this.setOrigin(0, 0);
        this.setLineWidth(2);
        this.setDepth(3);
        this.setInteractive().on('pointerdown', () => this.scene.dotnet.invokeMethodAsync('SelectGameObject', obj.id));

        this.updateFromObject(obj);
        scene.add.existing(this);
    }

    baseX(obj) {
        return this.scene.x(this.scene.gameState.self);
    }

    baseY(obj) {
        return this.scene.y(this.scene.gameState.self);
    }

    updateFromObject(obj) {
        var x2 = this.scene.x(obj, 0);
        var y2 = this.scene.y(obj, 0);
        this.setTo(x2, y2);
    }
}