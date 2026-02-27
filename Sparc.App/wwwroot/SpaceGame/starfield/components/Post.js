import ConstellationConnector from './ConstellationConnector.js';

export default class Post extends Phaser.GameObjects.Sprite {
    gravity;
    
    constructor(scene, obj) {
        super(scene, scene.x(obj), scene.y(obj), 'asteroid');

        this.setName(obj.id);
        this.setDepth(4);
        this.setDataEnabled();
        this.setInteractive().on('pointerdown', () => this.scene.dotnet.invokeMethodAsync('SelectGameObject', obj.id));

        scene.add.existing(this);

        this.updateFromObject(obj);
    }

    drawGravity(obj) {
        var vec = obj.coordinates.vector;

        if (vec.length < 4)
            return;

        var x2 = this.scene.x(vec[3]) - this.x;
        var y2 = this.scene.y(vec[4]) - this.y;

        this.gravity = this.scene.add.line(this.x, this.y, 0, 0, x2, y2, 0xffffff);
        this.gravity.setOrigin(0, 0).setDepth(1).setAlpha(0.1);
        console.log('gravity line', this.x, this.y, x2, y2);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }

    updateFromObject(obj) {
        //this.setAlpha(this.scene.z(obj));
        this.setScale(this.scene.z(obj));

        if (this.gravity)
            this.gravity.destroy();

        this.drawGravity(obj);
        //if (obj.connectTo) {
        //    var to = this.scene.find(null, obj.connectTo);
        //    if (to)
        //        this.connector = new ConstellationConnector(this.scene, this, to);
        //}
    }
}