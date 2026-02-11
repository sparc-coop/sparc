export default class Hint extends Phaser.GameObjects.Rectangle {
    constructor(scene, obj) {
        super(scene, scene.x(obj.x), scene.y(obj.y), 8, 8, 0x008000, 0);

        console.log('adding answer', obj);

        scene.add.existing(this);
    }
}