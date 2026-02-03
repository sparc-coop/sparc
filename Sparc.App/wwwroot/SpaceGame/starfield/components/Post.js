import ConstellationConnector from './ConstellationConnector.js';

export default class Post extends Phaser.GameObjects.Sprite {
    connector;
    
    constructor(scene, obj) {
        super(scene, scene.x(obj.x), scene.y(obj.y), 'Post');

        this.setAlpha(obj.z ?? 1);
        this.setName(obj.id);
        this.setDepth(4);
        this.setScale(obj.z * 2);
        this.setDataEnabled();
        this.setInteractive().on('pointerdown', () => this.scene.textbox.show(obj));

        console.log('Post created', scene.x(obj.x), scene.x(obj.y), obj.z);

        scene.add.existing(this);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }

    updateFromObject(obj) {
        this.setAlpha(obj.z ?? 1);
        this.setScale(obj.z * 2);

        if (this.connector)
            this.connector.destroy();

        if (obj.connectTo) {
            var to = this.scene.objects.find(x => x.id == obj.connectTo);
            if (to)
                this.connector = new ConstellationConnector(this.scene, this, to);
        }
    }
}