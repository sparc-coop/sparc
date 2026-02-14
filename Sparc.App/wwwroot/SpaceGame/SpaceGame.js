import Starfield from './starfield/Starfield.js';

let game;

export function start(data) {
    const config = {
        type: Phaser.AUTO,
        scene: Starfield,
        parent: 'game',
        backgroundColor: '#000000',
        physics: {
            default: 'arcade'
        },
        scale: {
            mode: Phaser.Scale.EXPAND,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            width: 1280,
            height: 1280 * 9 / 16,
            parent: 'game'
        }
    };

    game = new Phaser.Game(config);
    game.scene.start('Starfield', data);
}

export function update(data, dotnet) {
    if (game && game.scene.keys['Starfield']) {
        game.scene.keys['Starfield'].updateSpace(data);
        game.scene.keys['Starfield'].dotnet = dotnet;
    }
}

export function select(id) {
    if (game && game.scene.keys['Starfield'])
        game.scene.keys['Starfield'].select(id);
}
