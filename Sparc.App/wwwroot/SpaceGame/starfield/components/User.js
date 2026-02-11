export default class User extends Phaser.GameObjects.Sprite {
    constructor(scene, obj) {
        super(scene, scene.x(obj.x), scene.y(obj.y), 'ship');

        if (obj.type == 'Self') {
            this.setScale(1);
        } else {
            this.setScale(0.7);
        }

        this.setDepth(8);
        this.updateFromObject(obj);
        scene.add.existing(this);
    }

    updateFromObject(obj) {
        var userTrail = this.scene.objects.filter(x => x.type == 'UserTrail');
        var lastPosition = userTrail.length > 1 ? userTrail[userTrail.length - 2] : null;

        if (lastPosition) {
            var rad = Phaser.Math.Angle.Between(this.scene.x(lastPosition.x), this.scene.y(lastPosition.y), this.scene.x(obj.x), this.scene.y(obj.y));
            this.setRotation(rad + Math.PI / 2);
        }
    }
}