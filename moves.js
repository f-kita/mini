export class Moves {
    sprite = null;
    name = 'moves';

    constructor(group, spriteName, x, y, maxVelocity=0, acceleration=0) {
        this.isMove = false;
        this.maxVelocity = maxVelocity;
        this.acceleration = acceleration;
        this.x = x;
        this.y = y;
        this.target = {x:0,y:0};

        this.sprite = group.create(this.x, this.y, spriteName);
        this.sprite.allowGravity = false;
        this.group = group;
        this.sprite.update = () => {
            if(this.isMove){
                const x = this.target.x - this.sprite.body.x;
                const y = this.target.y - this.sprite.body.y;
                if((Math.abs(x) + Math.abs(y)) < 20){
                    this.stopMove();
                }
            }
        };
    }

    getSprite()
    {
        return this.sprite;
    }


    getVec(pointer)
    {
//        console.log('start '+this.name);
        this.isMove = true;
        this.target.x = pointer.x;
        this.target.y = pointer.y;
        const x = this.target.x - this.getSprite().body.x;
        const y = this.target.y - this.getSprite().body.y;
        return {x:x, y:y};
    }

    startMove(scene, pointer, rate = 1)
    {
//        console.dir("startMove");
//        console.dir("x:"+pointer.x);
//        console.dir("y:"+pointer.y);
        const v = this.getVec(pointer);
        const abs_x = Math.abs(v.x);
        const abs_y = Math.abs(v.y);
        const ratio = rate / (abs_x + abs_y);
//        console.log("ratio:"+ratio);
        //console.dir(v);
        this.getSprite().body.stop();
        this.getSprite().setAcceleration(v.x * ratio * this.acceleration, v.y * ratio * this.acceleration);

        //this.getSprite().setMaxVelocity(abs_x * ratio * this.maxVelocity, abs_y * ratio * this.maxVelocity);
        this.getSprite().body.setMaxSpeed(this.maxVelocity);

        //const angle = scene.physics.moveTo(this.getSprite(), pointer.x, pointer.y, 0 , this.maxVelocity );
        //this.getSprite().body.acceleration = scene.physics.velocityFromAngle(angle, this.acceleration * rate);
    }
    stopMove()
    {
//        console.log('stop '+this.name + " x:"+this.getSprite().body.x + ", y:"+this.getSprite().body.y);
        this.isMove = false;
        this.getSprite().body.stop();
        this.group.scene.nearEnemy=null;
        /*
        this.getSprite().setAccelerationX(0);
        this.getSprite().setAccelerationY(0);
        this.getSprite().setVelocityX(0);
        this.getSprite().setVelocityY(0);
        */
    }
};