import UserTrail from './UserTrail.js';
import Crosshair from './Crosshair.js';

export default class Self extends Phaser.GameObjects.Sprite {
    trails = [];
    gravity;

    constructor(scene, obj) {
        super(scene, scene.x(obj), scene.y(obj), 'orb');

        this.setScale(1);
        this.setDepth(8);
        this.setAngle(-180);

        var crosshair = new Crosshair(scene, obj);

        var userTrails = this.scene.getAllInGameState('userTrails', x => x.userId == obj.id);
        userTrails.forEach(x => this.trails.push(new UserTrail(scene, x)));

        this.updateFromObject(obj);
        scene.add.existing(this);
        scene.tweens.add({
            targets: this,
            repeat: -1,
            duration: 5000,
            angle: 180
        });
    }

    drawGravity(obj) {
        if (this.gravity)
            this.gravity.destroy();

        var vec = obj.coordinates.vector;

        if (vec.length < 4)
            return;

        var x2 = this.scene.x(vec[3]) - this.x;
        var y2 = this.scene.y(vec[4]) - this.y;

        this.gravity = this.scene.add.line(this.x, this.y, 0, 0, x2, y2, 0xffffff);
        this.gravity.setOrigin(0, 0).setDepth(1).setAlpha(0.1);
        console.log('gravity line', this.x, this.y, x2, y2);
    }

    updateFromObject(obj) {
        var userTrails = this.scene.getAllInGameState('userTrails', x => x.userId == obj.id);
        userTrails.forEach(x => {
            var existing = this.trails.find(t => t.name == x.id);
            if (existing)
                existing.updateFromObject(x);
            else {
                var newTrail = new UserTrail(this.scene, x);
                this.trails.push(newTrail);
            }
        });

        this.drawGravity(obj);

        var lastPosition = userTrails.length > 1 ? userTrails[userTrails.length - 2] : null;

        if (lastPosition) {
            var rad = Phaser.Math.Angle.Between(this.scene.x(lastPosition), this.scene.y(lastPosition), this.scene.x(obj), this.scene.y(obj));
            this.setRotation(rad + Math.PI / 2);
        }
    }
}