export default class Facet extends Phaser.GameObjects.Rectangle {
    constructor(scene, obj) {
        super(scene, scene.x(obj.x), scene.y(obj.y), 32, 32, 0xff0000);
        scene.add.existing(this);
    }
}