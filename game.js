import { Player }  from './player.js'
import { Ball }  from './ball.js'

//Game Scene
export class SceneGame extends Phaser.Scene {

    constructor() {
        super({key: 'SceneGame'});
    }

    scoreMy = 0;
    scoreEnemy = 0;
    gameOver = false;
    scoreText;
    w = {w:596, h:900};
    c = {w:this.w.w/2, h:this.w.h/2};
    pos = [
        {x: this.c.w,      y: this.c.h/3/2},
        {x: this.w.w/3,      y: this.c.h/2},
        {x: this.w.w/3*2,    y: this.c.h/2},
    ];

    preload ()
    {
        console.log('SceneGame');
        this.load.image('field', 'assets/field.png');
        this.load.image('hit', 'assets/hit.png');
        this.load.image('ball', 'assets/bomb.png');


        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
       
    }

    create ()
    {
        console.log('SceneTitle START');
        //this.cameras.main.zoom = 0.5;

        // Player anime
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        

        // BG
        this.add.image(this.c.w, this.c.h, 'field');

        // Player
        const teamMy=[
            {s:500, a:500},
            {s:500, a:500},
            {s:500, a:500},
        ];
        const teamEnemy=[
            {s:500, a:500},
            {s:500, a:500},
            {s:500, a:500},
        ];

        this.players = this.physics.add.group();
        this.players.runChildUpdate = true;
        this.enemies = this.physics.add.group();
        this.enemies.runChildUpdate = true;

        
        teamEnemy.forEach((p, i) =>{
            console.dir(this.pos[i]);
            const player = new Player(this.enemies, 'dude', this.pos[i].x, this.pos[i].y, 0x8888ff, p.s, p.a);
        });
        teamMy.forEach((p, i) =>{
            const player = new Player(this.players, 'dude', this.pos[i].x, this.w.h-this.pos[i].y, 0xffffff, p.s, p.a);
            player.getSprite().setInteractive();
        });
        // Goal
        this.hitMy = this.physics.add.sprite(this.w.w/2, 6, 'hit');
        this.hitEnemy = this.physics.add.sprite(this.w.w/2, this.w.h-6, 'hit');


        this.balls = this.physics.add.group();
        this.balls.runChildUpdate = true;
        const ball = new Ball(this.balls, 'ball', this.c.w, this.c.h);
        ball.getSprite().setInteractive();
        
        this.input.on('pointerup', function(pointer) {
            Player.keyDown = false;
        }, this);
        this.input.on('pointerdown', function(pointer) {
            if(Player.keyDown) return;

            if(Player.selectPlayer !== null){
                if(Player.selectPlayer.getHas()){
                    // dribble
                    Player.selectPlayer.startMove(pointer, 0.6);
                    console.log('dribble');
                }else{
                    // run
                    Player.selectPlayer.startMove(pointer);
                    console.log('run');
                }
                Player.selectPlayer.getSprite().setTint(Player.selectPlayer.tint);
                Player.selectPlayer = null;
            }else{
                if(Player.ballPlayer !== null){
                    // kick
                    console.log('kick');
                    Player.ballPlayer = null;
                    ball.startMove(pointer);
                }
            }
        }, this);

        //  The score
        this.scoreText = this.add.text(2, -2, 'score: 0 - 0', { fontSize: '32px', fill: '#FF0' });

        //this.physics.add.collider(this.balls, this.players);
        //this.physics.add.collider(this.balls, this.enemies);

        this.physics.add.overlap(this.balls, this.hitMy, this.inGoalMy, null, this);
        this.physics.add.overlap(this.balls, this.hitEnemy, this.inGoalEnemy, null, this);

        this.physics.add.overlap(this.players, this.enemies, this.hitPlayer, null, this);

        this.physics.add.overlap(this.players, this.balls, this.hitBall, null, this);
        this.physics.add.overlap(this.enemies, this.balls, this.hitBall, null, this);

    }

    update(time, delta)
    {
        if (this.gameOver)
        {
            console.log('SceneGame END');
            this.scene.start('SceneTitle');
            return;
        }

        if(Player.ballPlayer !== null){
            console.dir(Player.ballPlayer);
            this.balls.children.iterate(function (child) {
                child.copyPosition(Player.ballPlayer);
            }, this);
        }
    }
    

    inGoalMy (ball, hit)
    {
        this.scoreMy += 1;
        this.reset();
    }
    inGoalEnemy (ball, hit)
    {
        this.scoreEnemy += 1;
        this.reset();
    }

    reset()
    {
        this.scoreText.setText("score: " + this.scoreMy + " - " + this.scoreEnemy);
        this.balls.children.iterate(function (child) {
            child.getParent().reset();
        }, this);
        this.enemies.children.iterate(function (child) {
            child.getParent().reset();
        }, this);
        this.players.children.iterate(function (child) {
            child.getParent().reset();
        }, this);
    }

    hitBall (player, ball)
    {
        Player.ballPlayer = player;
    }

    hitPlayer (a, b)
    {
        a.setTint(0xff0000);
        b.setTint(0xff0000);
    }
}