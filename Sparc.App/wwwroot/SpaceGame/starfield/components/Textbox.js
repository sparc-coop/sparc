export default class Textbox extends Phaser.GameObjects.Group {
    box;
    text;
    activeObject = null;

    constructor(scene, x, y, width, height) {
        super(scene);
        this.box = this.createBox(x, y, width, height);
        this.text = this.createText(x, y);
        
        this.add(this.box);
        this.add(this.text);
        this.setVisible(false);
    }

    createBox(x, y, width, height) {
        const box = this.scene.add.rectangle(x, y, width, height, 0x000000);
        box.setOrigin(0, 0);
        box.setStrokeStyle(5, 0xffffff, 1);
        box.setAlpha(0.85);
        box.setScrollFactor(0);
        return box;
    }

    createText(x, y) {
        const text = this.scene.make.text({
            x: x + 32,
            y: y + 32,
            text: 'Test text',
            origin: { x: 0, y: 0 },
            style: {
                font: '48px DotGothic16',
                fill: 'white',
                wordWrap: { width: this.box.width * 0.85 }
            }
        });
        text.setScrollFactor(0);
        return text;
    }

    show(obj) {
        if (this.activeObject == obj) {
            this.setVisible(false);
            this.activeObject = null;
        } else {
            this.text.setText(obj.name);
            this.setVisible(true);
            this.activeObject = obj;
        }
    }
}