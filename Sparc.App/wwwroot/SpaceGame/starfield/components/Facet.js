export default class Facet extends Phaser.GameObjects.Rectangle {
    constructor(scene, obj) {
        super(scene, scene.x(obj.x), scene.y(obj.y), 8, 8, 0xff0000, 0.1);
        scene.add.existing(this);
    }
}