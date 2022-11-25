//変数
let Game = {};
let Data = {};

//Game Size
Game.width = 800;
Game.height = 400;

//Title_Scene
class Title_Scene extends Phaser.Scene {

	constructor() {
		super({
			key: 'Title_Scene'
		});
	}

	preload() {


	}

	create() {
		//Game Title
		let title = this.add.text(Game.width / 2, Game.height / 3 * 1, 'GAME TITLE', {font: '40px Arial'}).setOrigin(0.5);

		//Start Button
		let start = this.add.text(Game.width / 2, Game.height / 3 * 2, 'START', {font: '20px Arial'}).setInteractive().setOrigin(0.5).setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

		start.on('pointerdown', function(pointer) {
			this.scene.start('Game_Scene');
		}, this);

	}

}

//Game Scene
class Game_Scene extends Phaser.Scene {

	constructor() {
		super({key: 'Game_Scene'});
	}

	preload() {

	}

	create() {

	}

	update() {

	}

}


//config
let config = {
	type: Phaser.AUTO,
	parent: 'canvas',
	width: Game.width,
	height: Game.height,
	pixelArt: true,
	scale: {
        	mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 300
			}
		}
	},
	scene: [Title_Scene, Game_Scene]
};

let game = new Phaser.Game(config);
