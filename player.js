import { Moves }  from './moves.js'

export class Player extends Moves{

    constructor(group, spriteName, x, y, tint,param) {
        super(group, spriteName, x, y, param.speed, param.accel);
        this.param = param;
        this.ball = null; 
        this.tint = tint;
        this.create(group);
    }

    name = 'player';

    create (group)
    {
        group.add(this.sprite);
        this.sprite.getParent=()=>this;
        this.sprite.setBounce(0);
        this.sprite.setCollideWorldBounds(true, 0, 0);
        this.sprite.setTint(this.tint);
        this.sprite.anims.play('turn', true);
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

    startMove(scene, pointer, wait = 10)
    {
        super.startMove(scene, pointer, wait*0.1);
        this.getSprite().anims.play(pointer.x < this.getSprite().body.x ? 'left' : 'right', true);
    }
    stopMove()
    {
        super.stopMove();
        this.getSprite().anims.play('turn', true);
    }
}