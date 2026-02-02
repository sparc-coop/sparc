export default class Constellation extends Phaser.GameObjects.Text {
    constructor(scene, obj) {
        super(scene, scene.x(obj.x), scene.y(obj.y), obj.summary?.name ?? '', {
            font: '36px DotGothic16',
            fill: 'white',
            wordWrap: { width: scene.width * 0.85 }
        });
        this.setOrigin(0, 0);
        scene.add.existing(this);
    }
}