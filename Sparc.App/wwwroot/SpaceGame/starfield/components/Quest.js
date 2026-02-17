export default class Quest extends Phaser.GameObjects.Line {
    constructor(scene, axis) {
        super(scene, scene.x(axis), scene.y(axis), 0, 0, 0, 0, 0xffffff, 0.1);

        this.setOrigin(0, 0);
        this.setLineWidth(2);
        this.setDepth(3);
        this.setInteractive().on('pointerdown', () => this.scene.dotnet.invokeMethodAsync('SelectGameObject', axis.id));

        this.updateFromObject(obj);
        scene.add.existing(this);
    }

    updateFromObject(obj) {
        var user = this.scene.findInGameState('headspace');
        if (user)
            this.setTo(this.scene.x(user) - this.scene.x(obj), this.scene.y(user) - this.scene.y(obj));
    }
}