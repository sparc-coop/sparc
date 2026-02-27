export default class Hint extends Phaser.GameObjects.Sprite {
    constructor(scene, obj) {
        super(scene, scene.x(obj), scene.y(obj), 'question');

        this.setAlpha(scene.z(obj));
        scene.add.existing(this);
    }
}