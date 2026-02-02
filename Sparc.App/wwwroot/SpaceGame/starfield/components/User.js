export default class User extends Phaser.GameObjects.Rectangle {
    constructor(scene, obj) {
        super(scene, scene.x(obj.x), scene.y(obj.y), 32, 32, obj.type == 'Self' ? 0xffffff : 0xcccccc);

        if (obj.type == 'Self') {
            scene.cameras.main.startFollow(this, false, 0.1, 0.1);
            console.log('Camera following user', this.x, this.y);
        }

        scene.add.existing(this);
    }
}