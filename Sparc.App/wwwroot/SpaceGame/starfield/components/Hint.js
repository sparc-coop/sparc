export default class Hint extends Phaser.GameObjects.Rectangle {
    constructor(scene, obj) {
        super(scene, scene.x(obj), scene.y(obj), 16, 16, 0x008000, 1);

        console.log('adding answer', obj);

        scene.add.existing(this);
    }
}