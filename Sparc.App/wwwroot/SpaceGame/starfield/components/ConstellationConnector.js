export default class ConstellationConnector extends Phaser.GameObjects.Line {
    constructor(scene, from, to) {
        super(scene, from.x, from.y, 0, 0, scene.x(to.x) - from.x, scene.y(to.y) - from.y, 0xffffff, 0.3);
        
        this.setOrigin(0, 0);
        this.setLineWidth(5);
        this.setDepth(3);
        
        scene.add.existing(this);
    }
}