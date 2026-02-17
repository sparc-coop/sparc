import UserTrail from './UserTrail.js';
import Crosshair from './Crosshair.js';

export default class Self extends Phaser.GameObjects.Sprite {
    trails = [];
    constructor(scene, obj) {
        super(scene, scene.x(obj), scene.y(obj), 'ship');

        this.setScale(1);
        this.setDepth(8);
        this.updateFromObject(obj);
        scene.add.existing(this);

        console.log('creating self', obj, this);

        var crosshair = new Crosshair(scene, obj);

        var userTrails = this.scene.getAllInGameState('userTrails', x => x.userId == obj.id);
        userTrails.forEach(x => this.trails.push(new UserTrail(scene, x)));
    }

    updateFromObject(obj) {
        var userTrails = this.scene.getAllInGameState('userTrails', x => x.userId == obj.id);
        if (userTrails.length)
            this.trails.push(new UserTrail(this.scene, userTrails[userTrails.length - 1]));

        var lastPosition = userTrails.length > 1 ? userTrails[userTrails.length - 2] : null;

        if (lastPosition) {
            var rad = Phaser.Math.Angle.Between(this.scene.x(lastPosition), this.scene.y(lastPosition), this.scene.x(obj), this.scene.y(obj));
            this.setRotation(rad + Math.PI / 2);
        }
    }
}