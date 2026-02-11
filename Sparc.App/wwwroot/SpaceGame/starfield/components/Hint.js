export default class Hint extends Phaser.GameObjects.Rectangle {
    constructor(scene, obj) {
        super(scene, scene.x(obj.x), scene.y(obj.y), 16, 16, 0x008000, obj.z);

        console.log('adding answer', obj);

        scene.add.existing(this);
    }
}