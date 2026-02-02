export default class User extends Phaser.GameObjects.Sprite {
    constructor(scene, obj) {
        super(scene, scene.x(obj.x), scene.y(obj.y), 'crosshair');

        if (obj.type == 'Self') {
            this.setAlpha(0.4);
            scene.cameras.main.startFollow(this, false, 0.1, 0.1);
        } else {
            this.setAlpha(0.2);
            this.setScale(0.3);
        }

        scene.add.existing(this);
    }
}