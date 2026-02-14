export default class UserTrail extends Phaser.GameObjects.Line {
    constructor(scene, obj) {
        super(scene, scene.x(obj), scene.y(obj), 0, 0, 0, 0, 0x9f2b68, 1);

        this.setOrigin(0, 0);
        this.setLineWidth(3);

        this.updateFromObject(obj);

        scene.add.existing(this);
        console.log('made a headspace', this.x, this.y, this.alpha);
    }

    updateFromObject(obj) {
        // Scale alpha based on its index in the trail, with the most recent position being the most opaque
        var userTrail = this.scene.objects.filter(x => (x._type == 'Headspace' || x._type == 'Self') && x.user.id == obj.user.id);
        var index = userTrail.findIndex(x => x.id == obj.id);
        console.log('user trail', userTrail, index);
        if (index > 0) {
            var previousPosition = userTrail[index - 1];

            var x2 = this.scene.x(previousPosition) - this.scene.x(obj);
            var y2 = this.scene.y(previousPosition) - this.scene.y(obj);
            var end = { x: this.geom.x2, y: this.geom.y2 };

            this.scene.tweens.add({
                targets: end,
                x: x2,
                y: y2,
                ease: 'Linear',
                duration: 1000,
                repeat: 0,
                yoyo: false,
                onUpdate: () => {
                    this.setTo(0, 0, end.x, end.y);
                }
            });

            //this.setTo(0, 0, this.scene.x(previousPosition.x) - this.scene.x(obj.x), this.scene.y(previousPosition.y) - this.scene.y(obj.y));
        }

        var alphaIndex = 1 - (userTrail.length - (index + 1)) / userTrail.length;
        this.setAlpha(alphaIndex * alphaIndex * alphaIndex);
        this.setAlpha(this.scene.z(obj));
        this.setLineWidth(6 * alphaIndex);
        //this.setScale(userTrail.length - index);
    }
}