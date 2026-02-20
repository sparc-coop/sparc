export default class User extends Phaser.GameObjects.Sprite {
    constructor(scene, obj) {
        super(scene, scene.x(obj), scene.y(obj), 'ship');

        if (obj._type == 'Self') {
            this.setScale(1);
        } else {
            this.setScale(0.7);
        }

        this.setDepth(8);
        this.updateFromObject(obj);
        scene.add.existing(this);

        console.log('creating user', obj, this.x, this.y);
    }

    updateFromObject(obj) {
        var userTrail = this.scene.getAll('UserTrail', x => x.userId == obj.id);
        var lastPosition = userTrail.length > 1 ? userTrail[userTrail.length - 2] : null;
        userTrail.forEach(x => x.updateFromObject(obj));

        if (lastPosition) {
            var rad = Phaser.Math.Angle.Between(this.scene.x(lastPosition), this.scene.y(lastPosition), this.scene.x(obj), this.scene.y(obj));
            this.setRotation(rad + Math.PI / 2);
        }
    }
}