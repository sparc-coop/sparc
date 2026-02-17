export default class Facet extends Phaser.GameObjects.Rectangle {
    constructor(scene, obj) {
        super(scene, scene.x(obj), scene.y(obj), 8, 8, 0xff0000, 0.1);
        scene.add.existing(this);
    }
}