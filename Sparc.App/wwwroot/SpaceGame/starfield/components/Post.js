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
        if (obj.coordinates.length < 4)
            return;

        gravity = this.add.graphics({
            x: this.x,
            y: this.y
        });

        gravity.lineStyle(4, 0xffffff, 0.5);
        gravity.lineTo(this.scene.x(obj.coordinates[3]), this.scene.y(obj.coordinates[4]));
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }

    updateFromObject(obj) {
        this.setAlpha(this.scene.z(obj));
        this.setScale(this.scene.z(obj));

        console.log('z', this.scene.z(obj));

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