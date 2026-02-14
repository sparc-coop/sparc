import ConstellationConnector from './ConstellationConnector.js';

export default class Post extends Phaser.GameObjects.Sprite {
    connector;
    
    constructor(scene, obj) {
        super(scene, scene.x(obj), scene.y(obj), 'Post');

        this.setName(obj.id);
        this.setDepth(4);
        this.setDataEnabled();
        this.setInteractive().on('pointerdown', () => this.scene.dotnet.invokeMethodAsync('SelectGameObject', obj.id));

        scene.add.existing(this);

        this.updateFromObject(obj);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }

    updateFromObject(obj) {
        this.setAlpha(this.scene.z(obj));
        this.setScale(this.scene.z(obj) * 4);

        if (this.connector)
            this.connector.destroy();

        if (obj.connectTo) {
            var to = this.scene.objects.find(x => x.id == obj.connectTo);
            if (to)
                this.connector = new ConstellationConnector(this.scene, this, to);
        }
    }
}