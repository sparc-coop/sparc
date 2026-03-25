export default class Crosshair extends Phaser.GameObjects.Sprite {
    constructor(scene, objToFollow) {
        super(scene, scene.x(objToFollow), scene.y(objToFollow), 'crosshair');
        this.setAlpha(0);
        scene.add.existing(this);
        scene.cameras.main.startFollow(this, false, 0.1, 0.1, scene.width * -0.08, 0);
    }

    select(id, path) {
        var objToFollow = id ?
            this.scene.find(null, id)
            : this.scene.find('Self');

        console.log('following', objToFollow);

        if (objToFollow) {
            this.setAlpha(objToFollow.constructor.name == 'Self' ? 0 : 0.1);
            this.scene.moveObject(this, objToFollow);
        }

        if (!path)
            return;

        var questPaths = path.map(x => { return { x: this.scene.x(x), y: this.scene.y(x) }; });
        console.log('quest paths', questPaths);

        var quest = this.scene.add.graphics({
            lineStyle: { width: 2, color: 0x9f2b68, alpha: 0.5 },
        });
        quest.strokePoints(questPaths);
    }
}