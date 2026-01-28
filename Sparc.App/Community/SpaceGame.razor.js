let game = {};

class Starfield extends Phaser.Scene {
    height = 1000;
    width = 2560;
    sprites = {};
    isCreated = false;
    textBox;
    axes;

    constructor() {
        super('Starfield');
    }

    preload() {
        this.load.setBaseURL("/img/starfield");
        //this.load.setBaseURL("/img/starfield");
        this.load.image('sky', 'skies/pixelart_starfield_1.png');
        this.load.image('star', 'sprites/star 1x.png');
        this.load.image('Post', 'sprites/star 4x.png');
    }

    create(objects) {
        this.physics.world.setBounds(0, 0, this.width * 10, this.height * 10);
        this.add.tileSprite(this.x(50), this.y(50), this.width * 10, this.height * 10, 'sky');
        var box = this.add.rectangle(this.x(0), this.y(50), this.width * 0.92, this.height * 0.3, 0x000000);
        box.setStrokeStyle(3, 0xffffff, 1);
        box.setAlpha(0.85);
        box.setScrollFactor(0);
        box.setVisible(false);
        var text = this.make.text({
            x: this.x(-85),
            y: this.y(30),
            text: 'Test text',
            origin: { x: 0, y: 0 },
            style: {
                font: '48px DotGothic16',
                fill: 'white',
                wordWrap: { width: this.width * 0.85 }
            }
        });
        text.setScrollFactor(0);
        text.setVisible(false);
        this.textBox = { box: box, text: text, activeObject: null };

        this.axes = {
            x: {
                line: this.add.line(this.x(0), this.y(0), 0, 0, this.width * 10, 0, 0xffffff),
                leftLabel: this.make.text({
                    x: this.x(-0.85),
                    y: this.y(0),
                    text: '',
                    origin: { x: 0, y: 0 },
                    style: {
                        font: '36px DotGothic16',
                        fill: 'white'
                    },
                }),
                rightLabel: this.make.text({
                    x: this.x(0.85),
                    y: this.y(0),
                    text: '',
                    origin: { x: 1, y: 0 },
                    style: {
                        font: '36px DotGothic16',
                        fill: 'white'
                    },
                })
            },
            y: {
                line: this.add.line(this.x(0), this.y(0), 0, 0, 0, this.height * 10, 0xffffff),
                bottomLabel: this.make.text({
                    x: this.x(0.05),
                    y: this.y(0.85),
                    text: '',
                    origin: { x: 0, y: 0 },
                    style: {
                        font: '36px DotGothic16',
                        fill: 'white'
                    },
                }),
                topLabel: this.make.text({
                    x: this.x(0.05),
                    y: this.y(-0.85),
                    text: '',
                    origin: { x: 0, y: 0 },
                    style: {
                        font: '36px DotGothic16',
                        fill: 'white'
                    },
                })
            }
        };

        this.axes.x.leftLabel.setScrollFactor(0);
        this.axes.x.rightLabel.setScrollFactor(0);
        this.axes.y.topLabel.setScrollFactor(0);
        this.axes.y.bottomLabel.setScrollFactor(0);
        console.log('axes', this.axes);

        this.isCreated = true;
        this.updateSpace(objects);
    }

    updateSpace(objects) {
        console.log('updating', objects);
        if (!this.isCreated)
            return;

        for (var i = 0; i < objects.length; i++) {
            this.updateObject(objects[i]);
        }
    }

    update() {
        for (let key in this.sprites) {
            if (this.sprites[key].data.has('destination') && this.hasReachedTarget(this.sprites[key])) {
                this.sprites[key].body.stop();
                this.sprites[key].data.remove('destination');
                console.log('stopped ' + key);
            }
        }
    }

    getOrCreateObject(obj) {
        var sprite = this.sprites[obj.name];
        if (!sprite) {
            console.log('Creating ' + obj.type + ' ' + obj.name + ' at ' + this.x(obj.x) + ', ' + this.y(obj.y));
            sprite = obj.type == 'Post'
                ? this.physics.add.sprite(this.x(obj.x), this.y(obj.y), obj.type)
                : obj.type == 'Facet'
                    ? this.add.rectangle(this.x(obj.x), this.y(obj.y), 32, 32, 0xff0000)
                    : obj.type == 'Self'
                        ? this.add.rectangle(this.x(obj.x), this.y(obj.y), 32, 32, 0xffffff)
                        : obj.type == 'Quest'
                            ? this.add.rectangle(this.x(obj.x), this.y(obj.y), 32, 32, 0x0000ff)
                            : obj.type == 'Z'
                                ? this.add.star(this.x(obj.x), this.y(obj.y), 6, 16, 32, 0xffffff)
                : this.add.rectangle(this.x(obj.x), this.y(obj.y), 32, 32, 0xcccccc);

            sprite.setAlpha(obj.z ?? 1);
            sprite.setName(obj.name);
            sprite.setDataEnabled();
            this.sprites[obj.name] = sprite;
            this.physics.add.existing(sprite);

            if (obj.type == 'Self') {
                this.cameras.main.startFollow(sprite, false, 0.1, 0.1);
            }

            if (obj.type == 'Post') {
                sprite.setScale(2);
            }

            if (obj.name) {
                sprite.setInteractive().on('pointerdown', (pointer, x, y, ev) => this.showText(obj));
            }
        }

        return sprite;
    }

    showText(obj) {
        if (this.textBox.activeObject == obj) {
            this.textBox.box.setVisible(false);
            this.textBox.text.setVisible(false);
            this.textBox.activeObject = null;
        } else {
            this.textBox.text.setText(obj.name);
            this.textBox.box.setVisible(true);
            this.textBox.text.setVisible(true);
            this.textBox.activeObject = obj;
        }
    }

    updateObject(obj) {
        var sprite = this.getOrCreateObject(obj);
        if (sprite.data) {
            var newX = this.x(obj.x);
            var newY = this.y(obj.y);
            var distance = Phaser.Math.Distance.Between(sprite.x, sprite.y, newX, newY);
            var velocity = distance / 2;

            console.log('Moving ' + obj.type + ' ' + obj.name + ' from ' + sprite.x + ', ' + sprite.y + ' to ' + newX + ', ' + newY + '(distance ' + distance + ') at velocity ' + velocity);
            sprite.setData('destination', { x: newX, y: newY });
            this.physics.moveTo(sprite, newX, newY, velocity, 2000);
        }

        if (obj.type == 'X') {
            this.axes.x.rightLabel.setText(obj.summary?.rightTopic);
            this.axes.x.leftLabel.setText(obj.summary?.leftTopic);
            console.log('set x', obj.summary);
        }

        if (obj.type == 'Y') {
            this.axes.y.bottomLabel.setText(obj.summary?.rightTopic);
            this.axes.y.topLabel.setText(obj.summary?.leftTopic);
            console.log('set y', obj.summary);
        }

    }

    x(percent) {
        if (Math.abs(percent) > 2)
            percent = percent / 100;
        return Math.floor(this.width / 2 * percent) + this.width / 2;
    }

    y(percent) {
        if (Math.abs(percent) > 2)
            percent = percent / 100;
        return Math.floor(this.height / 2 * percent) + this.height / 2;
    }

    hasReachedTarget(obj) {
        if (!obj.data.has('destination'))
            return true;

        var destination = obj.getData('destination');
        var hasReached = 
            (obj.body.velocity.x < 0 ? obj.x < destination.x : obj.x > destination.x)
            && (obj.body.velocity.y < 0 ? obj.y < destination.y : obj.y > destination.y);

        //console.log('hasReached', obj.body.velocity.x, obj.x, destination.x, obj.body.velocity.y, obj.y, destination.y, hasReached);
        return hasReached;
    }
}

class Planet extends Phaser.Scene {
    height = 1000;
    width = 2560;
    sprites = {};
    player;
    platforms;
    cursors;
    isCreated = false;
    space;

    constructor() {
        super('SpaceDiscussion');
    }

    preload() {
        this.load.setBaseURL("https://localhost:7243/img/planet");
        this.load.image('sky', 'skies/sky.png');
        this.load.image('bg-mountain', 'sprites/bg-mountain.png'); // 932x183
        this.load.image('bg-tree', 'sprites/bg-tree.png'); // 519x197
        this.load.image('User', 'sprites/character.png');
        this.load.image('ground', 'sprites/ground.png'); // 579x84
        this.load.image('long-tree', 'sprites/long-tree.png');
        this.load.image('tree_4', 'sprites/two-tree.png');
        this.load.image('dungeon', 'sprites/dungeon.png');

        for (var i = 1; i <= 4; i++)
            this.load.image('cloud_' + i, 'sprites/cloud_' + i + '.png');

        for (var j = 1; j <= 2; j++)
            this.load.image('grass_' + j, 'sprites/grass_' + j + '.png');

        for (var k = 1; k <= 3; k++)
            this.load.image('tree_' + k, 'sprites/tree_' + k + '.png');
    }

    create(space) {
        this.physics.world.setBounds(0, 0, this.width, this.height);

        this.add.tileSprite(this.x(50), this.y(50), this.width, this.height, 'sky');

        this.addRandomImages('cloud', 12, 4, 0, this.width, 0, this.y(40));
        this.add.tileSprite(this.x(50), this.y(50), this.width, this.y(36.4), 'bg-mountain');
        this.add.tileSprite(this.x(50), this.y(70), this.width, this.y(39.4), 'bg-tree');
        this.addRandomImages('tree', 18, 4, 0, this.width, this.y(55), this.y(58));
        this.addRandomImages('grass', 18, 2, 0, this.width, this.y(78), this.height);
        var ground = this.add.tileSprite(this.x(50), this.height - 42, this.width, 84, 'ground');

        this.platforms = this.physics.add.existing(ground, 1);

        console.log(space);
        this.space = space;

        for (var i = 0; i < this.space.linkedSpaces.length; i++) {
            this.createObject(this.space.linkedSpaces[i]);
        }

        this.add.image(this.x(23), this.y(44), 'long-tree');
        //this.add.image(this.x(75), this.y(44), 'long-tree');

        //this.cursors = this.input.keyboard.createCursorKeys();

        var camera = this.cameras.main;
        camera.setBounds(0, 0, this.width, this.height);
        camera.setDeadzone(400, 0);
        camera.setFollowOffset(0, 0);

        this.isCreated = true;

        //var platforms = this.physics.add.staticGroup();
        //platforms.create(0, this.height - 42, 'ground');
    }

    update() {
        //if (this.cursors.left.isDown)
        //    this.player.setVelocityX(-320);
        //else if (this.cursors.right.isDown)
        //    this.player.setVelocityX(320);
        //else
        //    this.player.setVelocityX(0);

        //if (this.cursors.up.isDown && this.player.body.touching.down)
        //    this.player.setVelocityY(-160);

        for (let key in this.sprites) {
            if (this.sprites[key].state && this.hasReachedTarget(this.sprites[key]))
                this.sprites[key].body.stop();
        }
    }

    createObject(obj) {
        if (obj.type != 'User')
            return;

        console.log('Creating ' + obj.type + ' ' + obj.name + ' at ' + this.x(obj.x));
        var sprite = this.physics.add.sprite(this.x(obj.x), this.height - 180, obj.type);
        sprite.setBounce(0.2);
        sprite.setCollideWorldBounds(true);
        sprite.setOrigin(0.5, 1);
        sprite.body.setGravityY(300);
        sprite.setName(obj.name);

        if (obj.weight)
            sprite.scale = obj.weight * 10;
        else
            sprite.body.setOffset(0, -15);

        this.sprites[obj.name] = sprite;
        this.physics.add.collider(sprite, this.platforms);

        return sprite;
    }

    updateObject(obj) {
        var existing = this.sprites[obj.name];
        if (!existing) {
            existing = this.createObject(obj);
        }
        else if (existing.state != this.x(obj.x)) {
            existing.state = this.x(obj.x);
            var distance = Phaser.Math.Distance.Between(existing.x, existing.y, this.x(obj.x), this.y(obj.y));
            console.log('Moving ' + obj.type + ' ' + obj.name + ' to ' + this.x(obj.x) + ' at velocity ' + distance / 2);
            this.physics.moveTo(existing, this.x(obj.x), existing.y, 160, distance / 2);
        }
    }

    updateSpace(space) {
        if (!this.isCreated)
            return;

        this.space = space;

        for (var i = 0; i < this.space.linkedSpaces.length; i++) {
            this.updateObject(this.space.linkedSpaces[i]);
        }
    }

    x(percent) {
        percent = Math.abs(percent);
        if (percent > 2)
            percent = percent / 100;
        return Math.floor(this.width * percent);
    }

    y(percent) {
        if (percent > 1)
            percent = percent / 100;
        return Math.floor(this.height * percent);
    }

    hasReachedTarget(obj) {
        var hasReached = obj.body.velocity.x < 0 ? obj.x < obj.state : obj.x > obj.state;
        if (hasReached) {
            obj.state = null;
            return true;
        }

        return false;
    }

    randomPosition(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    randomImg(name, max) {
        return name + '_' + (Math.floor(Math.random() * max) + 1);
    }

    addRandomImages(name, count, total, minX, maxX, minY, maxY) {
        for (var i = 0; i < count; i++)
            this.add.image(this.randomPosition(minX, maxX), this.randomPosition(minY, maxY), this.randomImg(name, total));
    }
}

export function start(data) {

    const config = {
        type: Phaser.AUTO,
        width: 2560,
        height: 1000,
        scene: Starfield,
        parent: 'game',
        backgroundColor: '#000000',
        physics: {
            default: 'arcade'
        }
    };

    game = new Phaser.Game(config);
    game.scene.start('Starfield', data);
}

export function update(space) {
    if (game && game.scene.keys['Starfield'])
        game.scene.keys['Starfield'].updateSpace(space);
}