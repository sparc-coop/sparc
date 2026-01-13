class SparcGame extends Phaser.Scene {
    height = 500;
    width = 1280 * 3;
    player;
    platforms;
    cursors;

    preload() {
        this.load.setBaseURL("https://localhost:7243/img/game");
        this.load.image('sky', 'skies/sky.png');
        this.load.image('bg-mountain', 'sprites/bg-mountain.png'); // 932x183
        this.load.image('bg-tree', 'sprites/bg-tree.png'); // 519x197
        this.load.image('character', 'sprites/character.png');
        this.load.image('ground', 'sprites/ground.png'); // 579x84
        this.load.image('long-tree', 'sprites/long-tree.png');
        this.load.image('tree_4', 'sprites/two-tree.png');

        for (var i = 1; i <= 4; i++)
            this.load.image('cloud_' + i, 'sprites/cloud_' + i + '.png');

        for (var j = 1; j <= 2; j++)
            this.load.image('grass_' + j, 'sprites/grass_' + j + '.png');

        for (var k = 1; k <= 3; k++)
            this.load.image('tree_' + k, 'sprites/tree_' + k + '.png');
    }

    create() {
        this.physics.world.setBounds(0, 0, this.width, this.height);

        this.add.tileSprite(this.width / 2, this.height / 2, this.width, 500, 'sky');

        this.addRandomImages('cloud', 12, 4, 0, this.width, 0, 200);
        this.add.tileSprite(this.width / 2, this.height / 2, this.width, 182, 'bg-mountain');
        this.add.tileSprite(this.width / 2, this.height * 0.7, this.width, 197, 'bg-tree');
        this.addRandomImages('tree', 18, 4, 0, this.width, this.height * 0.55, this.height * 0.58);
        this.addRandomImages('grass', 18, 2, 0, this.width, this.height - 110, this.height);
        var ground = this.add.tileSprite(640, this.height - 42, this.width * 2, 84, 'ground');

        this.platforms = this.physics.add.existing(ground, 1);

        this.player = this.physics.add.sprite(0, 320, 'character');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(300);
        this.player.body.setOffset(0, -15);

        this.physics.add.collider(this.player, this.platforms);

        this.add.image(300, this.height - 280, 'long-tree');
        this.add.image(1000, this.height - 280, 'long-tree');

        this.cursors = this.input.keyboard.createCursorKeys();

        var camera = this.cameras.main;
        camera.setBounds(0, 0, this.width, 500);
        camera.startFollow(this.player);
        camera.setDeadzone(400, 0);
        camera.setFollowOffset(0, 0);

        //var platforms = this.physics.add.staticGroup();
        //platforms.create(0, this.height - 42, 'ground');
    }

    update() {
        if (this.cursors.left.isDown)
            this.player.setVelocityX(-320);
        else if (this.cursors.right.isDown)
            this.player.setVelocityX(320);
        else
            this.player.setVelocityX(0);

        if (this.cursors.up.isDown && this.player.body.touching.down)
            this.player.setVelocityY(-80);
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

function startGame() {

    const config = {
        type: Phaser.AUTO,
        width: 1280,
        height: 500,
        scene: SparcGame,
        parent: 'game',
        physics: {
            default: 'arcade'
        }
    };

    const game = new Phaser.Game(config);
}