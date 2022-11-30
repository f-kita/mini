import { Player }  from './player.js'
import { Ball }  from './ball.js'

//Game Scene
export class SceneGame extends Phaser.Scene {

    constructor() {
        super({key: 'SceneGame'});
    }
    selectPlayer = null;
    ballPlayer = null;
    kickPlayer = null;
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
            {s:5, a:5, k:10, t:10 },
            {s:5, a:20, k:5, t:10 },
            {s:20, a:5, k:5, t:10 },
        ];
        const teamEnemy=[
            {s:10, a:10, k:10, t:10 },
            {s:10, a:10, k:10, t:10 },
            {s:10, a:10, k:10, t:10 },
        ];

        this.players = this.physics.add.group();
        this.players.runChildUpdate = true;
        this.enemies = this.physics.add.group();
        this.enemies.runChildUpdate = true;

        
        teamEnemy.forEach((p, i) =>{
            console.dir(this.pos[i]);
            const player = new Player(this.enemies, 'dude', this.pos[i].x, this.pos[i].y, 0x8888ff, p);
        });
        teamMy.forEach((p, i) =>{
            const player = new Player(this.players, 'dude', this.pos[i].x, this.w.h-this.pos[i].y, 0xffffff, p);
            const player_sprite = player.getSprite().setInteractive();
            //player_sprite.on('pointerdown', function(pointer, localX, localY, event) {
            player_sprite.on('pointerdown', (pointer, localX, localY, event) => {
                console.dir(" down");
                event.stopPropagation();

                if(this.selectPlayer){
                    this.selectPlayer.getSprite().setTint(this.selectPlayer.tint);
                }
                this.selectPlayer = player;
                player.getSprite().setTint(0xff0000);
                
            });
        });
        // Goal
        this.hitMy = this.physics.add.sprite(this.w.w/2, 6, 'hit');
        this.hitEnemy = this.physics.add.sprite(this.w.w/2, this.w.h-6, 'hit');


        this.balls = this.physics.add.group();
        this.balls.runChildUpdate = true;
        this.ball = new Ball(this.balls, 'ball', this.c.w, this.c.h);
        this.ball.getSprite().setInteractive();
        this.ball.getSprite().body.onWorldBounds = true;
        
        this.input.on('pointerdown', function(pointer) {

            if(this.selectPlayer !== null){
                if(this.selectPlayer.getHas()){
                    // dribble
                    this.selectPlayer.startMove(this, pointer, 0.6);
                    console.log('dribble');
                }else{
                    // run
                    this.selectPlayer.startMove(this, pointer);
                    console.log('run');
                }
                this.selectPlayer.getSprite().setTint(this.selectPlayer.tint);
                this.selectPlayer = null;
            }else{
                if(this.ballPlayer !== null){
                    // kick
                    console.log('kick');
                    this.kickPlayer = this.ballPlayer;
                    this.ballPlayer = null;
                    this.ball.startMove(this, pointer, this.kickPlayer.kick);
                }
            }
        }, this);

        //  The score
        this.scoreText = this.add.text(2, -2, 'score: 0 - 0', { fontSize: '32px', fill: '#FF0' });

        //this.physics.add.collider(this.balls, this.players);
        this.physics.add.overlap(this.balls, this.hitMy, this.inGoalMy, null, this);
        this.physics.add.overlap(this.balls, this.hitEnemy, this.inGoalEnemy, null, this);

        this.physics.add.overlap(this.players, this.enemies, this.hitPlayer, null, this);

        this.physics.add.overlap(this.players, this.balls, this.hitBall, null, this);
        this.physics.add.overlap(this.enemies, this.balls, this.hitBall, null, this);

        this.physics.world.on('worldbounds', this.hitWall);
    }

    update(time, delta)
    {
        // clear kick
        if(this.kickPlayer && this.ball.getSprite().body.touching.none){
            this.kickPlayer = null;
        }
        if (this.gameOver)
        {
            console.log('SceneGame END');
            this.scene.start('SceneTitle');
            return;
        }

        if(this.ballPlayer !== null){
//            console.dir(this.ballPlayer);
            this.balls.children.iterate(function (child) {
                child.copyPosition(this.ballPlayer.getSprite());
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
        if(this.kickPlayer){
            if(this.kickPlayer.getSprite() === player){
                return;
            }
        }
        if(this.ballPlayer){
        //    return ;
        }
        this.ballPlayer = player.getParent();
    }

    hitWall(body, up, down, left, right){
        /*
        console.log('wall name:'+body.gameObject.getParent().name);
console.dir("acceleration.x:"+ body.acceleration.x);
console.dir("acceleration.y:"+ body.acceleration.y);
console.dir("velocity.x:"+ body.velocity.x);
console.dir("velocity.y:"+ up, down, left, right);
*/

        if(up && body.acceleration.y > 0){
            body.acceleration.y *= -1;
            //body.velocity.y *= -1;
        }else if(down && body.acceleration.y < 0){
            body.acceleration.y *= -1;
            //body.velocity.y *= -1;
        }
        if(left && body.acceleration.x > 0){
            body.acceleration.x *= -1;
            //body.velocity.x *= -1;
        }else if(right && body.acceleration.x < 0){
            body.acceleration.x *= -1;
            //body.velocity.x *= -1;
        }
    }

    hitPlayer (a, b)
    {
        a.setTint(0xff0000);
        b.setTint(0xff0000);
    }
}