export default class DefaultObject extends Phaser.GameObjects.Rectangle {
    constructor(scene, obj) {
        super(scene, scene.x(obj.x), scene.y(obj.y), 8, 8, 0xeeeeee);
        console.log('Adding default object - type not recognized:', obj);
        scene.add.existing(this);
    }
}