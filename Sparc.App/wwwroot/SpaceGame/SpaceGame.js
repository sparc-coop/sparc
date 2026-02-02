import Starfield from './starfield/Starfield.js';

let game;

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
