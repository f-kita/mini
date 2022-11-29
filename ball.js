import { Moves }  from './moves.js'

export class Ball extends Moves{

    constructor(group, spriteName, x, y) {

        super(group, spriteName, x, y);
        this.tint = 0xffffff;
        this.create(group);
    }

    create (group)
    {
        this.sprite.getParent=()=>this;
        //this.sprite.setBounce(0);
        //this.sprite.setCircle(true);
        //this.sprite.setCollideWorldBounds(true);
//        this.sprite.setCollideWorldBounds(true, 0, 0);
        this.sprite.setTint(this.tint);
        this.sprite.setActive(true);

        this.sprite.update = () => {
            if(this.isMove){
                if(Math.abs(this.sprite.body.velocity.x) < 10 && Math.abs(this.sprite.body.velocity.y) < 10){
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

    startMove(pointer, velocity = 1000, wait=-1000)
    {
        this.isMove = true;
        this.target.x = pointer.x;
        this.target.y = pointer.y;

        const x = this.target.x  - this.getSprite().body.x;
        const y = this.target.y  - this.getSprite().body.y;
        console.log("x:"+x);
        console.log("y:"+y);
        const abs = (Math.abs(x) + Math.abs(y))
        const ratio_x = x / abs;
        const ratio_y = y / abs;
        console.log("ratio_x:"+ratio_x);
        console.log("ratio_y:"+ratio_y);
        this.getSprite().setAccelerationX(ratio_x * wait);
        this.getSprite().setAccelerationY(ratio_y * wait);
        this.getSprite().setVelocityX(ratio_x * velocity);
        this.getSprite().setVelocityY(ratio_y * velocity);
        
    }
    stopMove()
    {
        super.stopMove();
    }
}