export default class Crosshair extends Phaser.GameObjects.Sprite {
    constructor(scene, objToFollow) {
        super(scene, scene.x(objToFollow), scene.y(objToFollow), 'crosshair');
        this.setAlpha(0);
        scene.add.existing(this);
        scene.cameras.main.startFollow(this, false, 0.1, 0.1, scene.width * -0.08, 0);
    }

    select(id) {
        var objToFollow = id ?
            this.scene.find(null, id)
            : this.scene.find('Self');

        if (objToFollow) {
            this.setAlpha(objToFollow.constructor.name == 'Self' ? 0 : 0.1);
            this.scene.moveObject(this, objToFollow);
        }
    }
}