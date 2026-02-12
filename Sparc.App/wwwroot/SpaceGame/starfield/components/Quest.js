export default class Quest extends Phaser.GameObjects.Line {
    constructor(scene, axis, user) {
        super(scene, scene.x(axis.x), scene.y(axis.y), 0, 0, scene.x(user.x) - scene.x(axis.x), scene.y(user.y) - scene.y(axis.y), 0xffffff, 0.1);

        this.setOrigin(0, 0);
        this.setLineWidth(2);
        this.setDepth(3);
        this.setInteractive().on('pointerdown', () => this.scene.dotnet.invokeMethodAsync('SelectGameObject', axis.id));

        scene.add.existing(this);
    }

    updateFromObject(obj) {
        var user = this.scene.objects.find(x => x.type == 'Self');
        if (user)
            this.setTo(this.scene.x(user.x) - this.scene.x(obj.x), this.scene.y(user.y) - this.scene.y(obj.y));
    }
}