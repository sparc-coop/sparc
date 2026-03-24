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
        var quest = this.scene.getAll('QuestPath', x => x.userId == obj.id);
        quest.forEach(x => x.updateFromObject(obj));
    }
}