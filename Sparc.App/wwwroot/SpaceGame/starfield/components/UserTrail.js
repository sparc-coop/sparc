export default class UserTrail extends Phaser.GameObjects.Line {
    constructor(scene, obj) {
        super(scene, scene.x(obj.x), scene.y(obj.y), 0, 0, 0, 0, 0x9f2b68, 1);

        this.setOrigin(0, 0);
        this.setLineWidth(3);

        this.updateFromObject(obj);

        //if (isLastPosition && scene.home.x != 0) {
        //    this.x = scene.x(scene.home.x);
        //    this.y = scene.y(scene.home.y);
        //}

        scene.add.existing(this);
    }

    updateFromObject(obj) {
        // Scale alpha based on its index in the trail, with the most recent position being the most opaque
        var userTrail = this.scene.objects.filter(x => x.type == 'UserTrail');
        var index = userTrail.findIndex(x => x.id == obj.id);
        if (index > 0) {
            var previousPosition = userTrail[index - 1];

            var x2 = this.scene.x(previousPosition.x) - this.scene.x(obj.x);
            var y2 = this.scene.y(previousPosition.y) - this.scene.y(obj.y);
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
        this.setAlpha(obj.z);
        this.setLineWidth(6 * alphaIndex);
        //this.setScale(userTrail.length - index);
    }
}