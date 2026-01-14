let game = {};

class SpaceDiscussion extends Phaser.Scene {
    height = 500;
    width = 1280;
    players = {};
    player;
    platforms;
    cursors;
    isCreated = false;

    constructor() {
        super('SpaceDiscussion');
    }

    preload() {
        this.load.setBaseURL("https://localhost:7243/img/game");
        this.load.image('sky', 'skies/sky.png');
        this.load.image('bg-mountain', 'sprites/bg-mountain.png'); // 932x183
        this.load.image('bg-tree', 'sprites/bg-tree.png'); // 519x197
        this.load.image('character', 'sprites/character.png');
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

    create(data) {
        this.physics.world.setBounds(0, 0, this.width, this.height);

        this.add.tileSprite(this.x(50), this.y(50), this.width, this.height, 'sky');

        this.addRandomImages('cloud', 12, 4, 0, this.width, 0, this.y(40));
        this.add.tileSprite(this.x(50), this.y(50), this.width, this.y(36.4), 'bg-mountain');
        this.add.tileSprite(this.x(50), this.y(70), this.width, this.y(39.4), 'bg-tree');
        this.addRandomImages('tree', 18, 4, 0, this.width, this.y(55), this.y(58));
        this.addRandomImages('grass', 18, 2, 0, this.width, this.y(78), this.height);
        var ground = this.add.tileSprite(this.x(50), this.height - 42, this.width, 84, 'ground');

        this.platforms = this.physics.add.existing(ground, 1);

        console.log(data);
        for (var i = 0; i < data.players.length; i++) {
            this.createPlayer(data.players[i]);
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

        for (let key in this.players) {
            if (this.players[key].state && this.hasReachedTarget(this.players[key]))
                this.players[key].body.stop();
        }
    }

    createPlayer(newPlayer) {
        if (newPlayer.roomType != 'User')
            return;
        var type = newPlayer.roomType == 'User' ? 'character' : 'dungeon';
        console.log('Creating ' + type + newPlayer.weight + ' ' + newPlayer.name + ' at ' + this.x(newPlayer.x));
        var player = this.physics.add.sprite(this.x(newPlayer.x), this.height - 180, type);
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.setOrigin(0.5, 1);
        player.body.setGravityY(300);
        player.setName(newPlayer.name);
        if (newPlayer.weight)
            player.scale = newPlayer.weight * 10;
        else
            player.body.setOffset(0, -15);

        this.players[newPlayer.name] = player;
        this.physics.add.collider(player, this.platforms);

        return player;
    }

    updateData(data) {
        if (!this.isCreated)
            return;

        for (var i = 0; i < data.players.length; i++) {
            var player = data.players[i];
            var existing = this.players[player.name];
            if (!existing) {
                existing = this.createPlayer(player);
            }
            else if (existing.state != this.x(player.x)) {
                console.log('Moving player ' + player.name + ' to ' + this.x(player.x));
                existing.state = this.x(player.x);
                this.physics.moveTo(existing, this.x(player.x), existing.y, 160);
            }
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

    hasReachedTarget(object) {
        var hasReached = object.body.velocity.x < 0 ? object.x < object.state : object.x > object.state;
        if (hasReached) {
            object.state = null;
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
        width: 1280,
        height: 500,
        scene: SpaceDiscussion,
        parent: 'game',
        physics: {
            default: 'arcade'
        }
    };

    game = new Phaser.Game(config);
    game.scene.start('SpaceDiscussion', data);
}

export function update(data) {
    if (game && game.scene.keys['SpaceDiscussion'])
        game.scene.keys['SpaceDiscussion'].updateData(data);
}