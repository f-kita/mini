import { Player }  from './player.js'

//Game Scene
export class SceneGame extends Phaser.Scene {

    constructor() {
        super({key: 'SceneGame'});
    }

    player;
    stars;
    bombs;
    platforms;
//    cursors;
    score = 0;
    gameOver = false;
    scoreText;


    preload ()
    {
        console.log('SceneGame');
        this.load.image('field', 'assets/field.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('ground_v', 'assets/platform_v.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');


        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.anims.create([{
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        },{
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        },{
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        }]);
    }

    create ()
    {
        console.log('SceneTitle START');
        //this.cameras.main.zoom = 0.5;
        const w = {w:596, h:900};
        const c = {w:w.w/2, h:w.h/2};
        //  A simple background for our game
//        this.add.image(c.w, c.h, 'field');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
//        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        //  Now let's create some ledges
        //this.platforms.create(50, 50, 'ground');
        //this.platforms.create(height-16, 50, 'ground');
        //this.platforms.create(300, 50-32, 'ground');

        //this.platforms.create(50, 750, 'ground');
        //this.platforms.create(550, 750, 'ground');
        //this.platforms.create(300, 750+32, 'ground');
/*
        this.platforms.create(0, 200, 'ground_v');
        this.platforms.create(0, 600, 'ground_v');
        this.platforms.create(600, 200, 'ground_v');
        this.platforms.create(600, 600, 'ground_v');
*/
        //this.platforms.children.iterate(function (child) {
        //    child.refreshBody();
        //});

        const positions = [
            {x: w.w/2,      y: w.h/2/3/2},
            {x: w.w/3,      y: w.h/2/2},
            {x: w.w/3*2,    y: w.h/2/2},
        ];

        const teamA=[
            {s:500, a:500},
            {s:500, a:500},
            {s:500, a:500},
        ];
        const teamB=[
            {s:500, a:500},
            {s:500, a:500},
            {s:500, a:500},
        ];

        this.players = this.physics.add.group();
        this.players.runChildUpdate = true;

        // The player and its settings
        teamA.forEach((p, i) =>{
            new Player(this, this.players, 'dude', p.s, p.a, positions[i].x, positions[i].y);
        });
        teamB.forEach((p, i) =>{
            new Player(this, this.players, 'dude', p.s, p.a, positions[i].x, w.h-positions[i].y);
        });
        
        
        this.ball = this.physics.add.sprite(c.w, c.h, 'bomb').setInteractive();
        this.ball.setBounce(1);
        this.ball.setCircle(true);
        this.ball.setCollideWorldBounds(true);

        this.ball.allowGravity = false;

        //  The score
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //  Collide the player and the stars with the platforms
        //this.physics.add.collider(this.players, this.platforms);
        //this.physics.add.collider(this.ball, this.platforms);
        this.physics.add.collider(this.ball, this.players);
        this.physics.add.collider(this.players);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        //this.physics.add.overlap(this.players, this.stars, this.collectStar, null, this);

        //this.physics.add.collider(this.players, this.players, this.hit, null, this);
        //this.physics.add.collider(this.players, this.physics.world, this.hit, null, this);
    }

    update ()
    {
        if (this.gameOver)
        {
            console.log('SceneGame END');
			this.scene.start('SceneTitle');
            return;
        }

    }
    hit (a, b)
    {
        a.setTint(0xff0000);
        b.setTint(0xff0000);
    }

    inGoal (ball, goal)
    {
        //  Add and update the score
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);

        if (this.stars.countActive(true) === 0)
        {
            //  A new batch of stars to collect
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        }
    }

    hitBall (player, bomb)
    {
        
    }
}