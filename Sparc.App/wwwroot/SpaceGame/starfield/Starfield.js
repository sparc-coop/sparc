import Textbox from './components/Textbox.js';
import Post from './components/Post.js';
import Facet from './components/Facet.js';
import User from './components/User.js';
import Answer from './components/Answer.js';
import Constellation from './components/Constellation.js';
import DefaultObject from './components/DefaultObject.js';
import Axis from './components/Axis.js';

export default class Starfield extends Phaser.Scene {
    height = 1000;
    width = 2560;
    objects = [];
    moving = [];
    isCreated = false;
    textbox;
    
    constructor() {
        super({ key: 'Starfield' });
    }

    preload() {
        this.load.setBaseURL("/SpaceGame/starfield");
        this.load.image('sky', 'skies/pixelart_starfield_1.png');
        this.load.image('star', 'sprites/star 1x.png');
        this.load.image('Post', 'sprites/star 4x.png');
        this.load.image('crosshair', 'sprites/crosshair094.png');
    }

    create(objects) {
        this.physics.world.setBounds(0, 0, this.width * 2, this.height * 2);

        this.add.tileSprite(this.x(50), this.y(50), this.width * 2, this.height * 2, 'sky');
        this.textbox = new Textbox(this, this.x(-0.95), this.y(0.3), this.width * 0.95, this.height * 0.3);

        this.isCreated = true;
        this.updateSpace(objects);
    }

    update() {
        for (let obj of this.moving) {
            if (obj.data.has('destination') && this.hasReachedTarget(obj)) {
                obj.body.stop();
                obj.data.remove('destination');
            }
        }

        this.moving = this.moving.filter(o => o.data.has('destination'));
    }

    updateSpace(objects) {
        if (!this.isCreated)
            return;
        
        this.objects = objects;
        objects.forEach(o => this.updateObject(o));

        // Delete sprites that are no longer present
        var noLongerPresent = this.children.list.filter(c => c.name && !objects.find(o => o.id == c.name));
        noLongerPresent.forEach(obj => obj.destroy());
    }

    updateObject(obj) {
        var gameObject = this.toGameObject(obj);

        // Move to new position
        var newX = this.x(obj.x);
        var newY = this.y(obj.y);
        var distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, newX, newY);
        
        if (distance > 0) {
            console.log('moving', gameObject, 'to', newX, newY);
            gameObject.setData('destination', { x: newX, y: newY });
            if (!this.moving.includes(gameObject))
                this.moving.push(gameObject);
            this.physics.moveTo(gameObject, newX, newY, distance / 2, 2000);
        }

        // Additional updates if defined
        if (gameObject.updateFromObject) {
            gameObject.updateFromObject(obj);
        }

        return gameObject;
    }

    toGameObject(obj) {
        var gameObject = this.children.getByName(obj.id);
        if (gameObject) {
            return gameObject;
        }
        
        switch (obj.type) {
            case 'Post':
                gameObject = new Post(this, obj);
                break;
            case 'Facet':
                gameObject = new Facet(this, obj);
                break;
            case 'Self':
            case 'User':
                gameObject = new User(this, obj);
                break;
            case 'X':
            case 'Y':
                gameObject = new Axis(this, obj);
                break;
            case 'Z':
                gameObject = new Answer(this, obj);
                break;
            case 'Constellation':
                gameObject = new Constellation(this, obj);
                break;
            default:
                gameObject = new DefaultObject(this, obj);
        }

        gameObject.setName(obj.id);
        this.physics.add.existing(gameObject);
        return gameObject;
    }

    x(percent) {
        if (Math.abs(percent) > 2)
            percent = percent / 100;
        return Math.floor(this.width / 2 * percent) + this.width / 2;
    }

    y(percent) {
        percent = -1 * percent;
        if (Math.abs(percent) > 2)
            percent = percent / 100;
        return Math.floor(this.height / 2 * percent) + this.height / 2;
    }

    hasReachedTarget(obj) {
        // If no destination set, consider reached
        if (!obj.data || !obj.data.has('destination'))
            return true;

        var destination = obj.getData('destination');

        // If there's no body/velocity treat as reached (guard)
        if (!obj.body || !obj.body.velocity)
            return true;

        // Tolerance in pixels to avoid precision/stutter issues
        const EPS = 1;

        const vx = obj.body.velocity.x;
        const vy = obj.body.velocity.y;

        // X axis reached?
        let reachedX = Math.abs(obj.x - destination.x) <= EPS;
        if (!reachedX) {
            if (vx > 0)
                reachedX = obj.x >= destination.x - EPS;
            else if (vx < 0)
                reachedX = obj.x <= destination.x + EPS;
        }

        // Y axis reached?
        let reachedY = Math.abs(obj.y - destination.y) <= EPS;
        if (!reachedY) {
            if (vy > 0)
                reachedY = obj.y >= destination.y - EPS;
            else if (vy < 0)
                reachedY = obj.y <= destination.y + EPS;
        }

        return reachedX && reachedY;
    }
}