export default class Axis extends Phaser.GameObjects.Line {
    constructor(scene, axis) {
        super(scene, scene.x(axis.x), scene.y(axis.y), 0, 0, scene.x(-axis.x) - scene.x(axis.x), scene.y(-axis.y) - scene.y(axis.y), 0xffffff, 0.3);

        this.setOrigin(0, 0);
        this.setLineWidth(2);
        this.setDepth(3);

        scene.add.existing(this);
    }
}