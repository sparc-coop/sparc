export default class NorthStar extends Phaser.GameObjects.Line {
    constructor(scene, obj) {
        super(scene, scene.x(0), scene.y(0), 0, 0, scene.x(obj.x) - scene.x(0), scene.y(obj.y) - scene.y(0));
        scene.add.existing(this);
    }
}