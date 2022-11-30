import { Moves }  from './moves.js'

export class Ball extends Moves{

    constructor(group, spriteName, x, y) {

        super(group, spriteName, x, y);
        this.tint = 0xffffff;
        this.create(group);
    }
    name = 'ball';

    create (group)
    {
        this.sprite.getParent=()=>this;
        this.sprite.setBounce(0);
        this.sprite.setCircle(true);
        //this.sprite.setCollideWorldBounds(true);
        this.sprite.setCollideWorldBounds(true, 1, 1);
        this.sprite.setTint(this.tint);
        //this.sprite.setActive(true);

        this.sprite.update = () => {
            if(this.isMove){
                if((Math.abs(this.sprite.body.velocity.x) + Math.abs(this.sprite.body.velocity.y)) < 20){
                    this.stopMove();
                }
            }
        };
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

    startMove(scene, pointer, velocity = 10, wait=-1000)
    {
        velocity *= 100;
        const v = this.getVec(pointer);
//        console.log("x:"+v.x);
//        console.log("y:"+v.y);
        const abs = (Math.abs(v.x) + Math.abs(v.y))
        const ratio_x = v.x / abs;
        const ratio_y = v.y / abs;
//        console.log("ratio_x:"+ratio_x);
//        console.log("ratio_y:"+ratio_y);
        this.getSprite().setAcceleration(ratio_x * wait, ratio_y * wait);
        this.getSprite().setVelocity(ratio_x * velocity, ratio_y * velocity);
        
    }
    stopMove()
    {
        super.stopMove();
    }
}