import Textbox from './components/Textbox.js';
import Post from './components/Post.js';
import Facet from './components/Facet.js';
import User from './components/User.js';
import Self from './components/Self.js';
import NorthStar from './components/NorthStar.js';
import Constellation from './components/Constellation.js';
import DefaultObject from './components/DefaultObject.js';
import Quest from './components/Quest.js';
import Hint from './components/Hint.js';
import UserTrail from './components/UserTrail.js';
import Crosshair from './components/Crosshair.js';

export default class Starfield extends Phaser.Scene {
    height = 1000;
    width = 2560;
    isCreated = false;
    textbox;
    crosshair;
    gameState;
    selectedId = null;

    constructor() {
        super({ key: 'Starfield' });
    }

    preload() {
        this.load.setBaseURL("/SpaceGame/starfield");
        this.load.image('sky', 'skies/pixelart_starfield_1.png');
        this.load.image('star', 'sprites/star 1x.png');
        this.load.image('Post', 'sprites/star 4x.png');
        this.load.image('crosshair', 'sprites/crosshair094.png');
        this.load.image('ship', 'sprites/ship.png');
        this.load.image('north', 'sprites/north.png');
        this.load.plugin('rexeasemoveplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexeasemoveplugin.min.js', true);
    }

    create(data) {
        this.physics.world.setBounds(0, 0, this.width * 5, this.height * 5);
        this.cameras.main.setBounds(0, 0, this.width * 5, this.height * 5);

        this.add.tileSprite(this.x(50), this.y(50), this.width * 5, this.height * 5, 'sky');
        this.textbox = new Textbox(this, this.x(-0.95), this.y(0.3), this.width * 0.95, this.height * 0.3);

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const zoomFactor = 0.001;
            var newZoom = this.cameras.main.zoom + deltaY * zoomFactor * -1;
            // clamp
            newZoom = Phaser.Math.Clamp(newZoom, 0.4, 2);
            this.cameras.main.setZoom(newZoom);
        });

        this.isCreated = true;
        this.updateSpace(data);
    }

    update() {
    }

    updateSpace(data) {
        if (!this.isCreated || !data)
            return;

        this.gameState = data;

        var objects = [...data.headspaces, ...data.posts, ...data.facets, ...data.constellations];

        // Set home position to self if available
        var self = this.find('Headspace', data.headspace.id);
        if (self) {
            self._type = 'Self';
            objects.push({ id: 'Crosshair', _type: 'Crosshair', coordinates: self.coordinates, ref: 'Self' });
        }

        console.log('updating space', data, objects);
        objects.forEach(o => this.updateObject(o));

        // Delete sprites that are no longer present
        var noLongerPresent = this.children.list.filter(c => c.name && !objects.find(o => o.id == c.name));
        noLongerPresent.forEach(obj => obj.destroy());

        if (this.selectedId)
            this.select(this.selectedId);
    }

    find(type, id) {
        return this.children.list.find(o => (!type || o.constructor.name == type) && (!id || o.name == id));
    }

    findInGameState(type, id) {
        return this.gameState.find(o => (!type || o._type == type) && (!id || o.id == id));
    }

    getAll(type, filter) {
        return this.children.list.filter(o => (!type || o.constructor.name == type) && (!filter || filter(o)));
    }

    getAllInGameState(type, filter) {
        return this.gameState.filter(o => (!type || o._type == type) && (!filter || filter(o)));
    }

    select(id) {
        var crosshair = this.find('Crosshair');
        if (!crosshair) {
            var self = this.find('Self');
            crosshair = new Crosshair(this, self);
        }

        crosshair.select(id);
    }

    updateObject(obj, inXSeconds) {
        var gameObject = this.getOrCreateObject(obj);

        this.moveObject(gameObject, obj, inXSeconds);

        // Additional updates if defined
        if (gameObject.updateFromObject) {
            gameObject.updateFromObject(obj);
        }

        return gameObject;
    }

    moveObject(gameObject, newObj, inXSeconds) {
        if (gameObject.scrollFactorX == 0)
            return;

        var newX = this.x(newObj);
        var newY = this.y(newObj);

        var distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, newX, newY);
        if (distance <= 0)
            return;

        this.plugins.get('rexeasemoveplugin').moveTo(gameObject, inXSeconds ?? 300, newX, newY, 'Cubic');
    }

    getOrCreateObject(obj) {
        var gameObject = this.children.getByName(obj.id);
        if (gameObject) {
            return gameObject;
        }

        switch (obj._type) {
            case 'Post':
            case 'Guide':
                gameObject = new Post(this, obj);
                break;
            case 'Facet':
                gameObject = new Facet(this, obj);
                break;
            case 'Self':
                gameObject = new Self(this, obj);
                break;
            case 'User':
                gameObject = new User(this, obj);
                break;
            case 'Quest':
                gameObject = new Quest(this, obj);
                break;
            case 'Space':
                gameObject = new NorthStar(this, obj);
                break;
            case 'Constellation':
                gameObject = new Constellation(this, obj);
                break;
            case 'Hint':
            case 'Answer':
                gameObject = new Hint(this, obj);
                break;
            default:
                gameObject = new DefaultObject(this, obj);
        }

        gameObject.setName(obj.id);
        this.physics.add.existing(gameObject);
        return gameObject;
    }

    x(obj) {
        var coordinate = typeof (obj) == 'object'
            ? obj.coordinates ? obj.coordinates.vector[0] : obj.x 
            : obj;

        if (Math.abs(coordinate) > 2)
            coordinate = coordinate / 100;

        var rawX = Math.floor(this.width / 2 * coordinate) + this.width / 2;
        return rawX;
    }

    y(obj) {
        var coordinate = typeof obj === 'object'
            ? obj.coordinates ? obj.coordinates.vector[1] : obj.y
                : obj;

        coordinate = -1 * coordinate;
        if (Math.abs(coordinate) > 2)
            coordinate = coordinate / 100;
        return Math.floor(this.height / 2 * coordinate) + this.height / 2;
    }

    z(obj) {
        var coordinate = typeof obj === 'object'
            ? obj.coordinates ? obj.coordinates.vector.length > 2 ? obj.coordinates.vector[2] : 1
        : obj.alpha
            : obj;

        return coordinate;
    }

    hasReachedTarget(obj, destination) {
        // If no destination set, consider reached
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

    zoomToFit() {
        var posts = this.children.list.filter(c => c instanceof Post || c instanceof Facet || c instanceof User);
        var minX = Math.min(...posts.map(p => p.x));
        var maxX = Math.max(...posts.map(p => p.x));
        var minY = Math.min(...posts.map(p => p.y));
        var maxY = Math.max(...posts.map(p => p.y));
        var zoom = Math.max(this.width / (maxX - minX + this.width / 10), this.height / (maxY - minY + this.height / 10), 1);
        console.log('zooming to', posts, minX, maxX, minY, maxY, zoom);
        this.cameras.main.setZoom(zoom);
    }

    updateAxes() {
        var destination = [{ x: gameObject.x, y: this.y(0) }, { x: newX, y: this.y(0) }, { x: newX, y: newY }];

        for (let obj of this.moving) {
            if (obj.data.has('destination')) {
                var destination = obj.getData('destination');
                if (destination.length && this.hasReachedTarget(obj, destination[0])) {
                    destination.shift();
                    if (destination.length)
                        this.plugins.get('rexeasemoveplugin').moveTo(obj, 300, destination[0].x, destination[0].y, 'Cubic');
                    else {
                        obj.body.stop();
                        obj.data.remove('destination');
                    }
                }
            }
        }

        this.moving = this.moving.filter(o => o.data.has('destination'));
    }
}