export default class Quest extends Phaser.GameObjects.Sprite {
    constructor(scene, obj) {
        super(scene, scene.x(obj), scene.y(obj), 'Post');
        this.setScale(scene.z(obj) * 4);
        this.setAlpha(scene.z(obj));
        console.log('quest!');
        scene.add.existing(this);
    }
}