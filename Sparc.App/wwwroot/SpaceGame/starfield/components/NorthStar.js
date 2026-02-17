export default class NorthStar extends Phaser.GameObjects.Sprite {
    constructor(scene, obj) {
        super(scene, 64, scene.height - 32, 'north');
        this.setScrollFactor(0);
        this.setScale(0.08);

        this.updateFromObject(obj);
        scene.add.existing(this);
    }

    updateFromObject(obj) {
        var user = this.scene.findInGameState('self');
        var rad = Phaser.Math.Angle.Between(this.scene.x(user), this.scene.y(user), this.scene.x(obj), this.scene.y(obj));
        this.setRotation(rad + Math.PI / 2);
        console.log('north star', obj, user, rad);
    }
}
