export default class QuestPath extends Phaser.GameObjects.Line {
    userId;
    constructor(scene, obj) {
        super(scene, scene.x(obj), scene.y(obj), 0, 0, 0, 0, 0x9f2b68, 1);

        this.userId = obj.user.id;
        this.name = obj.id;
        this.setOrigin(0, 0);
        this.setLineWidth(3);

        this.updateFromObject(obj);

        scene.add.existing(this);
    }

    updateFromObject(obj) {
        // Scale alpha based on its index in the trail, with the most recent position being the most opaque
        var paths = this.scene.getAllInGameState('questPaths', x => x.user.id == this.userId);
        var index = paths.findIndex(x => x.id == obj.id);

        if (index > 0) {
            var previousPosition = paths[index - 1];

            var x2 = this.scene.x(previousPosition) - this.scene.x(obj);
            var y2 = this.scene.y(previousPosition) - this.scene.y(obj);

            this.setTo(0, 0, x2, y2);
            console.log(this, x2, y2);
        }

        //var alphaIndex = 1 - (paths.length - (index + 1)) / paths.length;
        //this.setAlpha(alphaIndex * alphaIndex * alphaIndex);
        //this.setAlpha(this.scene.z(obj));
        //this.setLineWidth(6 * alphaIndex);
        //this.setScale(paths.length - index);
    }
}