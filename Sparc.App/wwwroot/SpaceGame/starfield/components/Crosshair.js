export default class Crosshair extends Phaser.GameObjects.Sprite {
    constructor(scene, obj) {
        super(scene, scene.x(obj.x), scene.y(obj.y), 'crosshair');
        this.setAlpha(0);
        scene.add.existing(this);
        scene.cameras.main.startFollow(this, false, 0.1, 0.1, scene.width * -0.08, 0);
    }

    updateFromObject(obj) {
        if (obj.ref == 'Self') {
            this.setAlpha(0);
        }
        else {
            this.setAlpha(0.1);
        }
    }
}