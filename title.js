//Title Scene
export class SceneTitle extends Phaser.Scene {

	constructor() {
		super({key: 'SceneTitle'});
	}

	preload() {


	}

	create() {
        console.log('SceneTitle START');
        var config = this.game.config;
		//Game Title
		let title = this.add.text(config.width / 2, config.height / 3 * 1, 'TITLE', {font: '40px Arial'}).setOrigin(0.5);

		//Start Button
		let start = this.add.text(config.width / 2, config.height / 3 * 2, 'START', {font: '20px Arial'}).setInteractive().setOrigin(0.5).setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

		start.on('pointerdown', function(pointer) {
            console.log('SceneTitle END');
			this.scene.start('SceneGame');
		}, this);

	}

}