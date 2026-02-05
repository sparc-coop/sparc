export default class Answer extends Phaser.GameObjects.Star {
    constructor(scene, obj) {
        super(scene, scene.x(obj.x), scene.y(obj.y), 6, 8, 16, 0xffffff);
        console.log('Adding answer');
        scene.add.existing(this);
    }
}