import UserTrail from './UserTrail.js';
import Crosshair from './Crosshair.js';

export default class Self extends Phaser.GameObjects.Sprite {
    trails = [];
    constructor(scene, obj) {
        super(scene, scene.x(obj), scene.y(obj), 'ship');

        this.setScale(1);
        this.setDepth(8);

        var crosshair = new Crosshair(scene, obj);

        var userTrails = this.scene.getAllInGameState('userTrails', x => x.userId == obj.id);
        userTrails.forEach(x => this.trails.push(new UserTrail(scene, x)));

        this.updateFromObject(obj);
        scene.add.existing(this);
    }

    updateFromObject(obj) {
        var userTrails = this.scene.getAllInGameState('userTrails', x => x.userId == obj.id);
        userTrails.forEach(x => {
            var existing = this.trails.find(t => t.name == x.id);
            if (existing)
                existing.updateFromObject(x);
            else {
                console.log('trail not found');
                var newTrail = new UserTrail(this.scene, x);
                this.trails.push(newTrail);
            }
        });

        var lastPosition = userTrails.length > 1 ? userTrails[userTrails.length - 2] : null;

        if (lastPosition) {
            var rad = Phaser.Math.Angle.Between(this.scene.x(lastPosition), this.scene.y(lastPosition), this.scene.x(obj), this.scene.y(obj));
            this.setRotation(rad + Math.PI / 2);
        }

        console.log('self is at', this.x, this.y);
    }
}