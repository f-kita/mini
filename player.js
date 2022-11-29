import { Moves }  from './moves.js'

export class Player extends Moves{

    static selectPlayer = null;
    static ballPlayer = null;
    static keyDown = false;

    constructor(group, spriteName, x, y, tint, maxVelocity, acceleration) {
        super(group, spriteName, x, y, maxVelocity, acceleration);
        this.ball = null; 
        this.tint = tint;
        this.create(group);
    }

    create (group)
    {
        group.add(this.sprite);
        this.sprite.getParent=()=>this;
        this.sprite.setBounce(0);
        this.sprite.setCollideWorldBounds(true, 0, 0);
        this.sprite.setTint(this.tint);
        this.sprite.anims.play('turn', true);

        this.sprite.on('pointerdown', function(pointer) {
            console.dir(" down");
            Player.keyDown = true;
            if(Player.selectPlayer){
                Player.selectPlayer.getSprite().setTint(Player.selectPlayer.tint);
            }
                //this.isDown = true;
            Player.selectPlayer = this;
            this.getSprite().setTint(0xff0000);
            
        }, this);

    }
    getHas()
    {
        return this.has;
    }
    setHas(has)
    {
        this.has = has;
    }

    reset()
    {
        this.initPos();
        this.stopMove();
    }
    initPos()
    {
        this.getSprite().setX(this.x);
        this.getSprite().setY(this.y);
    }

    startMove(pointer, wait = 1)
    {
        super.startMove(pointer, wait)
        this.getSprite().anims.play(pointer.x < this.getSprite().body.x ? 'left' : 'right', true);
    }
    stopMove()
    {
        super.stopMove();
        this.getSprite().anims.play('turn', true);
    }
}