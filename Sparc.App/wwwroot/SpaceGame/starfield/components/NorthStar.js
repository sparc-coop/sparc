export default class NorthStar extends Phaser.GameObjects.Sprite {
    constructor(scene, obj) {
        super(scene, 64, scene.height - 32, 'north');
        this.setScrollFactor(0);
        this.setScale(0.08);

        this.updateFromObject(obj);
        scene.add.existing(this);
    }

    updateFromObject(obj) {
        var user = this.scene.objects.find(x => x.type == 'Self');
        var rad = Phaser.Math.Angle.Between(this.scene.x(user.x), this.scene.y(user.y), this.scene.x(obj.x), this.scene.y(obj.y));
        this.setRotation(rad + Math.PI / 2);
        console.log('north star', obj, user, rad);
    }
}
