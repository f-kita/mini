export class Moves {
    sprite = null;

    constructor(group, spriteName, x, y, maxVelocity=0, acceleration=0) {
        this.isMove = false;
        this.maxVelocity = maxVelocity;
        this.acceleration = acceleration;
        this.x = x;
        this.y = y;
        this.target = {};

        this.sprite = group.create(this.x, this.y, spriteName);
        this.sprite.allowGravity = false;
        this.sprite.update = () => {
            if(this.isMove){
                let x = this.target.x - this.sprite.body.x;
                let y = this.target.y - this.sprite.body.y;
                if(Math.abs(x) < 10 && Math.abs(y) < 10){
                    this.stopMove();
                }
            }
        };
    }

    getSprite()
    {
        return this.sprite;
    }

    startMove(pointer, rate = 1)
    {
        console.log('super start');
        this.isMove = true;
        this.target.x = pointer.x;
        this.target.y = pointer.y;
        const x = this.target.x  - this.getSprite().body.x;
        const y = this.target.y  - this.getSprite().body.y;
        const ratio = this.acceleration * rate / (Math.abs(x) + Math.abs(y));
        this.getSprite().setAccelerationX(x*ratio);
        this.getSprite().setAccelerationY(y*ratio);
        this.getSprite().setMaxVelocity(this.maxVelocity);
    }
    stopMove()
    {
        console.log('super stop');
        this.isMove = false;
        this.getSprite().setAccelerationX(0);
        this.getSprite().setAccelerationY(0);
        this.getSprite().setVelocityX(0);
        this.getSprite().setVelocityY(0);
    }
};